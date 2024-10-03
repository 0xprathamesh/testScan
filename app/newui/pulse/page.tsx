"use client";
import Layout from "@/components/newui/Layout";
import React, { useState, useEffect } from "react";
import { getBlockchainData } from "@/components/newui/utils/xdcrpc";
import { IoReceiptOutline, IoCubeOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { GrCubes } from "react-icons/gr";
import { FaEthereum } from "react-icons/fa";
import NetworkPulse from "@/components/newui/NetworkPulse";
import {
  blockService,
  dashboardService,
  transactionService,
} from "@/components/newui/utils/apiroutes";

interface BlockData {
  number: string;
  timestamp: string;
  hash: string;
  miner: {
    hash: string;
  };
  size: number;
  gasUsed: string;
  gasLimit: string;
  txCount: number;
}

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

const SkeletonCard = () => (
  <div className=" text-white rounded-3xl p-4">
    <Skeleton width="50%" height="20px" className="mb-4" variant="text" />
    <Skeleton width="70%" height="30px" className="mb-4" variant="text" />
    <Skeleton width="100%" height="64px" className="mb-4" />
    <Skeleton width="80%" height="20px" variant="text" />
  </div>
);

const SkeletonTransactionMovement = () => (
  <div className=" text-white rounded-3xl p-4 lg:col-span-2">
    <Skeleton width="50%" height="20px" className="mb-4" variant="text" />
    <div className="flex justify-between items-center">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center">
          <Skeleton
            width="48px"
            height="48px"
            className="mx-auto mb-4 mt-4"
            variant="circular"
          />
          <Skeleton
            width="60px"
            height="16px"
            className="mx-auto mb-2"
            variant="text"
          />
          <Skeleton
            width="40px"
            height="12px"
            className="mx-auto"
            variant="text"
          />
        </div>
      ))}
    </div>
  </div>
);

const DashboardPage = () => {
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {
  //       const data = await getBlockchainData("https://erpc.xinfin.network/");
  //       setBlockchainData(data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching blockchain data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
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
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchRPCData = async () => {
    try {
      const data = await getBlockchainData("https://erpc.xinfin.network/");
      setBlockchainData(data);
    } catch (error) {
      console.error("Error fetching RPC data:", error);
    }
  };

  const fetchAPIData = async () => {
    try {
      const response = await dashboardService.stats();
      console.log(response);

      const { total_blocks, total_transactions } = response;

      const apiData = {
        latestBlockNumber: total_blocks,
        totalTransactions: total_transactions,
      };

      setBlockchainData(apiData);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonTransactionMovement />
        </div>
      );
    }

    if (!blockchainData) {
      return <div>Error fetching data.</div>;
    }

    const { totalTransactions, latestBlockNumber } = blockchainData;


    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-black text-white rounded-3xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-light font-inter text-gray-200">
              Total transactions on chain
            </h3>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold mb-4">{totalTransactions}</h2>
          <div className="h-16 relative mb-4">
            <svg className="w-full h-full">
              <path
                d="M0,32 L50,28 L100,30 L150,25 L200,15 L250,14 L300,13"
                stroke="red"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-md font-light text-[#cbd5e1]">
            On average 8.31 Transactions are processed every second
          </p>
        </div>

        <div className="bg-black text-white rounded-3xl p-4">
          <h3 className="text-sm font-light mb-4 text-gray-200">
            Total blocks
          </h3>
          <h2 className="text-3xl font-semibold mb-2">{latestBlockNumber}</h2>
          <p className="text-xs mb-4 font-light text-[#cbd5e1]">
            Each block takes an average of 5 seconds to process
          </p>
          <div className="bg-gray-800 p-3 rounded-md">
            <div className="flex items-center">
              <div className="ml-2">
                <p className="text-lg font-bold">5.72%</p>
                <p className="text-xs text-gray-400">
                  Network utilization in last 50 blocks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-3xl p-4 lg:col-span-2">
          <h3 className="text-sm font-normal mb-4">
            Transaction movement on chain
          </h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className=" bg-blue-300 mx-auto mb-4 mt-4">
                <IoReceiptOutline className="w-14 h-14 text-[#07afe9]" />
              </div>
              <p className="text-xs">Transactions</p>
              <p className="text-xs text-gray-400">~ 0.8 sec</p>
            </div>
            <MdArrowForwardIos />
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 mx-auto mb-4 mt-4">
                <IoCubeOutline className="w-14 h-14 text-[#07afe9]" />
              </div>
              <p className="text-xs">Blocks</p>
              <p className="text-xs text-gray-400">~ 10 sec</p>
            </div>
            <MdArrowForwardIos />
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 mx-auto mb-4 mt-4">
                <GrCubes className="w-14 h-14 text-[#07afe9]" />
              </div>
              <p className="text-xs">Batch</p>
              <p className="text-xs text-gray-400">~ 1 hour</p>
            </div>
            <MdArrowForwardIos />
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">
                  <FaEthereum />
                </span>
              </div>
              <p className="text-xs">L1 chain</p>
              <p className="text-xs text-gray-400">~ 1 sec</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto overflow-hidden">
        {renderContent()}
        <NetworkPulse rpcUrl={"https://erpc.xinfin.network/"} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
