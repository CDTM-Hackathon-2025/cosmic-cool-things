import { chatContextData } from "@/data/chat_data";
import { voiceContextData } from "@/data/voice_data";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Function to fetch API keys from Supabase
export async function fetchAPIKeys() {
  try {
    console.log("Fetching API keys from Supabase secrets table...");
    // Fetch OpenAI key
    const { data: openaiData, error: openaiError } = await supabase
      .from('secrets')
      .select('text')
      .eq('id', 'openai')
      .maybeSingle();
      
    if (openaiError) {
      console.error("Error fetching OpenAI key from Supabase:", openaiError.message);
    } else {
      console.log("OpenAI key fetch result:", openaiData ? "Key found" : "No key found");
    }
    
    // Fetch Mistral key
    const { data: mistralData, error: mistralError } = await supabase
      .from('secrets')
      .select('text')
      .eq('id', 'mistral')
      .maybeSingle();
      
    if (mistralError) {
      console.error("Error fetching Mistral key from Supabase:", mistralError.message);
    } else {
      console.log("Mistral key fetch result:", mistralData ? "Key found" : "No key found");
    }

    // Get keys from Supabase table or fallback to localStorage
    const openAI_KEY = openaiData?.text || localStorage.getItem("openai-api-key") || "";
    const mistral_KEY = mistralData?.text || localStorage.getItem("mistral-api-key") || "";

    console.log("API keys loaded:", 
      openAI_KEY ? "OpenAI key available" : "No OpenAI key", 
      mistral_KEY ? "Mistral key available" : "No Mistral key");

    return { openAI_KEY, mistral_KEY };
  } catch (error) {
    console.error("Unexpected error fetching API keys:", error);
    // Fallback to localStorage
    return {
      openAI_KEY: localStorage.getItem("openai-api-key") || "",
      mistral_KEY: localStorage.getItem("mistral-api-key") || ""
    };
  }
}

export async function sendChatRequest(userMessage: string): Promise<string> {
  // Check if this is a stock comparison request
  const isStockRequest = isStockComparisonRequest(userMessage);
  
  // Get API keys when sending the chat request
  const { openAI_KEY, mistral_KEY } = await fetchAPIKeys();
  
  // First try Mistral API
  if (mistral_KEY) {
    try {
      const response = await sendMistralRequest(userMessage, mistral_KEY);
      return response;
    } catch (error) {
      console.error("Error calling Mistral API:", error);
      // Fall back to OpenAI if Mistral fails
    }
  }
  
  // Fall back to OpenAI or use fallback responses
  if (!openAI_KEY) {
    console.warn("Neither Mistral nor OpenAI API key is set. Using fallback response mode.");
    return getFallbackResponse(userMessage);
  }
  
  try {
    return await sendOpenAIRequest(userMessage, openAI_KEY, false, isStockRequest);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return getFallbackResponse(userMessage);
  }
}

// Function to check if user is asking about stock comparisons
function isStockComparisonRequest(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // Check for keywords related to stock comparison
  const hasComparisonKeywords = /compar(e|ison)|vs\.?|versus|against|difference|chart|graph|plot/i.test(lowerCaseMessage);
  const hasStockKeywords = /stock(s)?|share(s)?|market|invest(ment|ing)?|price/i.test(lowerCaseMessage);
  
  // Check for specific company names
  const hasCompanyNames = /apple|amazon|boeing|aapl|amz|bco/i.test(lowerCaseMessage);
  
  // Message either needs to have both comparison and stock keywords, or explicitly mention multiple companies
  return (hasComparisonKeywords && hasStockKeywords) || 
         (hasStockKeywords && hasCompanyNames);
}

// Voice-specific request that uses voice_data.ts
export async function sendVoiceRequest(userMessage: string): Promise<string> {
  const isStockRequest = isStockComparisonRequest(userMessage);
  const { openAI_KEY } = await fetchAPIKeys();
  
  if (!openAI_KEY) {
    console.warn("OpenAI API key is not set for voice processing. Using fallback response mode.");
    return getFallbackResponse(userMessage);
  }
  
  try {
    // Pass true to indicate this is a voice request and the stock request flag
    return await sendOpenAIRequest(userMessage, openAI_KEY, true, isStockRequest);
  } catch (error) {
    console.error("Error calling OpenAI API for voice request:", error);
    return getFallbackResponse(userMessage);
  }
}

