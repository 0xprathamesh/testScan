"use client";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { getBlockchainData } from "./utils/xdcrpc";

import Copyable from "../elements/Copyable";
import Spinner from "./Spinner";
import { IoReceiptOutline, IoCubeOutline } from "react-icons/io5";
import Link from "next/link";
import { transactionService, blockService } from "./utils/apiroutes";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
  timestamp: number;
}

interface Block {
  number: number;
  timestamp: number;
  transactions: any[];
}

const parseAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
};

const TransactionBox: React.FC<Transaction & { isFirst: boolean }> = ({
  hash,
  from,
  to,
  value,
  timestamp,
  isFirst,
}) => (
  <div
    className={`p-6 rounded-3xl flex-shrink-0  ${
      isFirst
        ? "bg-black text-white w-[340px]"
        : "bg-white text-black shadow items-center w-48 h-32 border border-[#cad7e1]"
    }`}
  >
    {isFirst ? (
      <>
        <p className="text-sm font-semibold mb-2 flex items-center">
          <IoReceiptOutline className="w-12 h-12 mr-4" />
          <Link href={`/newui/tx/${hash}`} className="hover:underline">
            {parseAddress(hash)}{" "}
          </Link>{" "}
          <Copyable text="" copyText={hash} />
          <div className="ml-20">
            <Spinner></Spinner>
          </div>
        </p>
        <div className="flex items-center space-x-2 mb-2 justify-between">
          <p className="text-xs">From</p>
          <p className="text-xs flex items-center">
            {" "}
            <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>{" "}
            <Link href={`/newui/address/${from}`} className="hover:underline">
              {parseAddress(from)}{" "}
            </Link>
            <Copyable text="" copyText={from} className="top-[1%]" />{" "}
          </p>
        </div>
        <hr className="mb-2" />
        <div className="flex items-center space-x-2 justify-between">
          <p className="text-xs">To</p>
          <p className="text-xs flex">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>{" "}
            <Link href={`/newui/address/${to}`} className="hover:underline">
              {parseAddress(to)}
            </Link>
            <Copyable text="" copyText={to} />
          </p>
        </div>
        <p className="text-xs mt-2">
          Value: {ethers.utils.formatEther(value)} ETH
        </p>
        <p className="text-xs mt-2">{formatTimeAgo(timestamp)}</p>
      </>
    ) : (
      <>
        <IoReceiptOutline className="text-[#a9bcca] text-3xl mb-4" />

        <p className="text-sm font-semibold mb-1 font-inter flex items-center">
          <Link href={`/newui/tx/${hash}`} className="hover:underline">
            {parseAddress(hash)}{" "}
          </Link>{" "}
          <Copyable text="" className="" copyText={hash} />
        </p>

        <p className="text-xs">{formatTimeAgo(timestamp)}</p>
      </>
    )}
  </div>
);

const BlockBox: React.FC<Block & { isFirst: boolean }> = ({
  number,
  timestamp,
  transactions,
  isFirst,
}) => (
  <div
    className={`p-6 rounded-3xl flex-shrink-0  ${
      isFirst
        ? "bg-black text-white w-[280px]"
        : "items-center w-36 h-32  bg-white text-black shadow border border-[#cad7e1]"
    }`}
  >
    {isFirst ? (
      <>
        <p className="text-sm font-semibold mb-2 flex items-center">
          <IoCubeOutline className="w-12 h-12 mr-4" />
          <Link href={`/newui/block/${number}`} className="hover:underline">
            {number}{" "}
          </Link>{" "}
          <Copyable text="" copyText={number.toString()} />
          <div className="ml-10">
            <Spinner></Spinner>
          </div>
        </p>
        <p className="text-xs">
          {" "}
          <Link href={`/newui/txns`} className="hover:underline">
            Transactions Bundled: {transactions.length}
          </Link>{" "}
        </p>
        <hr className="my-2 text-gray-300" />
        <p className="text-xs mt-2">{formatTimeAgo(timestamp)}</p>
      </>
    ) : (
      <>
        <IoCubeOutline className="text-[#a9bcca] text-3xl mb-2" />
        <p className="text-sm font-semibold mb-1 font-inter flex items-center">
          <Link href={`/newui/block/${number}`} className="hover:underline">
            {number}
          </Link>{" "}
          <Copyable text="" copyText={number.toString()} />
        </p>
        <p className="text-xs">{formatTimeAgo(timestamp)}</p>
      </>
    )}
  </div>
);

