"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { fetchContracts } from "./utils/xdcrpc";

import Link from "next/link";
const Contracts = () => {
  const [data, setData] = useState({
    smart_contracts: "",
    new_smart_contracts_24h: "",
    new_verified_smart_contracts_24h: "",
    verified_smart_contracts: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchContracts();
      if (result) {
        setData({
          smart_contracts: result.smart_contracts,
          new_smart_contracts_24h: result.new_smart_contracts_24h,
          new_verified_smart_contracts_24h: result.new_verified_smart_contracts_24h,
          verified_smart_contracts: result.verified_smart_contracts,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl col-span-2 md:col-span-2 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">Total contracts built on chain</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold mr-2">{data.smart_contracts}</span>
          <span className="text-xs text-green-500 bg-green-100 px-1 py-0.5 rounded">
            +{data.new_smart_contracts_24h} in last 24 hours
          </span>
        </div>
      </div>
      <div className="w-px bg-gray-200 h-12 mx-4"></div>
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">Verified</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold mr-2">{data.verified_smart_contracts}</span>
          <span className="text-xs text-green-500 bg-green-100 px-1 py-0.5 rounded">
            +{data.new_verified_smart_contracts_24h} in last 24 hours
          </span>
        </div>
      </div>
   <Link href={`/newui/accounts`}>
      <MdKeyboardArrowRight className="text-gray-400 text-2xl ml-4" /></Link>
    </div>
  );
};

export default Contracts;
//     <div className="bg-white text-white p-6 rounded-3xl col-span-1 md:col-span-2">
//       <h3 className="text-sm text-gray-400 mb-2 flex items-center justify-between">
// Contracts Insights
//         <div className="flex items-center justify-between gap-2">
//           <button onClick={handlePrev} className="border rounded-full p-1">
//             <MdKeyboardArrowLeft className="h-6 w-6" />
//           </button>
//           <button onClick={handleNext} className="border rounded-full p-1">
//             <MdKeyboardArrowRight className="h-6 w-6" />
//           </button>
//         </div>
//       </h3>

//       <p className="mt-4 flex items-center text-[#4a4a4a] text-sm font-chivo font-light">
//         <span className="mr-2 text-xl">💡</span>
//         {contractInsights[currentIndex]}
//       </p>
//     </div>