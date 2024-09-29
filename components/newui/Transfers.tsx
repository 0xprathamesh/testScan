"use client";
import React, { useEffect, useState } from "react";
import { addressService, tokenService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Image from "next/image";
import { IoCubeOutline } from "react-icons/io5";
import Link from "next/link";

interface Transfer {
  hash: string;
  from: string;
  to: string;
  method: string;
  block: number;
  timestamp: string;
  status: string;
}
interface TokenProps {
  address: string;
}

const Transfers: React.FC<TokenProps> = ({ address }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await tokenService.getTokenTransfers(
          address,
          `?type=&limit=50&page=1`
        );
        console.log("Token Transfers ===========>", response.items);
        const transfersData = response.items.map((item: any) => ({
          hash: item.tx_hash || "N/A",
          from: item.from?.hash,
          to: item.to?.hash,
          method: item.method_name,
          block: item.block_number,
          timestamp: item.timestamp,
          status: "Success",
        }));
        setTransfers(transfersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };
    fetchTransfers();
  }, [address]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transfers.map((tx, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 w-full"
          >
            <div className="flex items-center justify-between w-full ">
              <div className="flex items-center">
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
                  <div className="flex items-center justify-between gap-x-4 ">
                    <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                      {parseAddress(tx.from)}
                      <FiCopy
                        className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                        onClick={() => navigator.clipboard.writeText(tx.from)}
                      />
                    </div>
                    <FiArrowRight className="h-4 w-4" />
                    <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                      {parseAddress(tx.to)}
                      <FiCopy
                        className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                        onClick={() => navigator.clipboard.writeText(tx.to)}
                      />
                    </div>
                  </div>
                  <p className="text-xs leading-2 font-light text-[#06afe8] flex items-center">
                    #{parseAddress(tx.hash)}{" "}
                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    />
                  </p>
                </div>
              </div>

              {/* Block */}
              <Link href={`/newui/block/${tx.block}`}>
                <div className="bg-black px-1 text-center rounded-md text-sm font-chivo text-white flex items-center justify-around ">
                  <IoCubeOutline className="mr-2" />
                  {tx.block}
                </div>
              </Link>

              {/* Timestamp */}
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

              {/* Status */}
              <div className="">
                <button
                  className={`text-sm font-light px-2 py-1 rounded-md  ${
                    tx.status === "Success"
                      ? "text-green-400 bg-[#EEFDF5]"
                      : "text-red-500 bg-red-200"
                  }`}
                >
                  {tx.status === "Success" ? "Success" : "Failed"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Transfers;
