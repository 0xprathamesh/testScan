"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/newui/Layout";
import { ArrowRight, Check, X } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import { ethers } from "ethers";
import { addressService } from "./utils/apiroutes";
import { parseAddress } from "@/lib/helpers";
import Link from "next/link";
import { FileText } from "lucide-react";
const currency = process.env.NEXT_PUBLIC_VALUE_SYMBOL;
const VerifiedContracts = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ethPrice, setEthPrice] = useState<number>(0); // State for Ether to USD conversion rate

  const fetchData = async () => {
    try {
      const response = await addressService.verifiedAddresses(`/`);
      setContracts(response.items.slice(0, 5));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEthPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.log("Error fetching Ether price:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEthPrice();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  const formatBalance = (weiBalance: string) => {
    // Convert from wei to Ether
    return ethers.utils.formatEther(weiBalance);
  };

  const formatUsdValue = (ethBalance: string) => {
    // Calculate the USD value based on the Ether balance and Ether-to-USD price
    const usdValue = parseFloat(ethBalance) * ethPrice;
    return usdValue.toFixed(2); // Format to two decimal places
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Verified Contracts</h2>
        <a href="/newui/verified-contracts" className="text-blue hover:underline">
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
            <th className="font-light">Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index} className="border-t">
              <td className="py-3">
                <div className="font-bold text-black text-sm flex item-center">
                  {contract.name || "Unknown Contract"} <FileText className="h-3 w-3 mt-1 text-gray-400 ml-2"/>
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
                  ${formatUsdValue(formatBalance(contract.coin_balance || "0"))}
                </span>
              </td>
              <td>
                <span className="bg-gray-200 px-2 py-1 rounded-md text-xs font-light text-gray-600 ">
                  {contract.compiler_version}
                </span>
              </td>
              <td className="text-sm">{contract.compiler_version}</td>
              <td className="flex items-center gap-1 mt-6">
                <div className="flex items-center">
                  {contract.optimization_enabled ? (
                    <span className="flex items-center text-[#17a34b] bg-[#d8f7e7] px-1 rounded-md text-sm font-chivo">
                      <Check className="mr-1" size={16} />
                      Optimization
                    </span>
                  ) : (
                    <span className="flex items-center text-[#e75f5c] bg-[#fef1f2] px-1 rounded-md text-sm font-chivo">
                      <X className="mr-1" size={16} />
                      Optimization
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {contract.has_constructor_args ? (
                    <span className="flex items-center text-green-500 bg-[#d8f7e7] px-1 rounded-md text-sm font-chivo">
                      <Check className="mr-1" size={16} />
                      Constructor Arg
                    </span>
                  ) : (
                    <span className="flex items-center text-[#e75f5c] bg-[#fef1f2] px-1 rounded-md text-sm font-chivo">
                      <X className="mr-1" size={16} />
                      Constructor Arg
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-light">
                  Verified
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