async function sendMistralRequest(userMessage: string, apiKey: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: chatContextData.systemPrompt
    },
    {
      role: "user",
      content: userMessage
    }
  ];
  
  console.log("Sending request to Mistral API...");
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Mistral API error response:", errorText);
    throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Mistral API response received successfully");
  return data.choices[0].message.content;
}

async function sendOpenAIRequest(
  userMessage: string, 
  apiKey: string, 
  isVoiceRequest: boolean = false, 
  isStockRequest: boolean = false
): Promise<string> {
  // Use different system prompts based on whether this is a voice request
  let systemPrompt = isVoiceRequest ? voiceContextData.systemPrompt : chatContextData.systemPrompt;

  // Add stock plot information to system prompt if this is a stock comparison request
  if (isStockRequest) {
    systemPrompt += `\n\nAfter your response, a stock price comparison chart will be shown for Apple, Amazon, and Boeing. 
    Please introduce the chart at the end of your response with a phrase like "Let me show you a visual comparison of these stocks" 
    or "Here's a chart of the stock prices to help you visualize the differences".`;
  }
  
  console.log("System Prompt:", systemPrompt);
  console.log("Is stock request:", isStockRequest);
  
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: userMessage
    }
  ];
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: isVoiceRequest ? voiceContextData.voicePreferences.maxResponseLength : 500,
      temperature: isVoiceRequest ? 0.6 : 0.7 // Slightly lower temperature for more consistent voice responses
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Fallback responses when API is not available
function getFallbackResponse(userMessage: string): string {
  const lowercaseMessage = userMessage.toLowerCase();
  
  if (lowercaseMessage.includes("balance") || lowercaseMessage.includes("account")) {
    return "Your current balance is €1,245.32 in your main account.";
  } else if (lowercaseMessage.includes("invest") || lowercaseMessage.includes("stock")) {
    return "I recommend diversifying your investments across different asset classes based on your risk tolerance and financial goals.";
  } else if (lowercaseMessage.includes("budget") || lowercaseMessage.includes("spend")) {
    return "Based on your recent transactions, you might want to consider reducing discretionary spending to meet your savings goals.";
  } else {
    return "Thanks for your message. As your financial assistant, I'm here to help you manage your finances better. Is there something specific about your accounts or finances you'd like to know?";
  }
}

// Display diagnostic info on screen for iOS-specific debugging
export function displayIOSError(error: any): void {
  const errorContainer = document.createElement('div');
  errorContainer.style.position = 'fixed';
  errorContainer.style.bottom = '70px';
  errorContainer.style.left = '10px';
  errorContainer.style.right = '10px';
  errorContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  errorContainer.style.color = 'red';
  errorContainer.style.padding = '10px';
  errorContainer.style.borderRadius = '5px';
  errorContainer.style.zIndex = '9999';
  errorContainer.style.fontSize = '12px';
  errorContainer.style.maxHeight = '30%';
  errorContainer.style.overflow = 'auto';
  
  // Extract useful information from error
  let errorMessage = 'iOS Speech Recognition Error:\n';
  
  if (typeof error === 'object' && error !== null) {
    errorMessage += `Type: ${error.name || 'Unknown'}\n`;
    errorMessage += `Message: ${error.message || 'No message'}\n`;
    
    if (error.response) {
      errorMessage += `Status: ${error.response.status}\n`;
      errorMessage += `Response: ${JSON.stringify(error.response.data || {})}\n`;
    }
    
    if (error.stack) {
      errorMessage += `Stack: ${error.stack}\n`;
    }
  } else {
    errorMessage += String(error);
  }
  
  errorContainer.textContent = errorMessage;
  
  // Add a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.padding = '5px';
  closeButton.style.background = 'white';
  closeButton.style.border = '1px solid #ccc';
  closeButton.style.borderRadius = '3px';
  closeButton.onclick = () => document.body.removeChild(errorContainer);
  
  errorContainer.appendChild(document.createElement('br'));
  errorContainer.appendChild(closeButton);
  
  document.body.appendChild(errorContainer);
  
  // Remove after 60 seconds if not closed manually
  setTimeout(() => {
    if (document.body.contains(errorContainer)) {
      document.body.removeChild(errorContainer);
    }
  }, 60000);
}

