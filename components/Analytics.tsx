"use client"

// import React from 'react';
// import { ArrowTrendingUpIcon, GlobeAltIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// const XDCPriceDashboard = () => {
//   return (
//     <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg text-sm font-chivo">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* XDC Price */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <div className="bg-blue-600 rounded-full p-2 mr-3">
//               <span className="text-xl font-bold">X</span>
//             </div>
//             <div>
//               <h3 className="text-sm  text-gray-400">XDC PRICE</h3>
//               <p className="text-xl">$ 0.02622</p>
//               <p className="text-sm text-gray-400">@ 0.00000004667 BTC <span className="text-green-500">(0.46%)</span></p>
//             </div>
//           </div>
//         </div>

//         {/* Market Cap */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <GlobeAltIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">MARKET CAP</h3>
//               <p className="text-xl font-bold">$ 391,051,360.00</p>
//             </div>
//           </div>
//         </div>

//         {/* Total Transactions */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL TRANSACTIONS</h3>
//               <p className="text-xl font-bold">322.44M <span className="text-sm text-gray-400">(3.9 TPS)</span></p>
//             </div>
//             <div className="text-right">
//               <h3 className="text-sm font-medium text-gray-400">MED GAS PRICE</h3>
//               <p className="text-lg font-bold">0.26 Gwei <span className="text-sm text-gray-400">($ 0.00)</span></p>
//             </div>
//           </div>
//         </div>

//         {/* Total Block */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <CubeIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL BLOCK</h3>
//               <p className="text-xl font-bold">50,902,893 <span className="text-sm text-gray-400">(2.49s)</span></p>
//             </div>
//           </div>
//         </div>

//         {/* Total Accounts */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex items-center">
//             <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-400">TOTAL ACCOUNTS</h3>
//               <p className="text-xl font-bold">1,714,026</p>
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-gray-800 p-4 rounded-lg">
//           <div className="flex justify-between items-center mb-2">
//             <div className="space-x-2">
//               <button className="bg-blue-500 text-white px-3 py-1 rounded">XDC Price</button>
//               <button className="text-gray-400 px-3 py-1 rounded">Daily Transactions</button>
//               <button className="text-gray-400 px-3 py-1 rounded">Account Growth</button>
//             </div>
//           </div>
//           <div className=" flex items-end space-x-1">
//             {/* Placeholder for chart - you'd replace this with an actual chart component */}
//             {[...Array(30)].map((_, i) => (
//               <div key={i} className="bg-blue-500 w-2" style={{height: `${Math.random() * 100}%`}}></div>
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

// export default XDCPriceDashboard;import { useState, useEffect } from 'react';
import { GlobeAltIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const XDCPriceDashboard = () => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoinData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/xdce-crowd-sale?sparkline=true'
      );
      const data = await response.json();
      setCoin(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching XDC data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (!coin) {
    return <p className="text-center text-white">Error fetching data.</p>;
  }

  const xdcPrice = coin.market_data.current_price.usd;
  const xdcMarketCap = coin.market_data.market_cap.usd;
  const xdcBTCPrice = coin.market_data.current_price.btc;
  const xdcPriceChange = coin.market_data.price_change_percentage_24h.toFixed(2);
  const totalBlocks = 50902893; 
  const totalAccounts = 1714026; 
  const totalTransactions = '322.44M'; 
  const medianGasPrice = '0.26 Gwei'; 
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg text-sm font-chivo">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* XDC Price */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
                          <span className="text-xl font-bold">{}</span>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">XDC PRICE</h3>
              <p className="text-xl">${xdcPrice.toFixed(5)}</p>
              <p className="text-sm text-gray-400">
                @ {xdcBTCPrice.toFixed(8)} BTC{' '}
                <span className={`text-${xdcPriceChange > 0 ? 'green' : 'red'}-500`}>
                  ({xdcPriceChange}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Market Cap */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <GlobeAltIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">MARKET CAP</h3>
              <p className="text-xl font-bold">${xdcMarketCap.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">TOTAL TRANSACTIONS</h3>
              <p className="text-xl font-bold">
                {totalTransactions} <span className="text-sm text-gray-400">(3.9 TPS)</span>
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-400">MED GAS PRICE</h3>
              <p className="text-lg font-bold">
                {medianGasPrice} <span className="text-sm text-gray-400">($ 0.00)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Total Blocks */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">TOTAL BLOCKS</h3>
              <p className="text-xl font-bold">
                {totalBlocks.toLocaleString()}{' '}
                <span className="text-sm text-gray-400">(2.49s)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Total Accounts */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-400">TOTAL ACCOUNTS</h3>
              <p className="text-xl font-bold">{totalAccounts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">XDC Price</button>
              <button className="text-gray-400 px-3 py-1 rounded">Daily Transactions</button>
              <button className="text-gray-400 px-3 py-1 rounded">Account Growth</button>
            </div>
          </div>
          <div className="flex items-end space-x-1">
            {coin.market_data.sparkline_7d.price.map((price, i) => (
              <div key={i} className="bg-blue-500 w-2" style={{ height: `${(price / xdcPrice) * 100}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>23 Aug</span>
            <span>07 Sep</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XDCPriceDashboard;
