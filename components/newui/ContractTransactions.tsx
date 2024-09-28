"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import Image from "next/image";
import { IoCubeOutline } from "react-icons/io5";

interface Transaction {
  hash: string;
  method: string;
  from: string;
  to: string;
  value: string;
  block: number;
  timestamp: string;
  status: string;
}

interface TransactionProps {
  address: string;
}
const ContractTransactions: React.FC<TransactionProps> = ({ address }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await addressService.getAddressTransactions(
          address,
          `?limit=50&page=1`
        );
        console.log("API Response:", response.items);
        const transactionData = response.items.map((item: any) => ({
          hash: item.hash || "N/A",
          method: item.method === null ? item.tx_types : item.method,
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value: (parseInt(item.value) / 10 ** 18).toFixed(6),
          block: item.block,
          timestamp: item.timestamp,
          status: item.status,
        }));
        setTransactions(transactionData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [address]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <div className="bg-white rounded-3xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center space-x-2 ">
              p[;'<div className="bg-gray-200 rounded-full p-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
             <div className="">
                <p className="font-medium  tracking-wider">
                  {tx.method.charAt(0).toUpperCase() + tx.method.slice(1)}
                </p>
                <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                  #{parseAddress(tx.hash)}{" "}
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(tx.hash)}
                  />
                </p>
              </div>
                    <div className="bg-black px-1 text-center rounded-md text-white flex items-center justify-around ">
                        <IoCubeOutline />
                        {tx.block}
                      </div>
            </div>
            {/* <div className="flex items-center space-x-2">
              <div className="bg-orange-100 rounded-full p-1"></div>
              <div className="text-right">
                <p className="font-medium">0 ETH</p>
                <p className="text-sm text-gray-500">{tx.value} XDC</p>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTransactions;
