
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileCheck, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProfileMenu from "@/components/ProfileMenu";
import { useToast } from "@/hooks/use-toast";
import { transactionData } from "@/data/transactionData";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "@/components/VideoPlayer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TaxStatement = () => {
  // Generate random 8-digit tax number
  const randomTaxNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [netIncome, setNetIncome] = useState<number | null>(null);
  const [professionalExpenses, setProfessionalExpenses] = useState<any[]>([]);
  const [totalProfessionalExpenses, setTotalProfessionalExpenses] = useState<number>(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize professional expenses on component mount
  useEffect(() => {
    // Filter professional expenses (work-related expenses)
    const workExpenses = transactionData.filter(transaction => 
      transaction.type === 'expense' && 
      (transaction.name.toLowerCase().includes('work') || 
       transaction.name.toLowerCase().includes('laptop') ||
       transaction.name.toLowerCase().includes('office') ||
       transaction.category === 'Other')
    );
    
    // Calculate total professional expenses
    const totalWorkExpenses = workExpenses.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    
    setProfessionalExpenses(workExpenses);
    setTotalProfessionalExpenses(totalWorkExpenses);
  }, []);
  
  const handleRetrieveTaxInfo = () => {
    setIsLoading(true);
    
    // Set a timeout for 2 seconds to simulate loading and then calculate net income
    setTimeout(() => {
      // Calculate net income (sum of all transactions)
      const totalNetIncome = transactionData.reduce((sum, transaction) => sum + transaction.amount, 0);
      setNetIncome(totalNetIncome);
      
      setIsLoading(false);
      toast({
        title: "Tax information retrieved",
        description: "Your tax information has been successfully retrieved.",
      });
    }, 2000);
  };

  const handleSubmitTax = () => {
    setIsSubmitting(true);
    
    // Simulate submitting the tax statement
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Tax Statement Submitted",
        description: "Your tax statement has been successfully submitted for review.",
      });
    }, 1500);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div 
        className="relative bg-black w-[430px] h-[780px]"
        style={{ 
          width: "430px", 
          height: "780px",
        }}
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full p-6">
            {/* Header with Back Button and Profile Menu */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-gray-800 hover:bg-gray-700 h-8 w-8"
                  onClick={() => navigate('/cash')}
                >
                  <ArrowLeft className="h-4 w-4 text-white" />
                </Button>
                <h1 className="text-3xl font-bold text-white">Tax Statement</h1>
              </div>
              <ProfileMenu />
            </div>
            
            {/* Tax Number Display with Help Icon */}
            <div className="mb-6 relative">
              <p className="text-gray-400 mb-2">Your Tax Number</p>
              <div className="flex items-center">
                <p className="bg-gray-900 text-white p-3 rounded-md border border-gray-800 flex-grow">
                  {randomTaxNumber}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 rounded-full bg-transparent"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Video Player */}
            <VideoPlayer
              videoSrc="/src/data/Tax_advice.mp4"
              isOpen={isVideoOpen}
              onClose={() => setIsVideoOpen(false)}
            />
            
            {/* Retrieve Tax Information Button */}
            <Button 
              onClick={handleRetrieveTaxInfo}
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-black font-semibold py-6 mb-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrieving tax information...
                </>
              ) : (
                "Retrieve Tax Information"
              )}
            </Button>
            
            {/* Professional Expenditures Section - Always visible */}
            <Card className="mb-6 bg-gray-900 border-gray-800">
              <CardHeader className="pb-3 flex flex-row justify-between items-center">
                <CardTitle className="text-white text-lg">Professional Expenditures</CardTitle>
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src="https://assets.weforum.org/author/image/FEl5eYCwOvvIK65Uc9cYIIHnsS-lQatkhEXU_aLvpzw.jpg" 
                    alt="Christine Lagarde"
                    className="object-cover" 
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-800">CL</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="pt-0">
                {professionalExpenses.length > 0 ? (
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400 font-medium">Item</TableHead>
                        <TableHead className="text-gray-400 font-medium text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professionalExpenses.map((expense) => (
                        <TableRow key={expense.id} className="border-gray-800">
                          <TableCell className="text-white py-2">{expense.name}</TableCell>
                          <TableCell className="text-red-400 text-right py-2">
                            {Math.abs(expense.amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-gray-800 bg-gray-800/50">
                        <TableCell className="text-white font-medium py-2">Total</TableCell>
                        <TableCell className="text-white font-medium text-right py-2">
                          {totalProfessionalExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-400 text-center py-4">No professional expenses found</p>
                )}
              </CardContent>
            </Card>
            
            {/* Tax Information Display - Only show if tax info is retrieved */}
            {netIncome !== null && (
              <Card className="mb-6 bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Tax Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Net Income:</span>
                      <span className={netIncome >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                        {netIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tax Year:</span>
                      <span className="text-white">2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                        Processed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Submit Tax Button - Only show if tax info is retrieved */}
            {netIncome !== null && (
              <Button 
                onClick={handleSubmitTax}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 mb-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-5 w-5" />
                    Submit Tax Statement
                  </>
                )}
              </Button>
            )}
            
            <div className="text-gray-500 text-sm">
              <p className="mb-2">Note: This is a demonstration of the tax statement feature.</p>
              <p>In a real application, this would connect to an actual tax service API.</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TaxStatement;
