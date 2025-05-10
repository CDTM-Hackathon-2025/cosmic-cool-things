
import React, { useMemo } from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Line, LineChart, YAxis } from "recharts";

interface ChartData {
  date: Date | string;
  value?: number;
  amount?: number;
  timestamp?: number;
}

interface ForYouMiniChartProps {
  data: ChartData[];
  color?: string;
  showFullTimeRange?: boolean;
  addNoise?: boolean;
  noiseAmount?: number;
  height?: number | string;
  width?: number | string;
  showTooltip?: boolean;
}

const ForYouMiniChart: React.FC<ForYouMiniChartProps> = ({ 
  data, 
  color = "#33C3F0",
  showFullTimeRange = true,
  addNoise = false,
  noiseAmount = 0.1,
  height = "100%",
  width = "100%",
  showTooltip = false
}) => {
  // Process the data for the chart
  const chartData = useMemo(() => {
    // Convert data to ensure we have proper date objects for sorting
    const processedData = data.map(item => {
      // Convert string dates to Date objects if needed
      const dateObj = typeof item.date === 'string' ? new Date(item.date) : item.date;
      
      // Use timestamp directly if available or calculate from date
      const timestamp = item.timestamp || dateObj.getTime();
      
      // Get the base value
      const baseValue = item.value !== undefined ? item.value : item.amount;
      
      // Add noise to the value if requested
      let value = baseValue;
      if (addNoise && value !== undefined) {
        // Generate random noise within the specified range
        const noise = (Math.random() * 2 - 1) * noiseAmount * value;
        value = value + noise;
      }
      
      return {
        timestamp,
        date: dateObj,
        value
      };
    });
    
    // Sort data by date
    return [...processedData].sort((a, b) => a.timestamp - b.timestamp);
  }, [data, addNoise, noiseAmount]);

  // Calculate min and max values for the domain
  const valueExtent = useMemo(() => {
    if (!chartData.length) return [0, 0];
    
    // Extract all values
    const values = chartData.map(item => item.value || 0);
    
    // Find min and max
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Add a small buffer (2%) to make the chart more visually appealing
    const buffer = (max - min) * 0.02;
    
    return [min - buffer, max + buffer];
  }, [chartData]);

  // Chart config for styling
  const chartConfig = {
    line: {
      theme: {
        light: color,
        dark: color,
      },
    },
  };

  return (
    <div style={{ height, width }} className="relative">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full"
      >
        <LineChart data={chartData}>
          <YAxis 
            domain={valueExtent} 
            hide={true} 
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={showTooltip ? { r: 4, fill: color } : false}
            isAnimationActive={false}
          />
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  labelKey="date" 
                  formatter={(value) => {
                    return typeof value === 'number' ? 
                      value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : 
                      value;
                  }}
                />
              }
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ForYouMiniChart;
