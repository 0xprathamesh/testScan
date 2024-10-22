"use client";
import React, { useState, useEffect } from "react";

import { ArrowRight, Check, X } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import { ethers } from "ethers";
import { addressService } from "./utils/apiroutes";
import { parseAddress } from "@/lib/helpers";
import Link from "next/link";
import { FileText } from "lucide-react";
import { IoFlash } from "react-icons/io5";
import { BsWrench } from "react-icons/bs";
import { LuAlertTriangle } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
const currency = process.env.NEXT_PUBLIC_VALUE_SYMBOL;
const VerifiedContracts = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ethPrice, setEthPrice] = useState<number>(0);

  const fetchData = async () => {
    try {
      const response = await addressService.verifiedAddresses(`/`);
      const data = response.items;
      setContracts(data.slice(0, 5));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.log("Error fetching Ether price:", error);
    }
  };

  const getTimeAgo = (verifiedAt: string) => {
    const verifiedDate = new Date(verifiedAt);
    const currentDate = new Date();

    const timeDiff = Math.floor(
      (currentDate.getTime() - verifiedDate.getTime()) / 1000
    );
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `Just now`;
    }
  };

  useEffect(() => {
    fetchData();
    fetchEthPrice();
  }, []);

  if (loading) {
    return <Skeleton />;
  }
  if (!contracts) {
    return null;
  }
  const formatBalance = (weiBalance: string) => {
    const formattedBalance = ethers.utils.formatEther(weiBalance);
    return Math.floor(Number(formattedBalance)); // Convert to a number and remove decimals
  };

  const formatUsdValue = (ethBalance: string) => {
    const usdValue = parseFloat(ethBalance) * ethPrice;
    return usdValue.toFixed(1);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Verified Contracts</h2>
        <a
          href="/newui/verified-contracts"
          className="text-blue hover:underline"
        >
          View All
        </a>
      </div>
      <table className="w-full">
        <thead className="text-center">
          <tr className="text-left font-light text-black px-4">
            <th className="py-2 font-light">Contracts</th>
            <th className="font-light">Balance</th>
            <th className="font-light">Compiler</th>
            <th className="font-light">Version</th>
            <th className="font-light">Settings</th>
            <th className="font-light">Verified</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index} className="border-t">
              <td className="py-3">
                <div className="font-bold text-black text-sm flex item-center">
                  {contract.name || "Unknown Contract"}{" "}
                  <FileText className="h-3 w-3 mt-1 text-gray-400 ml-2" />
                </div>
                <div className="text-sm text-[#06afe8] font-semibold leading-2 flex items-center">
                  <Link href={`/newui/address/${contract.address.hash}`}>
                    {parseAddress(contract.address.hash)}{" "}
                  </Link>
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(contract.address.hash)
                    }
                  />
                </div>
              </td>
              <td className="font-semibold font-inter">
                {formatBalance(contract.coin_balance || "0")} {currency}
                <br />
                <span className="text-sm font-light text-gray-500">
                  $
                  {formatUsdValue(
                    String(formatBalance(contract.coin_balance || "0"))
                  )}
                </span>
              </td>
              <td>
                <span className="bg-gray-200 px-2 py-1 rounded-md text-xs font-light text-gray-600 ">
                  Solidity
                </span>
              </td>
              <td className="text-sm ">
                <div className="flex items-center">
                  {contract.vulnerability > 0 ? (
                    <div>
                      <LuAlertTriangle className="text-yellow-300 h-4 w-4" />
                    </div>
                  ) : (
                    <div>
                      <LuAlertTriangle className="text-yellow-300 h-4 w-4 opacity-0" />
                    </div>
                  )}
                  {/* Display only the text before the '+' */}
                  {contract.compiler_version.split("+")[0]}
                </div>
              </td>

              <td className="flex items-center gap-1 mt-6">
                <div className="flex items-center">
                  {contract.optimization_enabled ? (
                    <span className="text-[#17a34b] bg-[#d8f7e7] p-2 rounded-full">
                      <IoFlash className="h-4 w-4  rounded-full" />
                    </span>
                  ) : (
                    <span className="text-[#e75f5c] bg-[#fef1f2]  p-2 rounded-full">
                      <IoFlash className="h-4 w-4  rounded-full" />
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {contract.has_constructor_args ? (
                    <span className="text-[#17a34b] bg-[#d8f7e7] p-2 rounded-full">
                      <BsWrench className="h-4 w-4  rounded-full" />
                    </span>
                  ) : (
                    <span className="text-[#e75f5c] bg-[#fef1f2]  p-2 rounded-full">
                      <BsWrench className="h-4 w-4  rounded-full" />
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className="text-xs ml-2">
                  {getTimeAgo(contract.verified_at)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Skeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
};

export default VerifiedContracts;
