"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/newui/Layout";
import { ethers } from "ethers";
import { ArrowLeft, Copy, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../../../public/assets/user.svg";
import Loading from "@/components/elements/Loading";
import Wallet from "@/components/newui/Wallet";
import InternalTx from "@/components/InternalTx";
import Activity from "@/components/Activity";
import TokenTransfers from "@/components/TokenTransfers";

interface PageProps {
  params: {
    address: string;
  };
}

interface UserDetails {
  name: string;
  address: string;
  avatar: string;
  netWorth: number;
  tokens: number;
  nfts: number;
  ethereumBalance: number;
}

interface Asset {
  name: string;
  symbol: string;
  balance: number;
  value: number;
  price: number;
}

const Address: React.FC<PageProps> = ({ params }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState("wallet");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const rpcUrl =
          "https://erpc.xinfin.network/"; // https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const balance = await provider.getBalance(params.address);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance));
        const ethPrice = 2450.54;

        const userDetails: UserDetails = {
          name: `Pioneer 79245`,
          address: params.address,
          avatar: `/api/placeholder/32/32?text=${params.address.slice(0, 2)}`,
          netWorth: ethBalance * ethPrice,
          tokens: ethBalance * ethPrice,
          nfts: 0,
          ethereumBalance: ethBalance,
        };

        const assets: Asset[] = [
          {
            name: "Ethereum",
            symbol: "ETH",
            balance: ethBalance,
            value: ethBalance * ethPrice,
            price: ethPrice,
          },
        ];

        setUserDetails(userDetails);
        setAssets(assets);
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.address]);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-blue">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !userDetails) {
    return (
      <Layout>
        <div>{error || "Error loading user details"}</div>
      </Layout>
    );
  }

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "wallet":
        return <Wallet assets={assets} />;
      case "activity":
        return <Activity />;
      case "token":
        return <TokenTransfers />;
      case "internalTransactions":
        return <InternalTx />;
    
      default:
        return <Wallet assets={assets} />;
    }
  }
  return (
    <Layout>
      {/* Header */}
      <div className=" mb-4">
        <div className="flex items-center">
          <Link href="/newui">
          <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
          <span className="text-md font-semibold ">User Details •</span>
        </div>
        <div className="flex items-center ml-[22px] mt-1">
          <Link href="/newui" className="text-blue text-sm ">
            Home •
          </Link>
          <p className="text-sm font-light ml-2 ">
            {parseAddress(params.address)}
          </p>
          <Copy
            className="w-4 h-4 ml-2 cursor-pointer text-[#8a98ad]"
            onClick={() => navigator.clipboard.writeText(params.address)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-black text-white rounded-3xl p-10 flex ">
          <div className="flex-1 items-center ">
            <Image
              src={Avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
              width={80}
              height={80}
            />
            <div className="mt-6">
              <h2 className="text-xl font-bold font-inter">
                {userDetails.name}
              </h2>
              <p className="text-sm font-light font-inter flex items-center text-[#8a98ad]">
                {parseAddress(userDetails.address)}
                <Copy
                  className="w-4 h-4 cursor-pointer text-[#8a98ad] ml-2"
                  onClick={() =>
                    navigator.clipboard.writeText(userDetails.address)
                  }
                />
              </p>
              <p className="mt-8 text-sm">
                <span className="text-[#8a98ad] font-inter text-sm">
                  Net Worth
                </span>{" "}
                ${userDetails.netWorth.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 w-[40%]">
            <div className="bg-[#382927] pt-4 pl-4 rounded-3xl ">
              <p className="text-sm">Tokens</p>
              <p className="font-bold">${userDetails.tokens.toFixed(2)}</p>
            </div>
            <div className="bg-[#382927] pt-4 pl-4  rounded-3xl">
              <p className="text-sm">NFTs</p>
              <p className="font-bold">${userDetails.nfts}</p>
            </div>
          </div>
        </div>

        {userDetails.netWorth < 100 && (
          <div className="bg-white rounded-lg p-4 flex items-center">
            <img
              src="/api/placeholder/32/32?text=🐢"
              alt="Tortoise"
              className="w-8 h-8 mr-2"
            />
            <div>
              <p className="font-bold">You have spotted a Tortoise!</p>
              <p className="text-sm">
                Tortoise are new users with a wallet with less than $100
              </p>
            </div>
          </div>
        )}
      </div>

      {/* <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              "wallet",
              "activity",
              "tokenTransfers",
              "internalTransactions",
              "insights",
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
      </div> */}
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              "wallet",
              "activity",
              "token",
              "internalTransactions",
              "insights",
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

      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Search All Assets"
          className="w-full pl-10 pr-4 py-2 border rounded-md"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>
      <div className="mt-4">{renderTabContent()}</div>

      {/* <div className="mt-4">
        <div className="flex space-x-2 mb-4">
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            All ({assets.length})
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Tokens ({assets.length})
          </span>
        </div>
        {assets.map((asset, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 flex items-center justify-between mb-2"
          >
            <div className="flex items-center">
              <img
                src={`/api/placeholder/32/32?text=${asset.symbol}`}
                alt={asset.name}
                className="w-8 h-8 mr-2"
              />
              <div>
                <p className="font-medium">
                  {asset.name} ({asset.symbol})
                </p>
                <p className="text-sm text-gray-500">Token</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ${asset.value.toFixed(2)} ({asset.balance.toFixed(4)}{" "}
                {asset.symbol})
              </p>
              <p className="text-sm text-gray-500">
                1 {asset.symbol} = ${asset.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div> */}
    </Layout>
  );
};

export default Address;