// Speech-to-text function using voice_data context
export async function speechToText(audioBlob: Blob): Promise<string> {
  const { openAI_KEY } = await fetchAPIKeys();
  
  if (!openAI_KEY) {
    throw new Error("OpenAI API key is not set for speech-to-text conversion.");
  }
  
  // Log that we're using voice_data context for this operation
  console.log("Using voice context for speech-to-text operation");
  
  // Enhanced iOS detection - more thorough check
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  console.log("Device detection - iOS:", isIOS, "User Agent:", navigator.userAgent);
  
  const formData = new FormData();
  
  // For iOS devices, we need to ensure the audio is properly formatted
  if (isIOS) {
    console.log("iOS detected - Using iOS-specific audio handling");
    console.log("Original audio blob type:", audioBlob.type);
    console.log("Audio blob size:", audioBlob.size, "bytes");
    
    try {
      // Create a new blob with explicit mime type
      const audioType = audioBlob.type || '';
      console.log("Original audio MIME type:", audioType);
      
      // Determine best audio format based on what iOS likely recorded
      let processedBlob = audioBlob;
      let filename = "recording.m4a"; // Default for iOS
      
      // Check specific types and set appropriate format
      if (audioType.includes("webm")) {
        filename = "recording.webm";
        console.log("Using webm format");
      } else if (audioType.includes("mp4")) {
        filename = "recording.mp4";
        console.log("Using mp4 format");
      } else if (audioType === "") {
        // If no type, iOS typically uses m4a
        processedBlob = new Blob([audioBlob], { type: 'audio/m4a' });
        console.log("Empty MIME type - forcing audio/m4a");
      }
      
      console.log("Final MIME type:", processedBlob.type || 'No MIME type (using filename extension)');
      console.log("Using filename:", filename);
      
      // Append with the appropriate filename to help the API identify the format
      formData.append("file", processedBlob, filename);
      
      // Add API model
      formData.append("model", "whisper-1");
      
      // Add detailed logging for request preparation
      console.log("FormData prepared with file and model");
      console.log("Starting iOS-specific request to Whisper API...");
      
      // Add response format specification for iOS
      formData.append("response_format", "json");
      
      // Make the API request with extra logging
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAI_KEY}`
        },
        body: formData
      });
      
      console.log("iOS Whisper API response status:", response.status);
      
      // Enhanced error handling for iOS
      if (!response.ok) {
        const errorText = await response.text();
        console.error("iOS Whisper API error response:", errorText);
        
        // Create detailed error for diagnosis
        let errorDetail = `Status: ${response.status}, iOS audio format: ${filename}, Size: ${audioBlob.size} bytes`;
        
        if (response.status === 400) {
          const error = new Error(`iOS audio format error (${errorDetail}). ${errorText}`);
          displayIOSError(error); // Show error on screen
          throw error;
        } else if (response.status === 401) {
          const error = new Error(`Authentication failed for iOS (${errorDetail}). Your OpenAI API key might be invalid.`);
          displayIOSError(error); // Show error on screen
          throw error;
        } else {
          const error = new Error(`OpenAI Whisper API error for iOS: ${response.status} ${response.statusText} (${errorDetail}). ${errorText}`);
          displayIOSError(error); // Show error on screen
          throw error;
        }
      }
      
      const data = await response.json();
      console.log("Successfully transcribed iOS audio:", data);
      return data.text;
    } catch (error) {
      console.error("Detailed error in iOS speech-to-text:", error);
      displayIOSError(error); // Show error on screen
      throw error;
    }
  } else {
    // Non-iOS devices - keep original implementation
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");
    
    try {
      console.log("Sending audio to OpenAI Whisper API...");
      
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAI_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI Whisper API error response:", errorText);
        throw new Error(`OpenAI Whisper API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Successfully transcribed audio");
      return data.text;
    } catch (error) {
      console.error("Error in speech-to-text:", error);
      throw error;
    }
  }
}

// Text-to-speech function using voice preferences from voice_data
export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  const { openAI_KEY } = await fetchAPIKeys();
  
  if (!openAI_KEY) {
    throw new Error("OpenAI API key is not set for text-to-speech conversion.");
  }
  
  // Log that we're using voice_data preferences for this operation
  console.log("Using voice preferences for text-to-speech operation");
  
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAI_KEY}`
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: voiceContextData.voicePreferences.voiceType === "friendly" ? "alloy" : "onyx", // Map voice type to OpenAI voice
      input: text,
      speed: voiceContextData.voicePreferences.speechRate === "slow" ? 0.8 : 
             voiceContextData.voicePreferences.speechRate === "fast" ? 1.2 : 1.0 // Map speech rate to speed parameter
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.arrayBuffer();
}
