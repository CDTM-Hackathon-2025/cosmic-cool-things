
import React from "react";
import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700">
            <User className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end">
          <DropdownMenuLabel className="text-gray-400">Profile Settings</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
            onClick={() => navigate('/tax-statement')}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Tax Statement</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileMenu;
