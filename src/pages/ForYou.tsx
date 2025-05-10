import React, { useState, useEffect, useRef, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronLeft, ChevronRight, ExternalLink, Play, Pause, ChartLine, SkipBack, SkipForward } from "lucide-react";
import { Link } from "react-router-dom";
import ChatPopup from "@/components/ChatPopup";
import ProfileMenu from "@/components/ProfileMenu";
import { cn } from "@/lib/utils";
import { fetchAPIKeys } from "@/utils/openaiService";
import StockChart from "@/components/StockChart";
import { Card } from "@/components/ui/card";
import { wealthData } from "@/data/wealthData";
import { transactionData } from "@/data/transactionData";
import ForYouMiniChart from "@/components/ForYouMiniChart";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import speechAudio from "@/data/speech.mp3";
import VideoPlayer from "@/components/VideoPlayer";

// Import video files
import stocksCheckVideo from "@/data/Avatar_AI_stocks_check.mp4";
import longTermGainsVideo from "@/data/Avatar_long_term_gains.mp4";
import seriousVideo from "@/data/Avatar_serious_Video.mp4";

const ForYou = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(120); // Default 2 minutes in seconds
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Calculate total cash based on transaction data only (no initial balance)
  const totalCash = useMemo(() => {
    const transactionsSum = transactionData.reduce((sum, transaction) => sum + transaction.amount, 0);
    return transactionsSum;
  }, []);
  
  // Generate data for the cash chart without the initial 10000€
  const cashChartData = useMemo(() => {
    // Sort transactions by timestamp (oldest first)
    const sortedTransactions = [...transactionData].sort((a, b) => a.timestamp - b.timestamp);
    
    // Initialize chart data with the first transaction
    const chartData = [];
    
    // Running total starting from 0
    let runningTotal = 0;
    
    // Add each transaction to the chart data
    sortedTransactions.forEach(transaction => {
      runningTotal += transaction.amount;
      chartData.push({
        date: new Date(transaction.timestamp),
        value: runningTotal,
        amount: runningTotal,
        timestamp: transaction.timestamp
      });
    });
    
    return chartData;
  }, []);
  
  // Mock data for total amounts (updated)
  const totalWealth = 13751.98;
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(speechAudio);
    
    // Update duration once audio is loaded
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    });
    
    // Update progress during playback
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    });
    
    // Handle audio ending
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(100);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);
  
  // Carousel items with background images and videos
  const carouselItems = [
    {
      title: "Investment Tips",
      description: "Learn how to maximize your returns with these expert tips",
      color: "from-blue-600 to-blue-800",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
      link: "https://support.traderepublic.com/en-nl/1687-The-Basics-of-Trading-and-Financial-Markets",
      video: stocksCheckVideo,
    },
    {
      title: "Market News",
      description: "Stay updated with the latest market trends and news",
      color: "from-green-600 to-green-800",
      image: "/lovable-uploads/c05b3384-fced-4625-9285-717f66bb188f.png",
      video: longTermGainsVideo,
    },
    {
      title: "Save More",
      description: "Effective strategies to increase your savings",
      color: "from-purple-600 to-purple-800",
      image: "/lovable-uploads/7eeb967f-3956-4509-b75f-aa8a7565917b.png",
      link: "https://traderepublic.com/de-de#save-now",
      video: seriousVideo,
    },
    {
      title: "Tipp of the Day",
      description: "Let your personal assistant guide you with a tipp of the day",
      color: "from-orange-600 to-orange-800",
      image: "/lovable-uploads/fcd65efa-c1de-4071-a555-abe79f18921e.png",
    },
    {
      title: "Learn Prompt Engineering",
      description: "Absolve the offical Trade Republic program to learn how to interact with your assistant",
      color: "from-indigo-600 to-indigo-800",
      image: "/lovable-uploads/ced1c936-bc67-4dac-bb50-b08fd8300aa3.png",
      link: "https://learn-prompt-engineering.traderepublic.com",
    }
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Navigate to previous slide
  const prevSlide = () => {
    setActiveIndex((current) => 
      current === 0 ? carouselItems.length - 1 : current - 1
    );
  };

  // Navigate to next slide
  const nextSlide = () => {
    setActiveIndex((current) => 
      (current + 1) % carouselItems.length
    );
  };
  
  // Play button click handler
  const handlePlayButtonClick = () => {
    console.log("Play/pause button clicked - Stock market summary");
    
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Pause playback
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Start/resume playback
      // If we're at the end, start over
      if (progress >= 100 && audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Audio playback error:", error);
        });
    }
  };
  
  // Skip forward 10 seconds
  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10, 
        audioRef.current.duration
      );
    }
  };
  
  // Skip backward 10 seconds
  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  // Handle chat button click
  const handleChatButtonClick = async () => {
    console.log("Chat button clicked, preparing to load API keys...");
    try {
      // Pre-fetch API keys before opening the chat
      const keys = await fetchAPIKeys();
      console.log("API keys pre-fetched for chat:", 
                  keys.openAI_KEY ? "OpenAI key available" : "No OpenAI key", 
                  keys.mistral_KEY ? "Mistral key available" : "No Mistral key");
    } catch (error) {
      console.error("Error pre-fetching API keys:", error);
    }
    
    // Open the chat window
    setIsChatOpen(true);
  };

  // Handle carousel item click for video playback
  const handleCarouselItemClick = (index: number) => {
    // Only handle video playback for the first three items
    if (index <= 2 && carouselItems[index].video) {
      setSelectedVideo(carouselItems[index].video);
      setIsVideoPlayerOpen(true);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate current time based on progress
  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
  const remainingTime = audioRef.current ? 
    audioRef.current.duration - audioRef.current.currentTime : 
    duration - (progress / 100) * duration;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div 
        className="relative bg-black w-[430px] h-[780px]"
        style={{ 
          width: "430px", 
          height: "780px",
        }}
      >
        <ScrollArea className="h-full relative">
          <div className="flex flex-col h-full p-6">
            {/* Navigation tabs with ProfileMenu */}
            <div className="flex items-center gap-4 mb-6 mt-4">
              <div className="flex-1 flex items-center gap-4">
                <Link to="/for-you">
                  <h1 className="text-2xl font-bold text-white">For You</h1>
                </Link>
                <Link to="/">
                  <h1 className="text-2xl font-semibold text-gray-500">Wealth</h1>
                </Link>
                <Link to="/cash">
                  <h1 className="text-2xl font-semibold text-gray-500">Cash</h1>
                </Link>
              </div>
              <div className="flex items-center">
                <ProfileMenu />
              </div>
            </div>
            
            {/* Total Wealth and Cash amounts with mini charts */}
            <div className="mb-4 flex flex-row justify-between items-center bg-gray-900/30 p-3 rounded-lg">
              <div className="flex flex-col">
                <p className="text-gray-500 text-sm mb-1">Total Wealth</p>
                <h2 className="text-xl font-bold text-white">{totalWealth.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</h2>
                <span className="text-green-500 text-xs font-medium">+1.85%</span>
              </div>
              <div className="h-16 w-28">
                <ForYouMiniChart 
                  data={wealthData} 
                  color="#00FF41" 
                  showFullTimeRange={true} 
                  showTooltip={true}
                />
              </div>
            </div>
            
            {/* Cash row with mini chart - updated to use calculated data without initial balance */}
            <div className="mb-6 flex flex-row justify-between items-center bg-gray-900/30 p-3 rounded-lg">
              <div className="flex flex-col">
                <p className="text-gray-500 text-sm mb-1">Total Cash</p>
                <h2 className="text-xl font-bold text-white">{totalCash.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</h2>
                <span className="text-blue-400 text-xs font-medium">Available</span>
              </div>
              <div className="h-16 w-28">
                <ForYouMiniChart 
                  data={cashChartData} 
                  color="#33C3F0" 
                  showFullTimeRange={true}
                  showTooltip={true} 
                />
              </div>
            </div>
            
            {/* Latest Stock Market Analysis section */}
            <div className="flex flex-col mb-6">
              <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-4 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    <ChartLine className="h-5 w-5 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Latest Stock Market Analysis</h2>
                  </div>
                </div>
                
                {/* Audio player with controls */}
                <div className="space-y-3">
                  {/* Progress bar - updated to be thinner */}
                  <div className="w-full">
                    <Slider
                      value={[progress]}
                      min={0}
                      max={100}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="w-full h-1"
                    />
                  </div>
                  
                  {/* Time indicators and controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{formatTime(currentTime)}</span>
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleSkipBack}
                        className="hover:bg-white/10 text-white h-8 w-8"
                      >
                        <SkipBack size={16} />
                      </Button>
                      
                      <Button 
                        onClick={handlePlayButtonClick}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center h-10 w-10 shadow-md"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleSkipForward}
                        className="hover:bg-white/10 text-white h-8 w-8"
                      >
                        <SkipForward size={16} />
                      </Button>
                    </div>
                    
                    <span className="text-xs text-gray-300">-{formatTime(remainingTime)}</span>
                  </div>
                  
                  <div className="text-center text-white text-sm font-medium">
                    2 Minute Market Summary
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trade Republic style carousel */}
            <div className="relative overflow-hidden rounded-xl h-[280px] mb-4">
              {/* Cards */}
              <div className="relative h-full">
                {carouselItems.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-out",
                      index === activeIndex 
                        ? "translate-x-0 opacity-100 z-10" 
                        : index === (activeIndex + 1) % carouselItems.length
                        ? "translate-x-full opacity-0 z-0"
                        : index === (activeIndex - 1 + carouselItems.length) % carouselItems.length
                        ? "-translate-x-full opacity-0 z-0"
                        : "translate-x-full opacity-0 z-0"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-full h-full rounded-xl flex flex-col justify-end p-6 bg-cover bg-center",
                        `bg-gradient-to-br ${item.color}`,
                        index <= 2 && item.video ? "cursor-pointer" : ""
                      )}
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${item.image})`,
                      }}
                      onClick={() => index <= 2 && handleCarouselItemClick(index)}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/90 mb-4">{item.description}</p>
                      {index <= 2 && item.video ? (
                        <Button variant="outline" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 w-full md:w-auto">
                          Play Video
                          <Play size={16} className="ml-2" />
                        </Button>
                      ) : item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 w-full md:w-auto">
                            Learn More
                            <ExternalLink size={16} className="ml-2" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 w-full md:w-auto">
                          {item.title === "Tipp of the Day" ? "Get Tipp" : "Learn More"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 z-20">
                <button 
                  onClick={prevSlide} 
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextSlide} 
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === activeIndex 
                        ? "bg-white w-5" 
                        : "bg-white/60"
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Add spacer to ensure content doesn't get hidden behind fixed buttons */}
            <div className="h-32"></div>
          </div>
        </ScrollArea>
        
        {/* Fixed button at the bottom */}
        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center">
          <Button 
            className="w-full max-w-[350px] bg-white hover:bg-white/90 text-black font-semibold py-6 rounded-full text-lg"
            onClick={handleChatButtonClick}
          >
            <span>Chat</span>
            <MessageCircle size={20} />
          </Button>
        </div>
      </div>
      
      {/* Chat Popup */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Video Player */}
      <VideoPlayer 
        videoSrc={selectedVideo || ''} 
        isOpen={isVideoPlayerOpen} 
        onClose={() => setIsVideoPlayerOpen(false)} 
      />
    </div>
  );
};

export default ForYou;
