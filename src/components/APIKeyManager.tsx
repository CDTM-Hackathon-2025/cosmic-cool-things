import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface APIKeyManagerProps {
  onClose?: () => void;
}

const APIKeyManager = ({ onClose }: APIKeyManagerProps) => {
  // Only open the dialog if explicitly opened by the user through the ProfileMenu
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");
  const { toast } = useToast();

  // Set isOpen to true if the component is rendered
  // This ensures it only opens when explicitly called from ProfileMenu
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Load API keys from Supabase on component mount
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        // Fetch OpenAI key
        const { data: openaiData, error: openaiError } = await supabase
          .from('secrets')
          .select('text')
          .eq('id', 'openai')
          .maybeSingle();
          
        if (openaiError) {
          console.log("Error fetching OpenAI key:", openaiError.message);
        } else if (openaiData && openaiData.text) {
          setOpenaiKey(openaiData.text);
          // Also store in localStorage as a fallback
          localStorage.setItem("openai-api-key", openaiData.text);
        }
        
        // Fetch Mistral key
        const { data: mistralData, error: mistralError } = await supabase
          .from('secrets')
          .select('text')
          .eq('id', 'mistral')
          .maybeSingle();
          
        if (mistralError) {
          console.log("Error fetching Mistral key:", mistralError.message);
        } else if (mistralData && mistralData.text) {
          setMistralKey(mistralData.text);
          // Also store in localStorage as a fallback
          localStorage.setItem("mistral-api-key", mistralData.text);
        }
      } catch (error) {
        console.log("Unexpected error fetching API keys:", error);
      }
    };

    fetchKeys();
  }, []);

  const handleSaveOpenAIKey = async () => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ id: 'openai', text: openaiKey.trim() })
        .select();

      if (error) {
        console.log("Error saving OpenAI key to Supabase:", error.message);
        toast({
          title: "Error Saving OpenAI API Key",
          description: "There was a problem saving your API key. Please try again.",
        });
        return;
      }

      // Save to localStorage as fallback
      if (openaiKey.trim()) {
        localStorage.setItem("openai-api-key", openaiKey.trim());
      } else {
        localStorage.removeItem("openai-api-key");
      }

      toast({
        title: "OpenAI API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
    } catch (error) {
      console.log("Unexpected error saving OpenAI key:", error);
      toast({
        title: "Error Occurred",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleSaveMistralKey = async () => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ id: 'mistral', text: mistralKey.trim() })
        .select();

      if (error) {
        console.log("Error saving Mistral key to Supabase:", error.message);
        toast({
          title: "Error Saving Mistral API Key",
          description: "There was a problem saving your API key. Please try again.",
        });
        return;
      }

      // Save to localStorage as fallback
      if (mistralKey.trim()) {
        localStorage.setItem("mistral-api-key", mistralKey.trim());
      } else {
        localStorage.removeItem("mistral-api-key");
      }

      toast({
        title: "Mistral API Key Saved",
        description: "Your Mistral API key has been saved successfully.",
      });
    } catch (error) {
      console.log("Unexpected error saving Mistral key:", error);
      toast({
        title: "Error Occurred",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleSaveAllKeys = () => {
    handleSaveOpenAIKey();
    handleSaveMistralKey();
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Model API Keys</DialogTitle>
          <DialogDescription>
            Enter your API keys to enable the chat functionality.
            Keys will be stored in your Supabase database.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="mistral" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mistral">Mistral AI</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mistral" className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Enter your Mistral AI API key for primary chat functionality.
              </p>
              <Input
                value={mistralKey}
                onChange={(e) => setMistralKey(e.target.value)}
                placeholder="Enter Mistral API key..."
                className="col-span-3"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Enter your OpenAI API key for backup chat functionality.
              </p>
              <Input
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter OpenAI API key (sk-...)..."
                className="col-span-3"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <Button onClick={handleSaveAllKeys} className="mt-2">Save Keys</Button>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyManager;
