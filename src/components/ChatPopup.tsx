
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  sendChatRequest, 
  sendVoiceRequest, 
  speechToText, 
  textToSpeech, 
  fetchAPIKeys, 
  isIOSDevice 
} from "@/utils/openaiService";
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
  const audioStreamRef = useRef<MediaStream | null>(null);
  
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
  
  // Completely rewritten iOS-compatible recording function
  const startRecording = async () => {
    try {
      console.log(`Starting recording on ${isIOS ? "iOS" : "non-iOS"} device`);
      
      // Release any existing stream
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Request microphone access with optimized constraints for iOS
      const constraints: MediaStreamConstraints = {
        audio: isIOS ? 
          // iOS specific constraints - simpler is better
          { 
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false 
          } : 
          // More detailed constraints for other platforms
          {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
      };
      
      console.log("Requesting microphone with constraints:", JSON.stringify(constraints));
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;
      
      console.log("Microphone access granted successfully");
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create appropriate MediaRecorder based on platform
      try {
        // Try to detect supported MIME types
        let mimeType = 'audio/webm';
        
        if (isIOS) {
          // iOS generally supports these formats
          const iosMimeTypes = ['audio/mp4', 'audio/aac', 'audio/m4a'];
          for (const type of iosMimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              mimeType = type;
              console.log(`Found supported iOS MIME type: ${mimeType}`);
              break;
            }
          }
        } else {
          // Non-iOS platforms usually support these
          const standardMimeTypes = ['audio/webm', 'audio/ogg', 'audio/wav'];
          for (const type of standardMimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              mimeType = type;
              console.log(`Found supported standard MIME type: ${mimeType}`);
              break;
            }
          }
        }
        
        console.log(`Creating MediaRecorder with mime type: ${mimeType}`);
        
        // Create recorder with detected MIME type
        const recorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          audioBitsPerSecond: isIOS ? 64000 : 128000 // Lower bitrate for iOS
        });
        
        mediaRecorderRef.current = recorder;
        
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            console.log(`Audio data chunk received: ${event.data.size} bytes, type: ${event.data.type}`);
            audioChunksRef.current.push(event.data);
          }
        });
        
        recorder.addEventListener("stop", async () => {
          console.log("MediaRecorder stopped");
          
          if (audioChunksRef.current.length === 0) {
            console.error("No audio data collected");
            toast({
              title: "Recording Failed",
              description: "No audio was captured. Please check your microphone permissions and try again.",
            });
            setIsLoading(false);
            return;
          }
          
          // Create a blob from the audio chunks
          const mimeType = isIOS ? 'audio/m4a' : 'audio/webm';
          console.log(`Creating final audio blob with type: ${mimeType}`);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log(`Recording completed. Blob size: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
          
          if (audioBlob.size < 1000) {
            console.warn("Warning: Audio recording is too small, may not contain speech");
            toast({
              title: "Recording Failed",
              description: "The recording was too short. Please try again and speak clearly.",
            });
            setIsLoading(false);
            return;
          }
          
          setIsLoading(true);
          
          try {
            console.log("Sending audio to speech-to-text processing...");
            // The speechToText function will handle iOS-specific format issues
            const transcribedText = await speechToText(audioBlob);
            
            if (transcribedText && transcribedText.trim()) {
              console.log("Transcription successful:", transcribedText);
              handleVoiceMessage(transcribedText);
            } else {
              console.warn("Empty transcription received");
              toast({
                title: "Could not detect speech",
                description: "Please try again speaking clearly into the microphone",
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
        });
        
        console.log("Starting MediaRecorder");
        recorder.start(1000); // Use 1-second chunks for more frequent data collection
        setIsRecording(true);
      } catch (error) {
        console.error("Error creating MediaRecorder:", error);
        toast({
          title: "Recording Not Supported",
          description: "Your device doesn't support the required audio recording features.",
        });
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
    console.log("Stopping recording...");
    
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping MediaRecorder");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop and release the audio stream
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => {
          console.log(`Stopping audio track: ${track.kind}, ID: ${track.id}`);
          track.stop();
        });
        audioStreamRef.current = null;
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

  // The rest of your component render function remains largely the same
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-md w-[81vw] p-0 gap-0 h-[80vh] flex flex-col rounded-lg">
        {/* Assistant profile header */}
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
