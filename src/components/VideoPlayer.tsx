
import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [isOpen, videoSrc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:bg-white/20"
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </Button>
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          src={videoSrc}
          controls
          autoPlay
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
