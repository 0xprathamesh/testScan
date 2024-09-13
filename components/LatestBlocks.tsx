"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { HiOutlineCube } from "react-icons/hi";
import { useRouter } from "next/navigation"; // Adjust the import path as needed
import { IoReceiptOutline } from "react-icons/io5";
import Copyable from "./elements/Copyable";

const LatestBlocks: React.FC = () => {
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);
  const [provider, setProvider] =
    useState<ethers.providers.JsonRpcProvider | null>(null);
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
        const transactionPromises = [];

        for (let i = 0; i < 7; i++) {
          blockPromises.push(provider.getBlock(latestBlockNumber - i));
        }

        const blocks = await Promise.all(blockPromises);
        setLatestBlocks(blocks);

        for (let i = 0; i < Math.min(7, blocks[0].transactions.length); i++) {
          transactionPromises.push(
            provider.getTransaction(blocks[0].transactions[i])
          );
        }

        const transactions = await Promise.all(transactionPromises);
        setLatestTransactions(transactions);
      } catch (error) {
        console.error("Error fetching latest blocks or transactions:", error);
      }
    };

    fetchLatestBlocks();
  }, [provider]);

  const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const handleTransactionClick = (hash: string) => {
    router.push(`/tx/${hash}`);
  };

  const handleBlockClick = (blocknumber: number) => {
    router.push(`/block/${blocknumber}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side: Latest Blocks */}
          <div className="w-full p- border rounded-lg bg-white overflow-y-auto">
            <h3 className="text-md font-inter leading-5 font-medium mb-4 border-b pb-3 p-4">
              Latest Blocks
            </h3>

            <ul>
              {latestBlocks.map((block) => (
                <li
                  key={block.number}
                  className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <HiOutlineCube className=" h-5 w-5 " />
                    </div>
                    <div className="pl-4 text-sm font-light text-blue">
                      <p onClick={() => handleBlockClick(block.number)}>
                        #{block.number}
                      </p>
                    </div>
                  </div>
                  <p className=" text-blue font-chivo text-sm" onClick={() => router.push(`/tx/${block.hash}`)}>
                    <span className="font-normal font-inter text-gray-600">
                      Hash
                    </span>{" "}
                    {parseAddress(block.hash)}
                  </p>
                  <p className="  sm:text-center text-right text-sm font-light text-blue">
                    {block.transactions.length} txns
                  </p>
                  <div className="sm:flex hidden justify-between items-center">
                    <Copyable
                      text={parseAddress(block.miner)}
                      copyText={block.miner}
                      className="bg-transparent border border-blue text-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side: Latest Transactions */}
          <div className="w-full p- border rounded-lg bg-white overflow-y-auto">
            <h3 className="text-md font-inter leading-5 font-medium mb-4 border-b pb-3 p-4">
              Latest Transactions
            </h3>

            <ul>
              {latestTransactions.map((tx) => (
                <li
                  key={tx.hash}
                  className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                  onClick={() => handleTransactionClick(tx.hash)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <IoReceiptOutline className=" h-5 w-5" />
                    </div>
                    <div className="pl-4 text-sm font-light text-blue">
                      <p>{parseAddress(tx.hash)}</p>
                    </div>
                  </div>
                  <p className=" text-blue font-chivo text-sm">
                    <span className="font-normal font-inter text-gray-600">
                      Block
                    </span>{" "}
                    {tx.blockNumber}
                  </p>
                  <p className="hidden md:flex text-center mx-auto">
                    <Copyable
                      text={parseAddress(tx.from)}
                      copyText={tx.from}
                      className="bg-transparent border border-blue text-sm"
                    />
                  </p>
                  <div className="sm:flex hidden justify-between items-center">
                    <Copyable
                      text={parseAddress(tx.to)}
                      copyText={tx.to}
                      className="bg-transparent border border-blue text-sm"
                    />
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

