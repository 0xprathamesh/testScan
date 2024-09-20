"use client";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { getBlockchainData } from "./utils/xdcrpc";
import Loading from "../elements/Loading";
import Copyable from "../elements/Copyable";
import Spinner from "./Spinner";
import { IoReceiptOutline, IoCubeOutline } from "react-icons/io5";
import Link from "next/link";

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
          {parseAddress(hash)} <Copyable text="" copyText={hash} />
          <div className="ml-20">
            <Spinner></Spinner>
          </div>
        </p>
        <div className="flex items-center space-x-2 mb-2 justify-between">
          <p className="text-xs">From</p>
          <p className="text-xs flex items-center">
            {" "}
            <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>{" "}
            {parseAddress(from)}{" "}
            <Copyable text="" copyText={from} className="top-[1%]" />{" "}
          </p>
        </div>
        <hr className="mb-2" />
        <div className="flex items-center space-x-2 justify-between">
          <p className="text-xs">To</p>
          <p className="text-xs flex">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>{" "}
            {parseAddress(to)}
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
          {parseAddress(hash)} <Copyable text="" className="" copyText={hash} />
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
          {number} <Copyable text="" copyText={number.toString()} />
          <div className="ml-10">
            <Spinner></Spinner>
          </div>
        </p>
        <p className="text-xs">Transactions Bundled: {transactions.length}</p>
        <hr className="my-2 text-gray-300" />
        <p className="text-xs mt-2">{formatTimeAgo(timestamp)}</p>
      </>
    ) : (
        <>
          <IoCubeOutline className="text-[#a9bcca] text-3xl mb-2" />
          <p className="text-sm font-semibold mb-1 font-inter flex items-center">
          {number} <Copyable text="" copyText={number.toString()} />
          </p>
          <p className="text-xs">{formatTimeAgo(timestamp)}</p>
        </>
    )}
    {/* <div className="flex items-center space-x-2 mb-2">
      <div className="w-8 h-8 bg-blue-500"></div>
      <p className="text-sm font-semibold">{number}</p>
    </div> */}
    {/* {isFirst ? (
      <>
        
        <p className="text-xs mb-2">{formatTimeAgo(timestamp)}</p>
        <p className="text-xs">Transactions: {transactions.length}</p>
      </>
    ) : (
      <p className="text-xs">{formatTimeAgo(timestamp)}</p>
    )} */}
  </div>
);

