"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/newui/Layout";
import { ArrowRight, Check, X } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import { contracts } from "./utils/data";
const VerifiedContracts = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Verified Contracts</h2>
        <a href="#" className="text-blue-500 hover:underline">
          View All
        </a>
      </div>
      <table className="w-full ">
        <thead className="">
          <tr className="text-left font-light text-black px-4">
            <th className="py-2 font-light">Contracts</th>
            <th className="font-light">Balance</th>
            <th className="font-light">Txns</th>
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
                <div className="font-bold text-black text-sm">
                  {contract.name}
                </div>
                <div className="text-sm text-[#06afe8] font-semibold leading-2 flex items-center">
                  {contract.address}{" "}
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(contract.address)
                    }
                  />
                </div>
              </td>
              <td className="font-bold">
                {contract.balance}
                <br />
                <span className="text-sm font-light text-gray-500">$0</span>
              </td>
              <td className="font-semibold">{contract.txns}</td>
              <td>
                <span className="bg-gray-200 px-2 py-1 rounded-md text-xs font-light text-gray-600 ">
                  {contract.compiler}
                </span>
              </td>
              <td className="text-sm ">{contract.version}</td>
              <td className="flex items-center gap-1 mt-6">
                <div className="flex items-center">
                  {contract.optimization ? (
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
                  {contract.constructorArg ? (
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
                  {contract.status}
                </span>
                <div className="text-sm text-gray-500">{contract.time}</div>
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
