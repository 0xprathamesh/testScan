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
import Contracts from "@/components/newui/Contracts";

const VerifiedContractsPage = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const formatBalance = (weiBalance: string) => {
    return (parseFloat(weiBalance) / 1e18).toFixed(2); // Converts to Ether and fixes to 2 decimal places
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
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="text-sm">Verified Contracts</div>
          <h1 className="text-xs text-blue font-bold">Home</h1>
        </div>
      </div>
      <div className="w-[60%]">
        {/* First Card */}
        {/* <div className="flex-1 bg-black text-white p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm text-gray-400 mb-2">Verified contracts</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">2218</span>
                <span className="text-sm text-gray-400">of 28745</span>
              </div>
            </div>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-400"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 28%, 0 28%)",
                  transform: "rotate(-90deg)",
                }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-blue-400 font-semibold">
                7.7%
              </span>
            </div>
          </div>
        </div> */}
<Contracts/>
        {/* Second Card */}
        {/* <div className="flex-1 bg-black text-white p-6 rounded-lg">
          <h2 className="text-sm text-gray-400 mb-4">Recent growth in 24h</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">All contracts</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500">+ 26</span>
                <div className="flex items-center text-gray-400">
                  <span className="text-xs">↑</span>
                  <span>0.09%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Verified</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500">+ 13</span>
                <div className="flex items-center text-gray-400">
                  <span className="text-xs">↑</span>
                  <span>0.59%</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
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
                  <div className="font-bold text-black text-sm">
                    {contract.name || "Unknown Contract"}
                  </div>
                  <div className="text-sm text-[#06afe8] font-semibold leading-2 flex items-center">
                    {parseAddress(contract.address.hash)}{" "}
                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(contract.address.hash)
                      }
                    />
                  </div>
                </td>
                <td className="font-bold">
                  {formatBalance(contract.coin_balance || "0")}
                  <br />
                  <span className="text-sm font-light text-gray-500">$0</span>
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
                <td>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-light">
                    Success
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
