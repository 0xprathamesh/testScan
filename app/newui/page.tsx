"use client";
import Copyable from "@/components/elements/Copyable";
import Layout from "@/components/newui/Layout";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";
import DidYouKnow from "@/components/newui/Didyouknow";
import { getCoinData } from "@/components/newui/utils/coingeko";
import Image from "next/image";

import { FiArrowRight } from "react-icons/fi";
import { MdKeyboardArrowRight, MdOutlineArrowOutward } from "react-icons/md";
import Link from "next/link";
import { getBlockchainData } from "@/components/newui/utils/xdcrpc";
import { PiArrowElbowDownRightFill } from "react-icons/pi";
import { IoCubeOutline } from "react-icons/io5";

const MantaDashboard: React.FC = () => {
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [coinData, setCoinData] = useState<any>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]); // State for recent searches

  const stickyRef = useRef(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const data = await getCoinData();
      const blockchainDataApi = await getBlockchainData(
        "https://erpc.xinfin.network/"
      );
      setBlockchainData(blockchainDataApi);
      setCoinData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInput(value);

    if (/^\d+$/.test(value)) {
      setSuggestions([`Block Number: ${value}`]);
    } else if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setSuggestions([`Address: ${value}`]);
    } else if (/^0x([A-Fa-f0-9]{64})$/.test(value)) {
      setSuggestions([`Transaction Hash: ${value}`]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const [type, value] = suggestion.split(": ").map((str) => str.trim());

    setRecentSearches((prev) => {
      const updatedSearches = [
        suggestion,
        ...prev.filter((item) => item !== suggestion),
      ];
      return updatedSearches.slice(0, 3);
    });

    // Navigate based on the search type
    switch (type) {
      case "Block Number":
        router.push(`/newui/block/${value}`);
        break;
      case "Address":
        router.push(`/newui/address/${value}`);
        break;
      case "Transaction Hash":
        router.push(`/newui/tx/${value}`);
        break;
      default:
        break;
    }
  };
  if (!blockchainData) {
    return <Layout><div className="opacity-0">""</div> </Layout>;
  }
  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const xdcPrice = coinData?.market_data?.current_price?.usd ?? "Loading...";
  const xdcBTCPrice = coinData?.market_data?.current_price?.btc ?? "Loading...";
  const xdcPriceChange =
    coinData?.market_data?.price_change_percentage_24h ?? "Loading...";
  const { totalTransactions, latestTransaction } = blockchainData;
  const parsedTransactionhash = parseAddress(latestTransaction);
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:w-full p-6 justify-between w-full mb-40">
        <div className="w-full md:w-1/2" ref={stickyRef}>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isSticky ? "sticky top-0 pt-4" : ""
            }`}
          >
            <h1 className="text-3xl font-bold mb-6 font-mplus">
              What are you looking for?
            </h1>
            <form>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <GoSearch className="w-5 h-5 mb-2 text-gray-500" />
                </div>
                <input
                  type="search"
                  id="default-search"
                  value={input}
                  onChange={handleChange}
                  className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md mb-2 outline-none placeholder:font-chivo"
                  placeholder="Search transactions/blocks/address/tokens"
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md font-chivo">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>

            <div className="mt-4">
              <h2 className="text-lg font-normal font-inter mb-2">
                Recent searches:
              </h2>
              <div className="">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <span
                      key={index}
                      className="text-md text-gray-600 bg-purple-100 px-2 py-1 rounded-xl leading flex w-48 text-center items-center mb-2"
                    >
                      <Copyable text={search} copyText={search} className="" />
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No recent searches</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-0 md:ml-8">
          <div className="bg-black text-white p-6 rounded-3xl col-span-1 md:col-span-2 ">
            <h3 className="text-sm text-gray-400 mb-2">
              Single transaction costs just around
            </h3>
            <p className="text-2xl font-bold">$0.00099</p>
            <p className="text-gray-400">(0.02 Gwei)</p>
            <p className="mt-4 flex items-center text-purple-400 text-sm font-chivo font-light">
              <span className=" mr-2 text-xl ">💡</span>
              For a single 💰, you can savor 3030 transactions on Manta, while
              only 21 on Ethereum. 🤯
            </p>
          </div>

          {/* Native Token Box */}
          <div className="bg-black p-6 rounded-3xl">
            <h3 className="mb-2 text-sm text-gray-400">Native token</h3>
            <div className="flex flex-col ">
              <div className="rounded-full mb-6 mt-4">
                {coinData?.image?.thumb ? (
                  <Image
                    src={coinData.image.large}
                    alt=""
                    height={96}
                    width={96}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="text-white">
                <p className="text-2xl font-bold">XDC</p>
                <div>
                  <p className="text-xl">${xdcPrice}</p>
                  <p className="text-sm text-gray-400">
                    @ {xdcBTCPrice} BTC
                    <span
                      className={`text-${
                        xdcPriceChange > 0 ? "green" : "red"
                      }-500`}
                    >
                      ({xdcPriceChange}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl shadow grid grid-rows-2">
            <div className="flex justify-between p-6 bg-white rounded-3xl">
              <div>
                <h3 className="text-lg mb-2">Deposits</h3>
                <p className="text-4xl font-bold">18,562</p>
              </div>
              <HiOutlineArrowSmDown className="text-[96px] text-green-500 font-bold" />
            </div>
            <div className="flex justify-between bg-black p-6 rounded-ee-3xl rounded-es-3xl">
              <div>
                <h3 className="text-lg mb-2 text-white">Withdrawals</h3>
                <p className="text-4xl font-bold text-white">55,833</p>
              </div>
              <HiOutlineArrowSmUp className="text-[96px] text-green-500 font-bold" />
            </div>
          </div>

          <div className="bg-white border-gray-300 border-[0.5px] text-white p-6 rounded-3xl col-span-1 md:col-span-2">
            <h3 className="text-sm text-gray-400 mb-2 flex items-center justify-between ">
              Total transactions on Chain{" "}
              <Link href={`/newui/txns`} className="">
                <MdKeyboardArrowRight className="h-6 w-6 " />
              </Link>
            </h3>
            <p className="text-2xl font-bold text-black">{totalTransactions}</p>
            <p className="text-gray-400">(0.02 Gwei)</p>
            <div className="h-16 relative mb-2">
              <svg className="w-full h-full">
                <path
                  d="M0,32 L50,28 L100,30 L150,25 L200,15 L250,14 L300,13"
                  stroke="red"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="mt-4 flex items-center text-[#66798e] text-sm font-chivo font-light">
              <span className=" mr-2 text-xl ">💡</span>
              For a single 💰, you can savor 3030 transactions on Manta, while
              only 21 on Ethereum. 🤯
            </p>
          </div>
          <DidYouKnow />
          <div className="bg-black p-6 rounded-3xl">
            <h3 className="mb-2 text-sm text-gray-400 flex items-center justify-between">
              Ongoing Transaction
              <Link href={`/newui/txns`} className="">
                <MdKeyboardArrowRight className="h-6 w-6 " />
              </Link>
            </h3>
            <div className="flex flex-col ">
              <MdOutlineArrowOutward className="w-8 p-1 h-8 mb-2 text-white bg-[#217f9e] rounded-full border-[#98e6ff]" />

              <div className="text-white">
                <p className="text-2xl font-semibold leading hover:underline mb-2">
                  0xcd23...34244
                </p>
                <div>
                  <p className="text-sm font-chivo  font-extralight flex items-center gap-1">
                    <PiArrowElbowDownRightFill /> A few seconds ago
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className={`text-sm mt-1`}>
                      $0.01 (0.000000885 Gwei)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-3xl">
            <h3 className="mb-2 text-sm text-gray-400 flex items-center justify-between">
             Latest Blocks
              <Link href={`/newui/txns`} className="">
                <MdKeyboardArrowRight className="h-6 w-6 " />
              </Link>
            </h3>
            <div className="flex flex-col ">
              <IoCubeOutline className="w-8 p-1 h-8 mb-2 text-white bg-[#217f9e] rounded-full border-[#98e6ff]" />

              <div className="text-white">
                <Link href={`/newui/blocks`} className="">
                <p className="text-2xl font-semibold leading hover:underline mb-2">
                 8645321
                  </p>
                  </Link>
                <div>
                  <p className="text-sm font-chivo  font-extralight flex items-center gap-1">
                    <PiArrowElbowDownRightFill /> 41 Transactions
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className={`text-sm mt-1`}>
                      $0.01 (0.000000885 Gwei)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MantaDashboard;
