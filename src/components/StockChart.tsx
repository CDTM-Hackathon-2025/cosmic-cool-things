
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Enhanced data with multiple lines and more distinct patterns
const stockData = [
  { 
    date: new Date('2024-05-01'), 
    green: 145.32,
    blue: 162.45,
    red: 168.23
  },
  { 
    date: new Date('2024-05-02'), 
    green: 147.54,
    blue: 157.67,
    red: 172.12
  },
  { 
    date: new Date('2024-05-03'), 
    green: 146.89,
    blue: 163.21,
    red: 167.45
  },
  { 
    date: new Date('2024-05-04'), 
    green: 148.76,
    blue: 159.32,
    red: 171.67
  },
  { 
    date: new Date('2024-05-05'), 
    green: 151.23,
    blue: 166.78,
    red: 169.32
  },
  { 
    date: new Date('2024-05-06'), 
    green: 153.45,
    blue: 158.21,
    red: 172.54
  },
  { 
    date: new Date('2024-05-07'), 
    green: 152.78,
    blue: 167.65,
    red: 168.23
  },
  { 
    date: new Date('2024-05-08'), 
    green: 155.41,
    blue: 159.34,
    red: 173.76
  },
  { 
    date: new Date('2024-05-09'), 
    green: 159.67,
    blue: 169.89,
    red: 166.32
  },
  { 
    date: new Date('2024-05-10'), 
    green: 164.32,
    blue: 165.45,
    red: 170.21
  },
];

interface StockChartProps {
  width?: string | number;
  height?: string | number;
}

const StockChart: React.FC<StockChartProps> = ({ width = '100%', height = 150 }) => {
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-black p-2 border border-gray-300 rounded-md shadow-sm text-xs">
          <p className="font-semibold">{payload[0].payload.date.toLocaleDateString()}</p>
          <p className="text-green-500">AAPL: {payload[0].value.toFixed(2)}€</p>
          <p className="text-blue-500">AMZ: {payload[1].value.toFixed(2)}€</p>
          <p className="text-red-500">BCO: {payload[2].value.toFixed(2)}€</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width, height }} className="rounded-md overflow-hidden bg-white">
      <ResponsiveContainer>
        <LineChart
          data={stockData}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }} // Increased right margin from 10 to 30
        >
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#666', fontSize: 10 }}
            tickFormatter={(date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={['dataMin', 'dataMax']}
            tick={{ fill: '#666', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30} // Added explicit width to YAxis to provide more space
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: 10 }}
          />
          <Line 
            type="monotone" 
            dataKey="green" 
            name="AAPL"
            stroke="#4ade80" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#4ade80" }}
          />
          <Line 
            type="monotone" 
            dataKey="blue" 
            name="AMZ"
            stroke="#33C3F0" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#33C3F0" }}
          />
          <Line 
            type="monotone" 
            dataKey="red" 
            name="BCO"
            stroke="#ea384c" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#ea384c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