const NetworkPulse: React.FC<{ rpcUrl: string }> = ({ rpcUrl }) => {
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const txSliderRef = useRef<HTMLDivElement>(null);
  const blockSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          [...Array(10)].map((_, i) =>
            provider.getBlock(latestBlock.number - i)
          )
        );
        setBlocks(latestBlocks as Block[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [rpcUrl]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    scrollOffset: number
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  if (!blockchainData)
    return (
      <div className="h-40 m-auto text-blue">
        <Loading />
      </div>
    );

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
<Link href={`/newui/blocks`} className="mr-4">
            <p className="text-sm text-blue font-inter">View all</p></Link>
            <button onClick={() => scroll(txSliderRef, -200)} className="mr-2">
              ←
            </button>
            <button onClick={() => scroll(txSliderRef, 200)}>→</button>
          </div>
        </div>
        <div className="overflow-x-auto w-full py-4" ref={txSliderRef}>
          <div className="flex items-center space-x-4 transition-all duration-300 ease-in-out">
            {transactions.map((tx, index) => (
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
<Link href={`/newui/txns`} className="mr-4">
            <p className="text-sm text-blue font-inter">View all</p></Link>
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
            {blocks.map((block, index) => (
              <BlockBox key={block.number} {...block} isFirst={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPulse;

// import React, { useState, useEffect } from 'react';
// import { ethers } from "ethers";
// import { getBlockchainData } from './utils/xdcrpc'; // Adjust the import path as needed
// import Loading from '../elements/Loading';
// import Copyable from '../elements/Copyable';

// interface Transaction {
//   hash: string;
//   from: string;
//   to: string;
//   value: ethers.BigNumber;
// }

// interface Block {
//   number: number;
//   timestamp: number;
//   transactions: any[];
// }

// const parseAddress = (address: string) => {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`;
// };

// const TransactionBox: React.FC<Transaction & { isFirst: boolean }> = ({ hash, from, to, value, isFirst }) => (
//   <div className={`p-4 rounded-lg flex-shrink-0 w-[200px] ${isFirst ? 'bg-black text-white' : 'bg-white text-black shadow'}`}>
//     <p className="text-xs mb-2 flex items-center"> {parseAddress(hash)} <Copyable text='' copyText='hash' /></p>
//     <div className="flex items-center space-x-2 mb-2">
//       <div className="w-6 h-6 bg-green-500 rounded-full"></div>
//       <p className="text-xs">From: {from.slice(0, 10)}...</p>
//     </div>
//     <div className="flex items-center space-x-2">
//       <div className="w-6 h-6 bg-red-500 rounded-full"></div>
//       <p className="text-xs">To: {to.slice(0, 10)}...</p>
//     </div>
//     <p className="text-xs mt-2">Value: {ethers.utils.formatEther(value)} ETH</p>
//   </div>
// );

// const BlockBox: React.FC<Block & { isFirst: boolean }> = ({ number, timestamp, transactions, isFirst }) => (
//   <div className={`p-4 rounded-lg flex-shrink-0 w-[200px] ${isFirst ? 'bg-black text-white' : 'bg-white text-black shadow'}`}>
//     <div className="flex items-center space-x-2 mb-2">
//       <div className="w-8 h-8 bg-blue-500"></div>
//       <p className="text-lg font-bold">{number}</p>
//     </div>
//     <p className="text-xs mb-2">{new Date(timestamp * 1000).toLocaleString()}</p>
//     <p className="text-xs">Transactions: {transactions.length}</p>
//   </div>
// );

// const NetworkPulse: React.FC<{ rpcUrl: string }> = ({ rpcUrl }) => {
//   const [blockchainData, setBlockchainData] = useState<any>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [blocks, setBlocks] = useState<Block[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getBlockchainData(rpcUrl);
//         setBlockchainData(data);

//         const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
//         const latestBlock = await provider.getBlock(data.latestBlockNumber);
//         const latestTransactions = await Promise.all(
//           latestBlock.transactions.slice(0, 5).map(tx => provider.getTransaction(tx))
//         );
//         setTransactions(latestTransactions as Transaction[]);

//         const latestBlocks = await Promise.all(
//           [...Array(5)].map((_, i) => provider.getBlock(data.latestBlockNumber - i))
//         );
//         setBlocks(latestBlocks as Block[]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 10000); // Update every 10 seconds

//     return () => clearInterval(interval);
//   }, [rpcUrl]);

//   if (!blockchainData) return <div className="h-40 m-auto text-blue"><Loading /></div>;

//   return (
//     <div className="p-6 rounded-3xl mx-auto max-w-full ">
//       <h1 className="text-2xl font-bold mb-2">Network Pulse</h1>
//       <p className="text-gray-600 mb-6">Track real-time changes on the blockchain</p>

//       {/* Transactions Section */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Transactions</h2>
//           <a href="#" className="text-blue-500 text-sm">View all</a>
//         </div>
//         <div className=" pb-4 -mx-6 px-6">
//           <div className="flex space-x-4">
//             {transactions.map((tx, index) => (
//               <TransactionBox key={index} {...tx} isFirst={index === 0} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Processing blocks Section */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Processing blocks of transactions</h2>
//           <a href="#" className="text-blue-500 text-sm">View all</a>
//         </div>
//         <div className=" pb-4 -mx-6 px-6">
//           <div className="flex space-x-4">
//             {blocks.map((block, index) => (
//               <BlockBox key={index} {...block} isFirst={index === 0} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NetworkPulse;
