"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { HiOutlineCube } from "react-icons/hi";
import { useRouter } from "next/navigation";
import provider from "@/ethers"; // Adjust the import path as needed
import Copyable from "./elements/Copyable"; // Adjust the import path as needed

const LatestBlocks: React.FC = () => {
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      try {
        const latestBlockNumber = await provider.getBlockNumber();
        const blockPromises = [];
        const transactionPromises = [];

        // Fetch the latest 5 blocks
        for (let i = 0; i < 5; i++) {
          blockPromises.push(provider.getBlock(latestBlockNumber - i));
        }

        const blocks = await Promise.all(blockPromises);
        setLatestBlocks(blocks);

        // Fetch transactions from the latest block
        for (let i = 0; i < Math.min(5, blocks[0].transactions.length); i++) {
          transactionPromises.push(provider.getTransaction(blocks[0].transactions[i]));
        }

        const transactions = await Promise.all(transactionPromises);
        setLatestTransactions(transactions);
      } catch (error) {
        console.error("Error fetching latest blocks or transactions:", error);
      }
    };

    fetchLatestBlocks();
  }, []);

  const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const handleTransactionClick = (hash: string) => {
    router.push(`/tx/${hash}`);
  };
  const handleBlockClick = (blocknumber: number) => {
    router.push(`/block/${blocknumber}`)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side: Latest Blocks */}
          <div className="w-full p-4 border rounded-lg bg-white overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Latest Blocks</h3>
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
                  onClick={() => handleBlockClick(block.number)}
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

          {/* Right side: Latest Transactions */}
          <div className="w-full p-4 border rounded-lg bg-white overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Latest Transactions</h3>
            <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between">
              <span className="text-center">Tx Hash</span>
              <span className="text-center">Block Number</span>
              <span className="text-center">From</span>
              <span className="text-center">To</span>
            </div>
            <ul className="mx-auto">
              {latestTransactions.map((tx) => (
                <li
                  key={tx.hash}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                  onClick={() => handleTransactionClick(tx.hash)}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <HiOutlineCube className="text-green-800" />
                    </div>
                    <p className="pl-4">{parseAddress(tx.hash)}</p>
                  </div>
                  <p className="text-gray-600 sm:text-left mx-auto">
                    {tx.blockNumber}
                  </p>
                  <p className="hidden md:flex text-center mx-auto">
                    {parseAddress(tx.from)}
                  </p>
                  <div className="sm:flex hidden justify-between items-center">
                    <p>{parseAddress(tx.to)}</p>
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
