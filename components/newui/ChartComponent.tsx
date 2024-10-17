import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { dashboardService } from "./utils/apiroutes";

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  const fetchChartData = async () => {
    try {
      const formDate = "2024-10-02"
      const toDate = "2024-10-17"
      const response = await dashboardService.chartTransactions(formDate , toDate );
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
          <Tooltip />

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