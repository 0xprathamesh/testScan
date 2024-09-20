"use client"

import Layout from '@/components/newui/Layout';
import React, { useEffect, useState } from 'react';
import { FiSearch, FiCopy, FiChevronRight } from 'react-icons/fi';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

const BlocksPage: React.FC = () => {
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [provider, setProvider] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const rpcUrl = localStorage.getItem("rpcUrl") || "https://eth.llamarpc.com";
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    setProvider(rpcProvider);
  }, []);

  useEffect(() => {
    if (!provider) return;

    const fetchLatestBlocks = async () => {
      try {
        const latestBlockNumber = await provider.getBlockNumber();
        const blockPromises = [];

        for (let i = 0; i < 4; i++) {
          blockPromises.push(provider.getBlock(latestBlockNumber - i));
        }

        const blocks = await Promise.all(blockPromises);
        setLatestBlocks(blocks);
      } catch (error) {
        console.error("Error fetching latest blocks:", error);
      }
    };

    fetchLatestBlocks();
  }, [provider]);

  const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const handleBlockClick = (blockNumber: number) => {
    router.push(`/block/${blockNumber}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Blocks</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Replace these with dynamic data if needed */}
          <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-2">Last Safe Block</p>
              <p className="text-4xl font-bold text-white">{latestBlocks[0]?.number || 'Loading...'}</p>
            </div>
            <div className="bg-blue p-4 rounded-lg">
              <div className="w-12 h-12 bg-blue-300 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 mb-2">Network Utilization</p>
            <p className="text-4xl font-bold text-white mb-2">2.36%</p>
            <div className="bg-gray-700 h-2 rounded-full">
              <div className="bg-blue h-2 rounded-full" style={{ width: '2.36%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search block number / hash"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-gray-500 font-medium">Block #</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Size (bytes)</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Txns</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Miner</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Gas used</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Gas Limit</th>
              </tr>
            </thead>
            <tbody>
              {latestBlocks.map((block, index) => (
                <tr key={block.number} className="border-t">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="bg-gray-800 text-white px-2 py-1 rounded mr-2">
                        {block.number}
                      </span>
                      <span className="text-gray-500 text-sm">{index * 10 + 2}s ago</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{block.size}</td>
                  <td className="px-6 py-4">{block.transactions.length}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs mr-2">M</span>
                      {parseAddress(block.miner)}
                      <FiCopy className="ml-2 text-gray-400 cursor-pointer" onClick={() => navigator.clipboard.writeText(block.miner)} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span>{block.gasUsed.toString()}</span>
                      <span className="text-gray-500 ml-2">({((block.gasUsed.toNumber() / block.gasLimit.toNumber()) * 100).toFixed(2)}%)</span>
                    </div>
                    <div className="w-24 bg-gray-200 h-1 rounded-full mt-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(block.gasUsed.toNumber() / block.gasLimit.toNumber()) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{block.gasLimit.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Showing 1 to {latestBlocks.length} of {latestBlocks.length} entries</span>
          <div className="flex items-center">
            <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-l-lg">1</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-r-lg">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlocksPage;
