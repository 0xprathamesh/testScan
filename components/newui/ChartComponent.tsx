import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { dashboardService } from "./utils/apiroutes";

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  const fetchChartData = async () => {
    try {
      const response = await dashboardService.chartTransactions(2024,2024);
      const formattedData = response?.chart_data?.map((item: any) => ({
        date: item.date,
        tx_count: item.tx_count,
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="tx_count" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;