"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "./newui/utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Link from "next/link";
import { IoFlashOutline } from "react-icons/io5";

interface Transaction {
  hash: string;
  method: string;
  from: string;
  to: string;
  value: string;
}

interface ActivityProps {
  address: string;
}

const Activity: React.FC<ActivityProps> = ({ address }) => {
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

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderSkeleton = () => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-200 rounded-full p-2 w-8 h-8 animate-pulse"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-36 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-gray-200 rounded-full p-2 w-8 h-8 animate-pulse"></div>
        <div className="text-right">
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
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
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => {
          // Determine whether the transaction is IN or OUT
          const direction =
            tx.to.toLowerCase() === address.toLowerCase() ? "IN" : "OUT";

          return (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`rounded-full p-2 ${
                    direction === "IN" ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <IoFlashOutline />
                </div>
                <div>
                  <p className="font-medium flex items-center">
                    <span className="capitalize">{tx.method}</span>
                    {direction === "IN" ? (
                      <div className="bg-green-100 border border-dashed border-green-500 text-xs ml-2 px-2 rounded-md">
                        IN
                      </div>
                    ) : (
                      <div className="bg-red-100 border border-dashed border-red-400 text-xs ml-2 px-2 rounded-md">
                        OUT
                      </div>
                    )}
                  </p>
                  <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                    <Link href={`/newui/tx/${tx.hash}`}>
                      {parseAddress(tx.hash)}
                    </Link>

                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    />
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-x-4 ">
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  <Link href={`/newui/address/${tx.from}`}>
                    {parseAddress(tx.from)}
                  </Link>
                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.from)}
                  />
                </div>
                <FiArrowRight className="h-4 w-4" />
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  <Link href={`/newui/address/${tx.to}`}>
                    {" "}
                    {parseAddress(tx.to)}
                  </Link>

                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.to)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{tx.value} XDC</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
