"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ArrowLeft, Copy, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/public/assets/user.svg";
import Loading from "@/components/elements/Loading";
import Layout from "@/components/newui/Layout";
import Tortoise from "@/public/assets/tortoise.svg";
import Wave from "@/public/assets/sea_water.svg";
import Activity from "@/components/Activity";
import Wallet from "@/components/newui/Wallet";
import TokenTransfers from "@/components/TokenTransfers";
import InternalTx from "@/components/InternalTx";
import ContractTransactions from "./ContractTransactions";
import ContractDetailsCard from "./ContractDetailsCard";

interface PageProps {
  params: {
    address: string;
  };
}

interface Contract {
  name: string;
  is_verified: boolean;
  address: string;
  balance: string;
  txn: string;
  creator: string;
  lastTxn: string;
  lastBlock: number;
}
const parseAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
const ContractAddress: React.FC<PageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState<string>("transactions");

  useEffect(() => {});
  const renderTabContent = () => {
    switch (activeTab) {
      case "transactions":
        return <ContractTransactions address={params.address} />;

      case "internalTransactions":
        return <InternalTx address={params.address} />;
      default:
        return <ContractTransactions address={params.address} />;
    }
  };
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center">
          <Link href="/newui">
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
          <span className="text-md font-semibold">Contract Details •</span>
        </div>
        <div className="flex items-center ml-[22px] mt-1">
          <Link href="/newui" className="text-blue text-sm">
            Home •
          </Link>
          <p className="text-sm font-light ml-2">
            {parseAddress(params.address)}
          </p>
          <Copy
            className="w-4 h-4 ml-2 cursor-pointer text-[#8a98ad]"
            onClick={() => navigator.clipboard.writeText(params.address)}
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-3 gap-4">
     
        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 1 content here</p>
        </div>


        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 2 content here</p>
        </div>


        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 3 content here</p>
        </div>
      </div> */}
      <ContractDetailsCard address={params.address} />
      {/* <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-blue-500 p-1 rounded mr-2">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold">CheckinProxy</h3>
            </div>
            <span className="bg-green-500 text-xs font-semibold px-2 py-1 rounded">Verified</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">{parseAddress("0x6cA...1687")}</p>
          <div className="mb-4">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-lg font-semibold">0.052333 ETH</p>
            <p className="text-sm text-gray-400">$138.83</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Transactions</p>
            <p className="text-lg font-semibold">2,667,825</p>
            <p className="text-sm text-gray-400">$403,532.57</p>
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Contract's age</h3>
          <p className="text-2xl font-bold text-blue-400 mb-4">2 months</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Through txn</span>
              <span className="text-sm flex items-center">
                {parseAddress("0x86...0788")}
           
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Created by</span>
              <span className="text-sm flex items-center">
                {parseAddress("0x3F...9853")}
               
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Date</span>
              <span className="text-sm">07/07/2024</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Contract Source Code Verified (Partial Match)</p>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Health</h3>
          <p className="text-2xl font-bold text-green-400 mb-4">Active</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Last transaction</span>
              <span className="text-sm flex items-center">
                {parseAddress("0xb6...f349")}
               
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Last Block</span>
              <span className="text-sm bg-gray-800 px-2 py-1 rounded flex items-center">
                3327477
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Date</span>
              <span className="text-sm">28/09/2024</span>
            </div>
          </div>
        </div>
      </div> */}
      {/* Tabs */}
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {["transactions", "internalTransactions"].map((tab) => (
              <a
                key={tab}
                href="#"
                className={`border-b-2 py-2 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${tab === "insights" ? "text-gray-400" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() +
                  tab.slice(1).replace(/([A-Z])/g, " $1")}
                {tab === "insights" && " (Coming Soon)"}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default ContractAddress;
