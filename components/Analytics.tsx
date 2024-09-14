"use client";

import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  CubeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "./elements/Loading";

// Registering required chart components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface BlockchainData {
  totalBlocks: number;
  medianGasPrice: string;
  connectedNodes: number;
  isSyncing: boolean;
}

const XDCPriceDashboard = () => {
  const [coinData, setCoinData] = useState<any>(null);
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [rpcUrl, setRpcUrl] = useState<string | null>(null);
  const [coinGeckoApiUrl, setCoinGeckoApiUrl] = useState<string | null>(null);

  // Fetch URLs from localStorage
  useEffect(() => {
    const savedRpcUrl =
      localStorage.getItem("rpcUrl") || "https://erpc.xinfin.network"; // fallback to default if not set
    const savedCoinGeckoApiUrl =
      localStorage.getItem("coinGeckoApiUrl") ||
      "https://api.coingecko.com/api/v3/coins/xdce-crowd-sale?sparkline=true";
    setRpcUrl(savedRpcUrl);
    setCoinGeckoApiUrl(savedCoinGeckoApiUrl);
  }, []);

  const fetchRPCData = async (method: string, params: (string | boolean)[]) => {
    if (!rpcUrl) return null;
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  };

  const fetchData = async () => {
    if (!rpcUrl || !coinGeckoApiUrl) {
      console.error("RPC URL or CoinGecko API URL not available.");
      setLoading(false);
      return;
    }

    try {
      // Fetch coin data from CoinGecko API
      const coinResponse = await fetch(coinGeckoApiUrl);
      const coinData = await coinResponse.json();

      // Fetch blockchain data from XDC RPC
      const [latestBlock, gasPrice, nodeCount, syncing] = await Promise.all([
        fetchRPCData("eth_getBlockByNumber", ["latest", false]),
        fetchRPCData("eth_gasPrice", []),
        fetchRPCData("net_peerCount", []),
        fetchRPCData("eth_syncing", []),
      ]);

      const blockNumber = parseInt(latestBlock.number, 16);
      const medianGasPrice = parseInt(gasPrice, 16) / 1e9; // Convert to Gwei
      const connectedNodes = parseInt(nodeCount, 16);

      setBlockchainData({
        totalBlocks: blockNumber,
        medianGasPrice: `${medianGasPrice.toFixed(2)} Gwei`,
        connectedNodes,
        isSyncing: syncing !== false,
      });

      setCoinData(coinData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Update every 60 seconds
    return () => clearInterval(intervalId);
  }, [rpcUrl, coinGeckoApiUrl]); // Refetch if URLs change

  if (loading) {
    return (
      <div className="h-40 m-auto text-blue">
        <Loading />
      </div>
    );
  }

  if (!coinData || !blockchainData) {
    return <p className="text-center text-white">Error fetching data.</p>;
  }

  const xdcPrice = coinData.market_data.current_price.usd;
  const xdcMarketCap = coinData.market_data.market_cap.usd;
  const xdcBTCPrice = coinData.market_data.current_price.btc;
  const xdcPriceChange =
    coinData.market_data.price_change_percentage_24h.toFixed(2);
  const xdcLogo = coinData.image.thumb;
  const { totalBlocks, medianGasPrice, connectedNodes, isSyncing } =
    blockchainData;

  // Safely access sparkline_7d price data
  const sparklineData = coinData.market_data?.sparkline_7d?.price || [];

  const chartData = {
    labels: Array(sparklineData.length)
      .fill("")
      .map((_, i) => i + 1),
    datasets: [
      {
        label: "XDC Price (USD)",
        data: sparklineData,
        borderColor: "rgba(53, 162, 235, 1)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
        pointRadius: 0, // Remove dots on the line
        tension: 0.1, // Smooth the line curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, // Hide x-axis labels
      },
      y: {
        ticks: {
          callback: (value: any) => `$${value.toFixed(2)}`, // Format y-axis labels
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg text-sm font-chivo">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-2">
        {/* XDC Price */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <Image src={xdcLogo} height={25} width={25} alt="" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">XDC PRICE</h3>
              <p className="text-xl">${xdcPrice.toFixed(5)}</p>
              <p className="text-sm text-gray-400">
                @ {xdcBTCPrice.toFixed(8)} BTC{" "}
                <span
                  className={`text-${xdcPriceChange > 0 ? "green" : "red"}-500`}
                >
                  ({xdcPriceChange}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Market Cap + Gas Price */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">MARKET CAP</h3>
              <p className="text-xl font-bold">
                ${xdcMarketCap.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-400">GAS PRICE</h3>
              <p className="text-lg font-bold">{medianGasPrice}</p>
            </div>
          </div>
        </div>

        {/* Chart (Spans two rows) */}
        <div className="bg-gray-800 p-4 rounded-lg row-span-2">
          <div className="flex justify-between items-center mb-2">
            <div className="space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                XDC Price
              </button>
              <button className="text-gray-400 px-3 py-1 rounded">
                Block Growth
              </button>
            </div>
          </div>
          <div className="h-40">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Total Blocks */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                TOTAL BLOCKS
              </h3>
              <p className="text-xl font-bold">
                {totalBlocks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Connected Nodes + Network Status */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                CONNECTED NODES
              </h3>
              <p className="text-xl font-bold">
                {connectedNodes.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-400">
                NETWORK STATUS
              </h3>
              <p className="text-lg font-bold">
                {isSyncing ? "Syncing" : "Synced"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XDCPriceDashboard;

// import { useState, useEffect } from 'react';
// import { GlobeAltIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// const XDCPriceDashboard = () => {
//   const [coin, setCoin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchCoinData = async () => {
//     try {
//       const response = await fetch(
//         'https://api.coingecko.com/api/v3/coins/xdce-crowd-sale?sparkline=true'
//       );
//       const data = await response.json();
//       setCoin(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching XDC data:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCoinData();
//   }, []);

//   if (loading) {
//     return <p className="text-center text-white">Loading...</p>;
//   }

//   if (!coin) {
//     return <p className="text-center text-white">Error fetching data.</p>;
//   }

//   const xdcPrice = coin.market_data.current_price.usd;
//   const xdcMarketCap = coin.market_data.market_cap.usd;
//   const xdcBTCPrice = coin.market_data.current_price.btc;
//   const xdcPriceChange = coin.market_data.price_change_percentage_24h.toFixed(2);
//   const totalBlocks = 50902893;
//   const totalAccounts = 1714026;
//   const totalTransactions = '322.44M';
//   const medianGasPrice = '0.26 Gwei';
//   return (
//     <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg text-sm font-chivo">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* XDC Price */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <div className="bg-blue-600 rounded-full p-2 mr-3">
//                           <span className="text-xl font-bold">{}</span>
//             </div>
//             <div>
//               <h3 className="text-sm text-gray-400">XDC PRICE</h3>
//               <p className="text-xl">${xdcPrice.toFixed(5)}</p>
//               <p className="text-sm text-gray-400">
//                 @ {xdcBTCPrice.toFixed(8)} BTC{' '}
//                 <span className={`text-${xdcPriceChange > 0 ? 'green' : 'red'}-500`}>
//                   ({xdcPriceChange}%)
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Market Cap */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <GlobeAltIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">MARKET CAP</h3>
//               <p className="text-xl font-bold">${xdcMarketCap.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Total Transactions */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL TRANSACTIONS</h3>
//               <p className="text-xl font-bold">
//                 {totalTransactions} <span className="text-sm text-gray-400">(3.9 TPS)</span>
//               </p>
//             </div>
//             <div className="text-right">
//               <h3 className="text-sm font-medium text-gray-400">MED GAS PRICE</h3>
//               <p className="text-lg font-bold">
//                 {medianGasPrice} <span className="text-sm text-gray-400">($ 0.00)</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Total Blocks */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <CubeIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL BLOCKS</h3>
//               <p className="text-xl font-bold">
//                 {totalBlocks.toLocaleString()}{' '}
//                 <span className="text-sm text-gray-400">(2.49s)</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Total Accounts */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL ACCOUNTS</h3>
//               <p className="text-xl font-bold">{totalAccounts.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         {/* Sparkline Chart */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex justify-between items-center mb-2">
//             <div className="space-x-2">
//               <button className="bg-blue-500 text-white px-3 py-1 rounded">XDC Price</button>
//               <button className="text-gray-400 px-3 py-1 rounded">Daily Transactions</button>
//               <button className="text-gray-400 px-3 py-1 rounded">Account Growth</button>
//             </div>
//           </div>
//           <div className="flex items-end space-x-1">
//             {coin.market_data.sparkline_7d.price.map((price, i) => (
//               <div key={i} className="bg-blue-500 w-2" style={{ height: `${(price / xdcPrice) * 100}%` }}></div>
//             ))}
//           </div>
//           <div className="flex justify-between mt-2 text-sm text-gray-400">
//             <span>23 Aug</span>
//             <span>07 Sep</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default XDCPriceDashboard;
