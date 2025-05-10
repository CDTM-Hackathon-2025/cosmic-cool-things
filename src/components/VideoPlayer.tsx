
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }

    // Reset loaded state when video source changes
    if (videoSrc) {
      setIsLoaded(false);
    }
  }, [isOpen, videoSrc]);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:bg-white/20"
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </Button>
        <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={videoSrc}
            controls
            autoPlay
            onLoadedData={handleVideoLoaded}
            preload="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
