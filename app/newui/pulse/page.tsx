"use client";
import Layout from "@/components/newui/Layout";
import React, { useState, useEffect } from "react";
import { getBlockchainData } from "@/components/newui/utils/xdcrpc"; // Import the utility function
import Spinner from "@/components/elements/Spinner";
import Loading from "@/components/elements/Loading";
import { IoReceiptOutline,IoCubeOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { GrCubes } from "react-icons/gr";
import { FaEthereum } from "react-icons/fa";
import NetworkPulse from "@/components/newui/NetworkPulse";

const DashboardPage = () => {
  const [blockchainData, setBlockchainData] = useState<any>(null); // State to store the blockchain data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blockchain data from the RPC endpoint
    const fetchData = async () => {
      try {
        const data = await getBlockchainData(
          "https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe"
        ); // Replace with your RPC URL
        setBlockchainData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Layout><div className="h-40 m-auto text-blue"><Loading /></div></Layout>;
  }

  if (!blockchainData) {
    return <div>Error fetching data.</div>;
  }

  // Extract relevant data from the fetched blockchain data
  const totalTransactions = blockchainData.totalTransactions;
  const latestBlockNumber = blockchainData.latestBlockNumber;
  const gasUsed = blockchainData.gasUsed;
  const gasLimit = blockchainData.gasLimit;
  const miner = blockchainData.miner;
  const timestamp = blockchainData.timestamp;

  return (
    <Layout>

      <div className="container mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          {/* Total transactions card */}
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

          {/* Total blocks card */}
          <div className="bg-black text-white rounded-3xl p-4">
            <h3 className="text-sm font-light mb-4 text-gray-200">Total blocks</h3>
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

          {/* Transaction movement card - now spans two columns */}
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
                  <span className="text-2xl"><FaEthereum /></span>
                </div>
                <p className="text-xs">L1 chain</p>
                <p className="text-xs text-gray-400">~ 1 sec</p>
              </div>
            </div>
          </div>
        </div>
         <NetworkPulse rpcUrl={"https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe"}/>
      </div>
    </Layout>
  );
};

export default DashboardPage;
