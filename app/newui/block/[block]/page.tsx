"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Layout from "@/components/newui/Layout";
import { ArrowLeft, ArrowUpRight, Copy, HelpCircle } from "lucide-react";
import Loading from '@/components/elements/Loading';
import Link from 'next/link';

interface PageProps {
  params: {
    block: string;
  }
}

interface BlockData extends ethers.providers.Block {
  confirmations: number;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
}

const Block: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.block) {
      const blockNumber = parseInt(params.block, 10);
      if (isNaN(blockNumber)) {
        setError("Invalid block number");
      } else {
        fetchBlockData(blockNumber);
      }
    }
  }, [params.block]);

  const fetchBlockData = async (blockNumber: number) => {
    try {
      const rpcUrl = "https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe";
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const block = await provider.getBlock(blockNumber);
      const latestBlock = await provider.getBlockNumber();
      const confirmations = latestBlock - block.number + 1;

      setBlockData({ ...block, confirmations });

      const txPromises = block.transactions.map(txHash => provider.getTransaction(txHash));
      const txs = await Promise.all(txPromises);
      setTransactions(txs);
    } catch (err) {
      setError("Error fetching block data");
      console.error(err);
    }
  };

  if (error) {
    return <Layout><div className="text-red-500">{error}</div></Layout>;
  }

  if (!blockData) {
    return <Layout><div className='text-blue bg-white'><Loading/></div></Layout>;
  }

  return (
    <Layout>
    
      <div className=" p-6 font-sans">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <div className="text-sm text-blue-500">Home • Block {blockData.number}</div>
            <h1 className="text-2xl font-bold">Block details</h1>
          </div>
        </div>

        <div className="flex space-x-6">
          <BlockDetailsCard blockData={blockData} />

          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.hash}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                        <Link href={`/tx/${tx.hash}`}>{tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.from.slice(0, 10)}...{tx.from.slice(-4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.to ? `${tx.to.slice(0, 10)}...${tx.to.slice(-4)}` : 'Contract Creation'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ethers.utils.formatEther(tx.value)} ETH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
       

    </Layout>
  );
};

const BlockDetailsCard: React.FC<{ blockData: BlockData }> = ({ blockData }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-black rounded-3xl text-white w-[45%] h-[600px]">
      <div className="rounded-t-3xl bg-blue-500 py-2 px-4">
        <div className="rounded-full h-20 w-20 border-8 border-[#baf7d0] items-center">
          <ArrowUpRight className="h-16 w-16 font-bold text-[#baf7d0]" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Block {blockData.number}</h2>
          </div>
        </div>

        <div className="mb-6 text-sm bg-black font-light">
          <span className="mr-2 text-gray-300">{formatDate(blockData.timestamp)}</span>•
          <span className="ml-2 text-gray-500 font-light leading-10">
            {blockData.confirmations} confirmation{blockData.confirmations !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">Block Hash</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
              {blockData.hash.slice(0, 10)}...{blockData.hash.slice(-4)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">Parent Hash</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
              {blockData.parentHash.slice(0, 10)}...{blockData.parentHash.slice(-4)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">Gas Used</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
              {blockData.gasUsed.toString()}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm mb-2">Tags</span>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Transactions: {blockData.transactions.length}
            </span>
            <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Gas Limit: {blockData.gasLimit.toString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Block;