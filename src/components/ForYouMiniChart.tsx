
import React, { useMemo } from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Line, LineChart } from "recharts";

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
