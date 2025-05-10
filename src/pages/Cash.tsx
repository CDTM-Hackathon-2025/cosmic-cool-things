
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ChatPopup from "@/components/ChatPopup";
import CategoryLineChart from "@/components/CategoryLineChart";
import { transactionData } from "@/data/transactionData";
import ProfileMenu from "@/components/ProfileMenu";
import ChatButton from "@/components/ChatButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// We'll use the Transaction interface from the data file to avoid type conflicts
import { Transaction } from "@/data/transactionData";

const Cash = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  // State to control the visibility of the work laptop notification
  const [showWorkLaptopNotification, setShowWorkLaptopNotification] = useState(true);

  // Calculate total balance
  useEffect(() => {
    const total = transactionData.reduce((sum, transaction) => sum + transaction.amount, 0);
    setBalance(total);
  }, []);

  // Get 5 most recent transactions
  const recentTransactions = [...transactionData]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Group transactions by date (only for recent 5)
  const groupedTransactions = recentTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
  
  // Handler for the invoice button to navigate to tax statement page
  const handleAddInvoice = () => {
    setShowWorkLaptopNotification(false);
    navigate('/tax-statement');
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
            {/* Navigation tabs */}
            <div className="flex items-center gap-4 mb-6 mt-3">
              <div className="flex-1 flex items-center gap-4">
                <Link to="/for-you">
                  <h1 className="text-2xl font-semibold text-gray-500">For You</h1>
                </Link>
                <Link to="/">
                  <h1 className="text-2xl font-semibold text-gray-500">Wealth</h1>
                </Link>
                <Link to="/cash">
                  <h1 className="text-2xl font-bold text-white">Cash</h1>
                </Link>
              </div>
              <div className="flex items-center">
                <ProfileMenu />
              </div>
            </div>
            
            {/* Balance display */}
            <div className="mb-6">
              <p className="text-gray-500 text-xl mb-0.5">Balance</p>
              <h2 className="text-4xl font-bold text-white">
                {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </h2>
            </div>

            {/* Chart - increased height from 180 to 270 (50% increase) */}
            <div className="mb-5 bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-white text-lg font-bold mb-2">Spending by Category</h3>
              <CategoryLineChart transactions={transactionData} height={270} />
            </div>
            
            {/* Work Laptop Professional Expenditures Notification - Updated with Christine Lagarde's image */}
            {showWorkLaptopNotification && (
              <div className="mb-5 bg-gray-800 p-4 rounded-lg border border-gray-700 relative">
                <button 
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  onClick={() => setShowWorkLaptopNotification(false)}
                >
                  <X size={18} />
                </button>
                
                <div className="flex">
                  <div className="mr-3 flex-shrink-0">
                    <Avatar className="w-12 h-12 border border-gray-700">
                      <AvatarImage 
                        src="https://assets.weforum.org/author/image/FEl5eYCwOvvIK65Uc9cYIIHnsS-lQatkhEXU_aLvpzw.jpg" 
                        alt="Christine Lagarde" 
                        className="object-cover" 
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-800">CL</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white text-md font-semibold mb-1">Professional Expenditure</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Do you want to add your work laptop purchase ($1,600.00) to professional expenditures? An invoice needs to be uploaded to complete the necessary data for filing your tax report at the end of the fiscal year.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleAddInvoice}
                      >
                        Yes, Add and Upload Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transactions section */}
            <div className="relative mb-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
              </div>
              
              {/* Group transactions by date (only 5 most recent) - compressed layout */}
              <div className="space-y-3">
                {Object.entries(groupedTransactions).map(([date, transactions]) => (
                  <div key={date} className="mb-0">
                    <h4 className="text-gray-400 text-xs mb-1">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
                    <div className="space-y-1.5">
                      {transactions.map((transaction, index) => (
                        <div key={index} className={`border-b border-gray-800 pb-1.5 ${index === transactions.length - 1 ? 'mb-0' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <h5 className="text-white text-sm font-medium leading-tight">{transaction.name}</h5>
                              <span className="text-gray-400 text-xs">{transaction.category}</span>
                            </div>
                            <span className={`${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'} text-sm font-medium`}>
                              {transaction.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View all transactions link */}
              <div className="mt-3 text-center">
                <Button 
                  variant="link" 
                  className="text-blue-500 p-0 h-auto"
                  onClick={() => navigate('/all-transactions')}
                >
                  View All Transactions
                </Button>
              </div>
            </div>
            
            {/* Add spacer to ensure content doesn't get hidden behind fixed buttons */}
            <div className="h-16"></div>
          </div>
        </ScrollArea>
        
        {/* Fixed button at the bottom */}
        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center">
          <ChatButton 
            onClick={() => setIsChatOpen(true)}
            className="w-full max-w-[350px] text-lg"
          />
        </div>
      </div>
      
      {/* Chat Popup */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Cash;