const NetworkPulse: React.FC<{ rpcUrl: string }> = ({ rpcUrl }) => {
  // const [blockchainData, setBlockchainData] = useState<any>(null);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [blocks, setBlocks] = useState<Block[]>([]);
  // const [loading, setLoading] = useState(true);
  // const txSliderRef = useRef<HTMLDivElement>(null);
  // const blockSliderRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getBlockchainData(rpcUrl);
  //       setBlockchainData(data);

  //       const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  //       const latestBlock = await provider.getBlock("latest");
  //       const latestTransactions = await Promise.all(
  //         latestBlock.transactions.slice(0, 10).map(async (tx) => {
  //           const transaction = await provider.getTransaction(tx);
  //           return {
  //             ...transaction,
  //             timestamp: latestBlock.timestamp,
  //           } as Transaction;
  //         })
  //       );
  //       setTransactions(latestTransactions);

  //       const latestBlocks = await Promise.all(
  //         [...Array(10)].map((_, i) =>
  //           provider.getBlock(latestBlock.number - i)
  //         )
  //       );
  //       setBlocks(latestBlocks as Block[]);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  //   const interval = setInterval(fetchData, 10000);

  //   return () => clearInterval(interval);
  // }, [rpcUrl]);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const txSliderRef = useRef<HTMLDivElement>(null);
  const blockSliderRef = useRef<HTMLDivElement>(null);

  const USE_API = process.env.NEXT_PUBLIC_FETCH_API === "true";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (USE_API) {
          await fetchAPIData();
        } else {
          await fetchRPCData();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchRPCData = async () => {
    const data = await getBlockchainData(rpcUrl);
    setBlockchainData(data);

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const latestBlock = await provider.getBlock("latest");
    const latestTransactions = await Promise.all(
      latestBlock.transactions.slice(0, 10).map(async (tx) => {
        const transaction = await provider.getTransaction(tx);
        return {
          ...transaction,
          timestamp: latestBlock.timestamp,
        } as Transaction;
      })
    );
    setTransactions(latestTransactions);

    const latestBlocks = await Promise.all(
      [...Array(10)].map((_, i) => provider.getBlock(latestBlock.number - i))
    );
    setBlocks(latestBlocks as Block[]);
  };

  const fetchAPIData = async () => {
    try {
      const transactionResponse = await transactionService.transactions(
        `?limit=20&page=1`
      );
      const transactionApiData = transactionResponse.items.map((item: any) => ({
        hash: item.hash,
        from: item.from?.hash,
        to: item.to?.hash,
        value: ethers.BigNumber.from(item.value || 0),
        timestamp: Math.floor(new Date(item.timestamp).getTime() / 1000),
      }));
      setTransactions(transactionApiData);

      const blockResponse = await blockService.blocks(`?limit=10&page=1`);
      const blockApiData = blockResponse.items.map((item: any) => ({
        number: item.number,
        timestamp: Math.floor(new Date(item.timestamp).getTime() / 1000),
        transactions: item.transactions || [],
      }));
      setBlocks(blockApiData);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };
  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    scrollOffset: number
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  // const fetchAPIData = async () => {
  //   try {
  //     const transactionResponse = await transactionService.transactions(`?limit=20&page=1`);
  //     const transactionApiData = transactionResponse.items.map((item: any) => ({
  //       hash: item.hash,
  //       from: item.from?.hash,
  //       to: item.to?.hash,
  //       value: 343432334,
  //       timestamp: 232

  //     }));
  //     console.log(transactionApiData);

  //     const blockResposne = await blockService.blocks(`?limit=20&page=1`);

  //     const blockApiData = blockResposne.items.map((item: any) => ({
  //       number: item.number,
  //       timestamp: item.timestamp,

  //     }))
  //     console.log(transactionResponse.items.length);
  //     console.log(blockResposne.items.length);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="py-6 px-2 rounded-3xl mx-auto max-w-[1220px]">
      <h1 className="text-2xl font-bold mb-2">Network Pulse</h1>
      <p className="text-gray-600 mb-6">
        Track real-time changes on the blockchain
      </p>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <div className="flex items-center">
            <Link href={`/newui/txns`} className="mr-4">
              <p className="text-sm text-blue font-inter">View all</p>
            </Link>
            <button onClick={() => scroll(txSliderRef, -200)} className="mr-2">
              ←
            </button>
            <button onClick={() => scroll(txSliderRef, 200)}>→</button>
          </div>
        </div>
        <div className="overflow-x-auto w-full py-4" ref={txSliderRef}>
          <div className="flex items-center space-x-4 transition-all duration-300 ease-in-out">
            {loading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <TransactionBoxSkeleton key={index} isFirst={index === 0} />
                  ))
              : transactions.map((tx, index) => (
                  <TransactionBox key={tx.hash} {...tx} isFirst={index === 0} />
                ))}
          </div>
        </div>
      </div>
      <hr className="fill-[#cad7e1] mb-8" />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Processing blocks of transactions
          </h2>
          <div className="flex items-center">
            <Link href={`/newui/blocks`} className="mr-4">//Link
              <p className="text-sm text-blue font-inter">View all</p>
            </Link>
            <button
              onClick={() => scroll(blockSliderRef, -200)}
              className="mr-2"
            >
              ←
            </button>
            <button onClick={() => scroll(blockSliderRef, 200)}>→</button>
          </div>
        </div>
        <div className="overflow-x-auto w-full py-4" ref={blockSliderRef}>
          <div className="flex items-center space-x-4 transition-all duration-300 ease-in-out">
            {loading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <BlockBoxSkeleton key={index} isFirst={index === 0} />
                  ))
              : blocks.map((block, index) => (
                  <BlockBox
                    key={block.number}
                    {...block}
                    isFirst={index === 0}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPulse;

const Skeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}> = ({ width, height, className, variant = "rectangular" }) => {
  const baseClasses = "animate-pulse bg-gray-200";
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded w-full h-4",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

const TransactionBoxSkeleton: React.FC<{ isFirst: boolean }> = ({
  isFirst,
}) => (
  <div
    className={`p-6 rounded-3xl flex-shrink-0 ${
      isFirst ? "w-[340px]" : "w-48 h-32"
    }`}
  >
    <Skeleton width={isFirst ? "100%" : "80%"} height="24px" className="mb-2" />
    {isFirst && (
      <>
        <Skeleton width="100%" height="16px" className="mb-2" />
        <Skeleton width="100%" height="16px" className="mb-2" />
        <Skeleton width="80%" height="16px" />
      </>
    )}
  </div>
);

const BlockBoxSkeleton: React.FC<{ isFirst: boolean }> = ({ isFirst }) => (
  <div
    className={`p-6 rounded-3xl flex-shrink-0 ${
      isFirst ? "w-[280px]" : "w-36 h-32"
    }`}
  >
    <Skeleton width={isFirst ? "100%" : "80%"} height="24px" className="mb-2" />
    {isFirst && (
      <>
        <Skeleton width="100%" height="16px" className="mb-2" />
        <Skeleton width="80%" height="16px" />
      </>
    )}
  </div>
);
