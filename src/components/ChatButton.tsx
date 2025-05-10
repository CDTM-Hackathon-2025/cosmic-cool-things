
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button 
      className="bg-white hover:bg-white/90 text-black font-semibold py-6 rounded-full transition-colors flex items-center justify-center gap-2"
      onClick={onClick}
    >
      <span>Chat</span>
      <MessageCircle size={20} />
    </Button>
  );
};

export default ChatButton;
