"use client";
import Layout from "@/components/newui/Layout";
import VerifiedContracts from "@/components/newui/VerifiedContracts";
import { ArrowLeft } from "lucide-react";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { parseAddress } from "@/lib/helpers";
import { addressService } from "@/components/newui/utils/apiroutes";
import { FileText, User } from "lucide-react";
import Contracts from "@/components/newui/Contracts";
import { ethers } from "ethers";
const currency = process.env.NEXT_PUBLIC_VALUE_SYMBOL;
const VerifiedContractsPage = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ethToUsdRate, setEthToUsdRate] = useState<number>(0);

  const fetchData = async () => {
    try {
      const response = await addressService.getContract(`?limit=250&page=1`);
      setContracts(response.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEthToUsdRate = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEthToUsdRate(data.ethereum.usd); // Set the ETH to USD rate
    } catch (error) {
      console.log("Error fetching ETH to USD rate:", error);
    }
  };

  const getTimeAgo = (verifiedAt: string) => {
    const verifiedDate = new Date(verifiedAt);
    const currentDate = new Date();

    const timeDiff = Math.floor(
      (currentDate.getTime() - verifiedDate.getTime()) / 1000
    ); // Difference in seconds

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
    fetchEthToUsdRate(); // Fetch ETH to USD rate on component mount
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const formatBalance = (weiBalance: string) => {
    return (parseFloat(weiBalance) / 1e18).toFixed(2); // Converts to Ether and fixes to 2 decimal places
  };

  const formatUsdValue = (weiBalance: string) => {
    const ethBalance = parseFloat(weiBalance) / 1e18;
    const usdValue = ethBalance * ethToUsdRate;
    return usdValue.toFixed(2); // Format USD value to 2 decimal places
  };

  const filteredContracts = contracts.filter((contract) => {
    const query = searchQuery.toLowerCase();
    return (
      contract.name?.toLowerCase().includes(query) ||
      contract.address.hash.toLowerCase().includes(query)
    );
  });

  const Skeleton: React.FC = () => {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <Skeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link href="/newui" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="text-sm">Verified Contracts</div>
          <h1 className="text-xs text-blue font-bold">Home</h1>
        </div>
      </div>
      <div className="w-[60%]">
        <Contracts />
      </div>

      {/* Search Bar */}
      <div className="w-[40%] mt-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by contract name or address"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 mt-10">
        <table className="w-full ">
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
            {filteredContracts.map((contract, index) => (
              <tr key={index} className="border-t">
                <td className="py-3">
                  <div className="font-bold text-black text-sm flex items-center ">
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
                <td className="font-bold">
                  {formatBalance(contract.coin_balance || "0")} {currency}
                  <br />
                  <span className="text-sm font-light text-gray-500">
                    ${formatUsdValue(contract.coin_balance || "0")}
                  </span>
                </td>
                <td>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs font-light text-gray-600 ">
                    {contract.compiler_version}
                  </span>
                </td>
                <td className="text-sm ">{contract.compiler_version}</td>
                <td className="flex items-center gap-1 mt-6">
                  <div className="flex items-center">
                    {contract.optimization_enabled ? (
                      <span className="flex items-center text-[#17a34b] bg-[#d8f7e7] px-1 rounded-md text-sm font-chivo">
                        <Check className="mr-1" size={16} />
                        Optimization
                      </span>
                    ) : (
                      <span className="flex items-center text-[#e75f5c] bg-[#fef1f2]  px-1 rounded-md text-sm font-chivo">
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
                <td className="">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-light">
                    Success
                  </span>
                  <span className="text-xs ml-2">
                    {getTimeAgo(contract.verified_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default VerifiedContractsPage;
