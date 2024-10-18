"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "./utils/apiroutes";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ethers } from "ethers";

interface PageProps {
  address: string;
}

interface Contract {
  name: string;
  is_verified: boolean;
  address: string;
  balance: string;
  txn: string;
  creator: string;
}

const ContractDetailsCard: React.FC<PageProps> = ({ address }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const formatBalance = (weiBalance: string) => {
    // Convert from wei to Ether
    return ethers.utils.formatEther(weiBalance);
  };
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await addressService.getAddress(address);
        const data = response;

        const contractData: Contract = {
          name: data.name || "Unknown Contract",
          is_verified: data.is_verified,
          address: data.hash,
          balance: data.coin_balance,
          txn: data.creation_tx_hash,
          creator: data.creator_address_hash,
        };

        setContract(contractData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Error fetching contract details");
        setLoading(false);
      }
    };

    fetchContract();
  }, [address]);

  const parseAddress = (addr: string | null | undefined) => {
    if (!addr) return "N/A"; // Return a default value if addr is null or undefined
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-gray-900 text-white rounded-xl p-6 animate-pulse space-y-4"
        >
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (error || !contract) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Contract Overview Card */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-1 rounded mr-2">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold">{contract.name}</h3>
          </div>
          <span
            className={`${
              contract.is_verified ? "bg-green-500" : "bg-red-500"
            } text-xs font-semibold px-2 py-1 rounded`}
          >
            {contract.is_verified ? "Verified" : "Unverified"}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          {parseAddress(contract.address)}
        </p>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-lg font-semibold">{formatBalance(contract.balance)} XDC</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Transactions</p>
          {/* <p className="text-lg font-semibold">227,871</p>
          <p className="text-sm text-gray-400">$21,597.48</p> */}
        </div>
      </div>

      {/* Contract Age Card */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Contract age</h3>
        <p className="text-2xl font-bold text-blue-400 mb-4">1 year <span className="text-xs font-chivo">:TODO</span></p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Through txn</span>
            <span className="text-sm flex items-center">
              {parseAddress(contract.txn)} <span className="text-xs font-chivo">:TODO</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Created by</span>
            <span className="text-sm flex items-center">
              {parseAddress(contract.creator)} <span className="text-xs font-chivo">:TODO</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Date</span>
            <span className="text-sm">11/09/2023 <span className="text-xs font-chivo">:TODO</span></span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Contract Source Code Verified (Partial Match)
        </p>
      </div>

      {/* Health Card */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Health</h3>
        <p className="text-2xl font-bold text-green-400 mb-4">Active <span className="text-xs font-chivo">:TODO</span></p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Last transaction</span>
            <span className="text-sm flex items-center">
              0x594D...0a4C <span className="text-xs font-chivo">:TODO</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Last Block</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">
              3344406 <span className="text-xs font-chivo">:TODO</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Date</span>
            <span className="text-sm">30/09/2024 <span className="text-xs font-chivo">:TODO</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsCard;
