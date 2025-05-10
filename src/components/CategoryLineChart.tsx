
import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Transaction, aggregateTransactionsByCategory } from "@/data/transactionData";

// Define the color scheme for different categories
const CATEGORY_COLORS: Record<string, string> = {
  "Income": "#4ade80", // green
  "Groceries": "#fbbf24", // yellow
  "Rent": "#7c3aed", // purple
  "Utilities": "#38bdf8", // light blue
  "Transportation": "#8b5cf6", // indigo
  "Leisure": "#ec4899", // pink
  "Shopping": "#f87171", // red
  "Health": "#10b981", // emerald
  "Entertainment": "#6366f1", // purple/indigo
  "Other": "#94a3b8", // gray
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 border border-gray-800 rounded-md">
        <h3 className="text-white text-sm font-bold mb-1">{label}</h3>
        {payload.map((entry: any, index: number) => (
          <p 
            key={`item-${index}`} 
            className="text-white text-sm mb-1"
            style={{ color: entry.color }}
          >
            {`${entry.name}: ${entry.value?.toLocaleString()}€`}
          </p>
        ))}
      </div>
    );
  }
  
  return null;
};

interface CategoryLineChartProps {
  transactions: Transaction[];
  timePeriod?: string;
  height?: number | string;
  legendPosition?: "top" | "bottom";
}

const CategoryLineChart: React.FC<CategoryLineChartProps> = ({ 
  transactions,
  timePeriod = "Max", // Default to "Max"
  height = "100%",
  legendPosition = "bottom"
}) => {
  // Filter transactions based on time period
  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timePeriod) {
      case "1D":
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        cutoffDate = new Date(now);
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "1Y":
        cutoffDate = new Date(now);
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "Max":
      default:
        // Use all transactions
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.timestamp) >= cutoffDate);
  }, [transactions, timePeriod]);
  
  // Aggregate data by category and month
  const categoryData = aggregateTransactionsByCategory(filteredTransactions);
  
  // Get all categories from the aggregated data
  const categories = categoryData.length > 0 ? 
    Object.keys(categoryData[0]).filter(key => key !== "name") : [];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={categoryData}
        margin={{ 
          top: 20, 
          right: 20, 
          left: 10, 
          bottom: legendPosition === "bottom" ? 40 : 20 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#999', fontSize: 12 }} 
          axisLine={{ stroke: '#666' }}
          tickLine={{ stroke: '#666' }}
          dy={10}
        />
        <YAxis
          tick={{ fill: '#999', fontSize: 12 }}
          axisLine={{ stroke: '#666' }}
          tickLine={{ stroke: '#666' }}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign={legendPosition} 
          height={36} 
          iconType="circle" 
          iconSize={10}
          wrapperStyle={{ 
            paddingTop: legendPosition === "top" ? "10px" : "0",
            paddingBottom: legendPosition === "bottom" ? "10px" : "0"
          }}
          formatter={(value) => <span style={{color: '#ccc', fontSize: '12px'}}>{value}</span>}
        />
        
        {categories.map((category) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            name={category}
            stroke={CATEGORY_COLORS[category] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
            strokeWidth={2}
            dot={false} // Remove dots 
            activeDot={false} // Remove active dots
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CategoryLineChart;
