
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

// Speech-to-text function using voice_data context
export async function speechToText(audioBlob: Blob): Promise<string> {
  const { openAI_KEY } = await fetchAPIKeys();
  
  if (!openAI_KEY) {
    throw new Error("OpenAI API key is not set for speech-to-text conversion.");
  }
  
  // Log that we're using voice_data context for this operation
  console.log("Using voice context for speech-to-text operation");
  
  // Check if running on iOS and handle file format accordingly
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  console.log("Device detection - iOS:", isIOS);
  
  const formData = new FormData();
  
  // For iOS devices, we need to ensure the audio is properly formatted
  if (isIOS) {
    console.log("Using iOS-specific audio handling");
    
    // Check the blob type and make sure it's acceptable for the API
    console.log("Original audio blob type:", audioBlob.type);
    
    // iOS may record as audio/mp4 or other formats - convert to proper filename extension
    let filename = "recording.webm";
    if (audioBlob.type.includes("mp4")) {
      filename = "recording.mp4";
    } else if (audioBlob.type.includes("m4a")) {
      filename = "recording.m4a";
    }
    
    // Append with the appropriate filename to help the API identify the format
    formData.append("file", audioBlob, filename);
    console.log("Appended audio with filename:", filename);
  } else {
    // For non-iOS devices, use standard approach
    formData.append("file", audioBlob, "recording.webm");
  }
  
  formData.append("model", "whisper-1");
  
  // Add debug logs for formData content
  console.log("FormData created with file and model");
  
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
    console.error("Detailed error in speech-to-text:", error);
    // Re-throw with more specific message for iOS users
    if (isIOS) {
      throw new Error("iOS speech recognition failed. Please check your OpenAI API key and make sure your microphone permissions are enabled. If the problem persists, try using the text input instead.");
    }
    throw error;
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
