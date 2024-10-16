"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Layout from "@/components/newui/Layout";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import TransactionTable from '@/components/TransactionTable';
import { IoCubeOutline } from 'react-icons/io5';
import { blockService } from '@/components/newui/utils/apiroutes';

interface PageProps {
  params: {
    block: string;
  }
}

interface BlockData {
  number: number;
  hash: string;
  timestamp: string;
  gasUsed: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  transactions?: string[];  
  confirmations: number;
}

interface Transaction {
  hash: string;
  from: string;
  to?: string;
  value: ethers.BigNumber;
}

const Block: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      const fetchDataAPI = process.env.NEXT_PUBLIC_FETCH_API === 'true';

      if (fetchDataAPI) {

        const blockResponse = await blockService.getBlock(blockNumber);
        const transactionResponse = await blockService.getBlockTransaction(blockNumber, '?limit=50&page=1');
        
        const blockData: BlockData = {
          number: blockResponse.height,
          hash: blockResponse.hash,
          timestamp: blockResponse.timestamp,
          gasUsed: ethers.BigNumber.from(blockResponse.gas_used),
          gasLimit: ethers.BigNumber.from(blockResponse.gas_limit),
          transactions: blockResponse.transaction_hashes,
          confirmations: blockResponse.confirmations
        };

        setBlockData(blockData);

        const transactions: Transaction[] = transactionResponse.items.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from.hash,
          to: tx.to?.hash,
          value: ethers.BigNumber.from(tx.value)
        }));

        setTransactions(transactions);
      } else {
        const rpcUrl = "https://erpc.xinfin.network/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const block = await provider.getBlock(blockNumber);
        const latestBlock = await provider.getBlockNumber();
        const confirmations = latestBlock - block.number + 1;

        const blockData: BlockData = {
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp.toString(),
          gasUsed: block.gasUsed,
          gasLimit: block.gasLimit,
          transactions: block.transactions,
          confirmations: confirmations
        };

        setBlockData(blockData);

        const txPromises = block.transactions.map(txHash => provider.getTransaction(txHash));
        const txs = await Promise.all(txPromises);
        setTransactions(txs);
      }

      setLoading(false);
    } catch (err) {
      setError("Error fetching block data");
      console.error(err);
      setLoading(false);
    }
  };

  if (error) {
    return <Layout><div className="text-red-500">{error}</div></Layout>;
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6 font-sans">
          <div className="flex items-center mb-6">
            <Skeleton width="96px" height="24px" />
          </div>
          <div className="flex">
            <Skeleton width="40%" height="600px" variant="rectangular" />
            <Skeleton width="70%" height="600px" className="ml-4" variant="rectangular" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 font-sans">
        <div className="flex items-center mb-6">
          <Link href="/newui" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <div className="text-sm">Block Details</div>
            <h1 className="text-xs text-blue font-bold">Home</h1>
          </div>
        </div>

        <div className="flex">
          {blockData ? ( 
            <BlockDetailsCard blockData={blockData} />
          ) : (
            <div className="text-red-500">No block data available</div> 
          )}
          <div className="w-[70%] ml-4">
            <TransactionTable transactions={transactions} itemsPerPage={50} />
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
    <div className="bg-black rounded-3xl text-white w-[40%] h-[600px]">
      <div className="rounded-t-3xl bg-blue-500 py-2 px-4 mt-4">
        <div className="rounded-full h-20 w-20 border-8 border-[#baf7d0] items-center">
          <IoCubeOutline className="h-16 w-16 font-bold text-[#baf7d0]" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Block {blockData.number}</h2>
          </div>
        </div>

        <div className="mb-6 text-sm bg-black font-light">
          <span className="mr-2 text-gray-300">{blockData.timestamp}</span>•
          <span className="ml-2 text-gray-500 font-light leading-10">
            {blockData.confirmations} confirmation{blockData.confirmations !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-inter">Block Hash</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
              {blockData.hash.slice(0, 10)}...{blockData.hash.slice(-4)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-inter">Gas Used</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border ">
              {blockData.gasUsed.toString()}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm mb-2">Tags</span>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
              Transactions: {blockData.transactions?.length || null}
            </span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
              Gas Limit: {blockData.gasLimit.toString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Block;

const Skeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}> = ({ width, height, className, variant = 'rectangular' }) => {
  const baseClasses = "animate-pulse bg-gray-200";
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded w-full h-4"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};