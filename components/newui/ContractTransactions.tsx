"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Image from "next/image";
import { IoCubeOutline } from "react-icons/io5";
import Link from "next/link";
import { parseAddress } from "@/lib/helpers";
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
          from:
            item.from?.hash && item.from?.name
              ? item.from?.name
              : item.from?.hash,
          to:
            item.to?.hash && item.to?.name
              ? item.to?.name
              : item.to?.hash
              ? parseAddress(item.to?.hash)
              : "Unknown",
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

  const renderSkeleton = () => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-200 w-8 h-8"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-36 h-4 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 w-[869px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Activity</h2>
          <ChevronUp className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

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
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 w-full"
          >
            <div className="flex items-center justify-between w-full ">
              <div className="flex items-center justify-between">
                <div className="bg-gray-200 rounded-full p-2">
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
                <div className="ml-4">
                  <p className="font-medium  tracking-wider">{tx.method}</p>
                  <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                    <Link href={`/newui/tx/${tx.from}`}>
                      #{parseAddress(tx.hash)}{" "}
                    </Link>
                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    />
                  </p>
                </div>
              </div>
              <Link href={`/newui/block/${tx.block}`}>
                <div className="bg-black px-1 text-center rounded-md text-sm font-chivo text-white flex items-center justify-around ">
                  <IoCubeOutline className="mr-2" />
                  {tx.block}
                </div>
              </Link>
              <div className="flex items-center justify-between gap-x-4 ">
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  <Link href={`/newui/tx/${tx.from}`}>
                    {parseAddress(tx.from)}
                  </Link>
                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.from)}
                  />
                </div>
                <FiArrowRight className="h-4 w-4" />
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  {tx.to}
                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.to)}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">{tx.value} XDC</p>
              </div>
              <div className="">
                <button
                  className={`text-sm font-light px-2 py-1 rounded-md  ${
                    tx.status === "ok"
                      ? "text-green-400 bg-[#EEFDF5]"
                      : "text-red-500 bg-red-200"
                  }`}
                >
                  {tx.status === "ok" ? "Success" : "Failed"}
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
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
