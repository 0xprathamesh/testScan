"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { fetchContracts } from "./utils/xdcrpc";

const Contracts = () => {
  const [data, setData] = useState({
    smart_contracts: "",
    new_smart_contracts_24h: "",
    new_verified_smart_contracts_24h: "",
    verified_smart_contracts: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const contractInsights = [
    `Total Smart Contracts: ${data.smart_contracts}`,
    `New Smart Contracts (24h): ${data.new_smart_contracts_24h}`,
    `New Verified Smart Contracts (24h): ${data.new_verified_smart_contracts_24h}`,
    `Verified Smart Contracts: ${data.verified_smart_contracts}`,
  ];

  const fetchData = async () => {
    const result = await fetchContracts();
    if (result) {
      setData({
        smart_contracts: result.smart_contracts,
        new_smart_contracts_24h: result.new_smart_contracts_24h,
        new_verified_smart_contracts_24h:
          result.new_verified_smart_contracts_24h,
        verified_smart_contracts: result.verified_smart_contracts,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? contractInsights.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === contractInsights.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white text-white p-6 rounded-3xl col-span-1 md:col-span-2">
      <h3 className="text-sm text-gray-400 mb-2 flex items-center justify-between">
Contracts Insights
        <div className="flex items-center justify-between gap-2">
          <button onClick={handlePrev} className="border rounded-full p-1">
            <MdKeyboardArrowLeft className="h-6 w-6" />
          </button>
          <button onClick={handleNext} className="border rounded-full p-1">
            <MdKeyboardArrowRight className="h-6 w-6" />
          </button>
        </div>
      </h3>

      <p className="mt-4 flex items-center text-[#4a4a4a] text-sm font-chivo font-light">
        <span className="mr-2 text-xl">💡</span>
        {contractInsights[currentIndex]}
      </p>
    </div>
  );
};

export default Contracts;
