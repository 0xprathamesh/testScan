"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/elements/Loading";
import Layout from "@/components/newui/Layout";
import Transfers from "@/components/newui/Transfers";
import TokenHolders from "@/components/newui/TokenHolders";
import ContractDetails from "@/components/newui/ContractDetails";
import { tokenService } from "@/components/newui/utils/apiroutes";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useRouter } from "next/navigation";
import "react-circular-progressbar/dist/styles.css";
import { User } from 'lucide-react';
interface PageProps {
  params: {
    address: string;
  };
}

const Token: React.FC<PageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState<string>("transfers");
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [topHolders, setTopHolders] = useState<any[]>([]); // State for top holders
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await tokenService.getToken(params.address);
        setTokenData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token data:", error);
        setLoading(false);
      }
    };

    const fetchTopHolders = async () => {
      try {
        const response = await tokenService.getTokenHolders(
          params.address,
          "?limit=3&page=1"
        ); // Fetch top 3 holders
        setTopHolders(response.items); // Assuming response.items contains the holders
      } catch (error) {
        console.error("Error fetching top holders:", error);
      }
    };

    fetchTokenData();
    fetchTopHolders();
  }, [params.address]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "transfers":
        return <Transfers address={params.address} />;
      case "holders":
        return <TokenHolders address={params.address} />;
      case "contract":
        return <ContractDetails address={params.address} />;
      default:
        return <Transfers address={params.address} />;
    }
  };

  const parseAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const generateGradient = (hash: string) => {
    const colors = [
      ["#FF6B6B", "#4ECDC4"],
      ["#A8E6CF", "#FFD3B6"],
      ["#FFAAA5", "#FF8B94"],
      ["#DBE2EF", "#3F72AF"],
      ["#95E1D3", "#EAFFD0"],
    ];
    // Use last characters of hash to select a gradient
    const index = parseInt(hash.slice(-1), 16) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
  };
  return (
    <Layout>
      {loading ? (
        <>
          <div className="items-center text-blue"><Loading/></div>
          </>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center">
              <Link href="" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
              <span className="text-md font-semibold">Token Details</span>
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
            <div className="col-span-2 bg-black text-white rounded-3xl p-10 flex">
              <div className="flex-1 items-center">
                <Image
                  src={tokenData?.icon_url || "/assets/user.svg"}
                  alt={tokenData?.name || "Token Image"}
                  className="w-20 h-20 rounded-full"
                  width={80}
                  height={80}
                />
                <div className="mt-6">
                  <h2 className="text-xl font-bold font-inter">
                    {tokenData?.name || "Token Name"}
                  </h2>
                  <p className="text-sm font-light font-inter text-[#8a98ad]">
                    Symbol: {tokenData?.symbol || "N/A"}
                  </p>
                </div>
              </div>

              {/* Token Data Cards */}
              <div className="grid grid-cols-2 gap-4 w-[80%]">
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Circulating Market Cap (USD)</p>
                  <p className="font-bold">
                    {tokenData.circulating_market_cap_usd || "N/A"}
                  </p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Max Supply</p>
                  <p className="font-bold">{tokenData.max_supply || "N/A"}</p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Exchange Rate (USD)</p>
                  <p className="font-bold">
                    {tokenData.exchange_rate || "N/A"}
                  </p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">24h Volume</p>
                  <p className="font-bold">{tokenData.volume_24h || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Top Holders
              </h2>

              {topHolders.length > 0 ? (
                <ul className="space-y-4">
                  {topHolders.map((holder, index) => {
                    const percentage =
                      parseFloat(holder.value) /
                      parseFloat(tokenData?.total_supply);
                    const result = percentage * 100;

                    return (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <div
                              className="absolute inset-0 rounded-full overflow-hidden"
                              style={{
                                background: generateGradient(
                                  holder.address.hash
                                ),
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-white">
                                <User className="w-5 h-5 opacity-50" />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {holder.address?.name ||
                                parseAddress(holder.address.hash)}
                            </span>
                            {holder.address?.name && (
                              <span className="text-xs text-gray-500">
                                {parseAddress(holder.address.hash)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-semibold text-gray-600">
                            {result.toFixed(2)}%
                          </span>
                          <div className="w-8 h-8 relative">
                            <div
                              className="absolute inset-0 rounded-full bg-gray-100"
                              style={{
                                background: `conic-gradient(#4caf50 ${result}%, #f3f4f6 0)`,
                              }}
                            />
                            <div className="absolute inset-1 rounded-full bg-white" />
                            <div
                              className="absolute inset-2 rounded-full"
                              style={{
                                background: `conic-gradient(#4caf50 ${result}%, transparent 0)`,
                              }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No holders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {["transfers", "holders", "contract"].map((tab) => (
                  <a
                    key={tab}
                    href="#"
                    className={`border-b-2 py-2 px-4 text-sm font-medium ${
                      activeTab === tab
                        ? "border-blue text-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace(/([A-Z])/g, " $1")}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">{renderTabContent()}</div>
        </>
      )}
    </Layout>
  );
};

export default Token;
