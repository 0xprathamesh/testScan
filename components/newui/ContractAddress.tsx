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

interface PageProps {
  params: {
    address: string;
  };
}
const parseAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
const ContractAddress: React.FC<PageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState<string>("transactions");

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

      <div className="grid grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 1 content here</p>
        </div>

        {/* Card 2 */}
        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 2 content here</p>
        </div>

        {/* Card 3 */}
        <div className="bg-black text-white rounded-3xl p-10 flex">
          <p>Card 3 content here</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
             
              "transactions",
            
              "internalTransactions",
    
            ].map((tab) => (
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
