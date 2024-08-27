"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineCube } from "react-icons/hi";
import provider from "@/ethers";
import Copyable from "./elements/Copyable";

const TransactionSearch = () => {
  const [txHash, setTxHash] = useState<string>('');
  const [txData, setTxData] = useState<any>(null);

  const fetchTransactionData = async () => {
    try {
      const transaction = await provider.getTransaction(txHash);
      setTxData(transaction);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg bg-white overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Search Transaction</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter transaction hash"
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTransactionData}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      {txData && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium">Transaction Hash: {txData.hash}</h3>
          <p className="text-sm text-gray-600">Block Number: {txData.blockNumber}</p>
          <p className="text-sm text-gray-600">From: {txData.from}</p>
          <p className="text-sm text-gray-600">To: {txData.to}</p>
          <p className="text-sm text-gray-600">Value: {ethers.utils.formatEther(txData.value)} ETH</p>
          <p className="text-sm text-gray-600">Gas Price: {ethers.utils.formatUnits(txData.gasPrice, 'gwei')} Gwei</p>
        </div>
      )}
    </div>
  );
};

const LatestBlocks = () => {
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      try {
        const latestBlockNumber = await provider.getBlockNumber();
        const blockPromises = [];

        // Fetch the latest 5 blocks
        for (let i = 0; i < 5; i++) {
          blockPromises.push(provider.getBlock(latestBlockNumber - i));
        }

        const blocks = await Promise.all(blockPromises);
        setLatestBlocks(blocks);
      } catch (error) {
        console.error("Error fetching latest blocks:", error);
      }
    };

    fetchLatestBlocks();
  }, []);

  const parseAddress = (address: any) => {
    return address.slice(0, 6) + "..." + address.slice(-5, -1);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between p-4">
        <h2>Latest Blocks</h2>
        <h2>Welcome Back, User</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side: Transaction Search */}
          <TransactionSearch />

          {/* Right side: Latest Blocks */}
          <div className="w-full p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between">
              <span>Block Number</span>
              <span className="sm:text-left text-right">Timestamp</span>
              <span className="hidden md:grid">Transactions</span>
              <span className="hidden sm:grid">Miner</span>
            </div>
            <ul>
              {latestBlocks.map((block) => (
                <li
                  key={block.number}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <HiOutlineCube className="text-blue-800" />
                    </div>
                    <p className="pl-4">#{block.number}</p>
                  </div>
                  <p className="text-gray-600 sm:text-left text-right">
                    {new Date(block.timestamp * 1000).toLocaleString()}
                  </p>
                  <p className="hidden md:flex text-center mx-auto">
                    {block.transactions.length}
                  </p>
                  <div className="sm:flex hidden justify-between items-center">
                    <Copyable text={parseAddress(block.miner)} copyText={block.miner} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlocks;
