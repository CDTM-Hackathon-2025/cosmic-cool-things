import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { sendChatRequest, sendVoiceRequest, speechToText, textToSpeech, fetchAPIKeys, isIOSDevice } from "@/utils/openaiService";
import { useToast } from "@/hooks/use-toast";
import StockChart from "@/components/StockChart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
  isChart?: boolean;
}

const ChatPopup = ({ isOpen, onClose }: ChatPopupProps) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you with your finances today?", isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [shouldShowStockChart, setShouldShowStockChart] = useState(false);
  const [keysLoaded, setKeysLoaded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const isIOS = isIOSDevice();

  // Predefined questions
  const quickQuestions = [
    "How are my stocks doing?",
    "Should I buy or sell anything?",
    "What stock news should I know?"
  ];

  // Fetch API keys when the dialog opens
  useEffect(() => {
    if (isOpen && !keysLoaded) {
      const loadKeys = async () => {
        try {
          const keys = await fetchAPIKeys();
          setKeysLoaded(true);
        } catch (error) {
          console.error("Error loading API keys:", error);
          toast({
            title: "API Key Error",
            description: "Failed to load API keys. Some features may not work.",
          });
        }
      };
      
      loadKeys();
    }
  }, [isOpen, toast, keysLoaded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Create an Audio element for playing responses
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => {
      setAudioPlaying(false);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => {
          setAudioPlaying(false);
        });
      }
    };
  }, []);

  // Reset keysLoaded state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setKeysLoaded(false);
    }
  }, [isOpen]);

  // Function to check if message is about stock comparison
  const isStockComparisonRequest = (message: string): boolean => {
    const lowerCaseMessage = message.toLowerCase();
    
    // Check for keywords related to stock comparison
    const hasComparisonKeywords = /compar(e|ison)|vs\.?|versus|against|difference|chart|graph|plot/i.test(lowerCaseMessage);
    const hasStockKeywords = /stock(s)?|share(s)?|market|invest(ment|ing)?|price/i.test(lowerCaseMessage);
    
    // Check for specific company names
    const hasCompanyNames = /apple|amazon|boeing|aapl|amz|bco/i.test(lowerCaseMessage);
    
    // Message either needs to have both comparison and stock keywords, or explicitly mention multiple companies
    return (hasComparisonKeywords && hasStockKeywords) || 
           (hasStockKeywords && hasCompanyNames);
  };

  const handleSendMessage = async (message: string = inputValue.trim()) => {
    if (message === "" || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Clear input field if it's from text input
    if (message === inputValue.trim()) {
      setInputValue("");
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Check if this is a regular text message about stocks
      if (isStockComparisonRequest(message)) {
        // Set flag to show chart after response
        setShouldShowStockChart(true);
      }
      
      // Send request to AI API
      const response = await sendChatRequest(message);
      
      // Add assistant response
      setMessages(prev => [
        ...prev,
        { text: response, isUser: false }
      ]);
      
      // Add chart if it's a stock comparison request
      if (shouldShowStockChart) {
        setMessages(prev => [
          ...prev,
          {
            text: "stock-chart", 
            isUser: false,
            isChart: true
          }
        ]);
        // Reset flag after showing chart
        setShouldShowStockChart(false);
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        { text: "Sorry, I encountered an error processing your request. Please try again.", isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceMessage = async (message: string) => {
    if (message === "" || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Check if this is a stock comparison request via voice
      const isStockRequest = isStockComparisonRequest(message);
      
      // Send request to OpenAI with modified prompt if needed
      const response = await sendVoiceRequest(message);
      
      // Add assistant response
      setMessages(prev => [
        ...prev,
        { text: response, isUser: false }
      ]);
      
      // If this was a stock comparison request, add the chart after the response
      if (isStockRequest) {
        setMessages(prev => [
          ...prev,
          {
            text: "stock-chart", 
            isUser: false,
            isChart: true
          }
        ]);
      }
      
      // Convert response to speech
      const audioBuffer = await textToSpeech(response);
      
      // Play the audio
      if (audioRef.current) {
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        audioRef.current.play();
        setAudioPlaying(true);
        
        // Clean up the URL after playing
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url);
          setAudioPlaying(false);
        };
      }
    } catch (error) {
      console.error("Failed to get voice response:", error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        { text: "Sorry, I encountered an error processing your voice request. Please try again.", isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Enhanced microphone recording start function with better iOS support
  const startRecording = async () => {
    try {
      console.log("Attempting to access microphone...");
      
      // Request microphone access with optimal settings for speech recognition
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // Higher sample rate for better quality
          channelCount: 1,   // Mono audio is sufficient for speech
        } 
      });
      
      console.log("Microphone access granted successfully");
      
      // Determine the optimal recording configuration based on platform
      const isIOS = isIOSDevice();
      console.log(`Device detected: ${isIOS ? "iOS" : "Non-iOS"}`);
      
      let options: MediaRecorderOptions = {};
      
      if (isIOS) {
        // For iOS, we need to use compatible formats
        console.log("Using iOS-compatible audio format");
        options = { 
          mimeType: 'audio/mp4',  // This translates to m4a on iOS
          audioBitsPerSecond: 128000 // Higher bitrate for better quality
        };
      } else {
        // For other platforms, use WebM
        console.log("Using standard WebM audio format");
        options = { 
          mimeType: 'audio/webm',
          audioBitsPerSecond: 128000
        };
      }
      
      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        console.log(`MediaRecorder created with options: ${JSON.stringify(options)}`);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log(`Audio data chunk received, size: ${event.data.size} bytes`);
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          console.log("MediaRecorder stopped, processing audio...");
          
          // Combine audio chunks
          const audioType = isIOS ? 'audio/mp4' : 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: audioType });
          
          console.log(`Recording completed. Blob type: ${audioBlob.type}, size: ${audioBlob.size} bytes`);
          
          if (audioBlob.size < 1000) {
            console.warn("Audio recording is too small, may not contain speech");
            toast({
              title: "Recording Failed",
              description: "No audio was captured. Please check your microphone access and try again.",
            });
            setIsLoading(false);
            return;
          }
          
          try {
            setIsLoading(true);
            // Convert speech to text using the Whisper API
            console.log("Sending audio to speech-to-text service...");
            const transcribedText = await speechToText(audioBlob);
            
            if (transcribedText.trim()) {
              console.log("Transcription received:", transcribedText);
              // Handle the transcribed message
              handleVoiceMessage(transcribedText);
            } else {
              console.warn("Empty transcription received");
              toast({
                title: "Could not detect speech",
                description: "Please try again speaking clearly",
              });
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Speech recognition failed:", error);
            toast({
              title: "Speech Recognition Failed",
              description: "Please check your microphone and try again.",
            });
            setIsLoading(false);
          }
        };
        
        // Use smaller timeSlice for more frequent data collection
        // This helps with audio quality, especially on iOS
        console.log("Starting MediaRecorder with 250ms timeslice");
        mediaRecorder.start(250);
        setIsRecording(true);
        
      } catch (mediaRecorderError) {
        console.error("Error creating MediaRecorder:", mediaRecorderError);
        
        // If MediaRecorder fails with the specified MIME type, try with default settings
        console.log("Trying with default MediaRecorder settings");
        const fallbackRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = fallbackRecorder;
        audioChunksRef.current = [];
        
        fallbackRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        fallbackRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current);
          console.log(`Fallback recording completed. Blob type: ${audioBlob.type}, size: ${audioBlob.size} bytes`);
          
          try {
            setIsLoading(true);
            const transcribedText = await speechToText(audioBlob);
            
            if (transcribedText.trim()) {
              handleVoiceMessage(transcribedText);
            } else {
              toast({
                title: "Could not detect speech",
                description: "Please try again speaking clearly",
              });
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Speech recognition failed:", error);
            toast({
              title: "Speech Recognition Failed",
              description: "Please check your microphone and try again.",
            });
            setIsLoading(false);
          }
        };
        
        fallbackRecorder.start();
        setIsRecording(true);
      }
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings and try again.",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const stopAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioPlaying(false);
    }
  };
  
  const handleMicrophoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle quick question selection
  const handleQuickQuestionClick = (question: string) => {
    // Set input value and send the message
    setInputValue(question);
    handleSendMessage(question);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-md w-[81vw] p-0 gap-0 h-[80vh] flex flex-col rounded-lg">
        {/* Assistant profile header - Updated with Christine Lagarde's image */}
        <div className="p-4 border-b flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src="https://assets.weforum.org/author/image/FEl5eYCwOvvIK65Uc9cYIIHnsS-lQatkhEXU_aLvpzw.jpg" 
              alt="Republica Avatar"
              className="object-cover" 
            />
            <AvatarFallback className="bg-purple-100 text-purple-800">RP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-base">Republica</h3>
            <p className="text-sm text-gray-600">Financial Assistant</p>
          </div>
        </div>
        
        {/* Chat messages area */}
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
            >
              {message.isChart ? (
                <div className="mb-2">
                  <StockChart height={150} />
                </div>
              ) : (
                <div 
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isUser 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block rounded-lg px-4 py-2 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick questions */}
        <div className="border-t border-b p-2 flex flex-wrap gap-2 justify-center">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestionClick(question)}
              disabled={isLoading || isRecording}
              className="bg-gray-100 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors text-gray-800 flex-shrink-0"
            >
              {question}
            </button>
          ))}
        </div>
        
        {/* Input area */}
        <div className="p-4 flex gap-2 items-center">
          {audioPlaying && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
              onClick={stopAudio}
              disabled={isLoading || isRecording}
            >
              <VolumeX className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              className="pr-12 bg-gray-100 border-0"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={false}
              onClick={handleInputFocus}
              disabled={isLoading || isRecording}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {inputValue ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSendMessage()}
                  className="h-8 w-8"
                  disabled={isLoading || isRecording}
                >
                  <Send className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isRecording ? "bg-red-100" : ""}`}
                  onClick={handleMicrophoneClick}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5 text-red-500" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {isRecording && (
            <div className="flex items-center">
              <div className="animate-pulse h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-red-500">Recording...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;
