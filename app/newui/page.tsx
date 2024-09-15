"use client";
import Copyable from "@/components/elements/Copyable";
import Layout from "@/components/newui/Layout";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEthereum } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";
import { getCoinData } from "@/components/newui/utils/coingeko";
import Image from "next/image";

const MantaDashboard: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [coinData, setCoinData] = useState<any>(null);
  const stickyRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await getCoinData(); 
      setCoinData(data); 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const xdcPrice = coinData?.market_data?.current_price?.usd ?? "Loading...";
  const xdcMarketCap = coinData?.market_data?.market_cap?.usd ?? "Loading...";
  const xdcBTCPrice = coinData?.market_data?.current_price?.btc ?? "Loading...";
  const xdcPriceChange = coinData?.market_data?.price_change_percentage_24h ?? "Loading...";
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:w-full p-6 justify-between w-full">
        {/* Search Section */}
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
                  className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md  mb-2 outline-none placeholder:font-chivo"
                  placeholder="Search transactions/blocks/address/tokens"
                  required
                />
              </div>
            </form>

            <div className="mt-4">
              <h2 className="text-lg font-normal font-inter mb-2">
                Recent searches:
              </h2>
              <div className="">
                <span className="text-md text-gray-600 bg-purple-100 px-2 py-1 rounded-xl leading flex w-48 text-center items-center">
                  <Copyable
                    text="0xde2...1fb35 "
                    copyText="0xde2...1fb35"
                    className=""
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 md:mt-0 md:ml-8">
          <div className="bg-black text-white p-6 rounded-3xl col-span-1 md:col-span-2">
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
            <h3 className=" mb-2 text-sm text-gray-400">Native token</h3>
            <div className="flex  flex-col ">
              <div className=" rounded-full mb-6 mt-4 ">
                {" "}
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
                <p className="text-2xl font-bold ">XDC</p>
                <div>
                  
                  <p className="text-xl">${xdcPrice}</p>
                  <p className="text-sm text-gray-400">
                    @ {xdcBTCPrice} BTC{" "}
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


          <div className="rounded-3xl shadow grid grid-rows-2  ">
            <div className="flex justify-between p-6 bg-white rounded-3xl ">
              <div>
                <h3 className="text-lg mb-2">Deposits</h3>
                <p className="text-4xl font-bold">18,562</p>
              </div>
              <HiOutlineArrowSmDown className="text-[96px] text-green-500 font-bold" />
            </div>
            <div className="flex  justify-between bg-black p-6 rounded-ee-3xl rounded-es-3xl ">
              <div>
                <h3 className="text-lg mb-2 text-white">Withdrawals</h3>
                <p className="text-4xl font-bold text-white">55,833</p>
              </div>
              <HiOutlineArrowSmUp className="text-[96px] text-green-500 font-bold" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MantaDashboard;
