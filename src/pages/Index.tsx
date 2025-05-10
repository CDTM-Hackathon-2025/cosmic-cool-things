
import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ChatPopup from "@/components/ChatPopup";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { wealthData } from "@/data/wealthData";
import ProfileMenu from "@/components/ProfileMenu";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    // Make sure payload[0].value exists before accessing it
    const value = payload[0]?.value !== undefined 
      ? payload[0].value.toLocaleString() 
      : 'N/A';
      
    return (
      <div className="bg-black/80 p-2 border border-gray-800 rounded-md">
        <p className="text-white text-sm">{`${payload[0].payload.date.toLocaleDateString()}: ${value}€`}</p>
      </div>
    );
  }
  return null;
};

// Updated investments data with adjusted percentages
const investments = [
  { name: "Meta Platforms (A)", performance: "▲ 13,77%", value: "1,205.67 €", isPositive: true },
  { name: "Apple Inc.", performance: "▲ 5,73%", value: "892.30 €", isPositive: true },
  { name: "Microsoft Corp.", performance: "▲ 8,40%", value: "756.40 €", isPositive: true },
  { name: "Alphabet Inc.", performance: "▲ 4,36%", value: "623.75 €", isPositive: true },
  { name: "Amazon.com Inc.", performance: "▲ 3,57%", value: "512.80 €", isPositive: true },
];

// Calculate percentage gain
const calculatePercentageGain = () => {
  const startCapital = 13501;
  const currentTotal = 13751.98;
  const gain = currentTotal - startCapital;
  const percentageGain = (gain / startCapital) * 100;
  return percentageGain.toFixed(2);
};

const Index = () => {
  // State for managing time period selection
  const [timePeriod, setTimePeriod] = useState("Max");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Filter data based on selected time period
  const filteredChartData = useMemo(() => {
    // Sort data by date to ensure we get the latest timestamp
    const sortedData = [...wealthData].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Get the latest timestamp from the data
    const latestTimestamp = sortedData.length > 0 ? sortedData[0].date : new Date();
    let cutoffDate = new Date(latestTimestamp);
    
    switch (timePeriod) {
      case "1D":
        cutoffDate.setDate(latestTimestamp.getDate() - 1);
        break;
      case "1W":
        cutoffDate.setDate(latestTimestamp.getDate() - 7);
        break;
      case "1M":
        cutoffDate.setMonth(latestTimestamp.getMonth() - 1);
        break;
      case "1Y":
        cutoffDate.setFullYear(latestTimestamp.getFullYear() - 1);
        break;
      case "Max":
      default:
        // Use all data
        return wealthData;
    }
    
    return wealthData.filter(item => item.date >= cutoffDate);
  }, [timePeriod]);

  // Format the data for the chart
  const chartData = filteredChartData.map(item => ({
    name: item.date,
    value: item.value,
    date: item.date
  }));
  
  // Calculate min and max values for the YAxis domain
  const valueExtent = useMemo(() => {
    if (!chartData.length) return [0, 0];
    
    // Extract all values
    const values = chartData.map(item => item.value);
    
    // Find min and max
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Add a buffer (1%) to make the chart more visually appealing
    const buffer = (max - min) * 0.01;
    
    return [min - buffer, max + buffer];
  }, [chartData]);

  const percentageGain = calculatePercentageGain();

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
            {/* Navigation tabs with profile menu */}
            <div className="flex items-center gap-4 mb-8 mt-4">
              <div className="flex-1 flex items-center gap-4">
                <Link to="/for-you">
                  <h1 className="text-2xl font-semibold text-gray-500">For You</h1>
                </Link>
                <Link to="/">
                  <h1 className="text-2xl font-bold text-white">Wealth</h1>
                </Link>
                <Link to="/cash">
                  <h1 className="text-2xl font-semibold text-gray-500">Cash</h1>
                </Link>
              </div>
              <div className="flex items-center">
                <ProfileMenu />
              </div>
            </div>
            
            {/* Total amount and percentage */}
            <div className="mb-8">
              <p className="text-gray-500 text-xl mb-1">Total</p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold text-white">13.751,98 €</h2>
                <span className="text-green-500 font-semibold text-xl">▲ {percentageGain}%</span>
              </div>
            </div>
            
            {/* Time period selector */}
            <div className="mb-6">
              <ToggleGroup 
                type="single" 
                value={timePeriod}
                onValueChange={(value) => {
                  if (value) setTimePeriod(value);
                }}
                className="justify-between bg-gray-900/50 rounded-lg p-1"
              >
                {["1D", "1W", "1M", "1Y", "Max"].map((period) => (
                  <ToggleGroupItem
                    key={period}
                    value={period}
                    className={`text-sm font-medium ${
                      timePeriod === period 
                        ? "bg-gray-800 text-white" 
                        : "text-gray-500 hover:text-gray-300"
                    } rounded px-3 py-1 transition-colors`}
                  >
                    {period}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            {/* Chart */}
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#666' }} 
                    axisLine={false}
                    tickLine={false}
                    minTickGap={20}
                    tickFormatter={(date) => {
                      if (date instanceof Date) {
                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      }
                      return '';
                    }}
                  />
                  <YAxis 
                    hide={true}
                    domain={valueExtent} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00FF41" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6, fill: "#00FF41" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Investments section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Top 5 Investments</h3>
                <div className="flex items-center text-gray-400">
                  <span>Since buy</span>
                  <span className="ml-1">▼</span>
                </div>
              </div>
              
              {/* Investment items - showing only top 5 */}
              <div className="space-y-3">
                {investments.map((investment, index) => (
                  <div key={index} className="border-b border-gray-800 pb-2">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-white">{investment.name}</h4>
                        <span className="text-gray-400 text-sm">{investment.value}</span>
                      </div>
                      <span className={`font-bold ${investment.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {investment.performance}
                      </span>
                    </div>
                  </div>
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
            onClick={() => setIsChatOpen(true)}
          >
            <span>Chat</span>
            <MessageCircle size={20} />
          </Button>
        </div>
      </div>
      
      {/* Chat Popup */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
