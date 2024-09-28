"use client"
import React, { useState, useEffect } from 'react';
import { addressService, transactionService } from './newui/utils/apiroutes';
import { ChevronUp } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import Image from "next/image";

interface InternalTransaction {
  parentHash: string;
  from: string;
  to: string;
  value: string;
}

interface InternalTxProps {
  address: string;
}

const InternalTx: React.FC<InternalTxProps> = ({ address }) => {
  const [internalTxs, setInternalTxs] = useState<InternalTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternalTransactions = async () => {
      try {
        const response = await addressService.getAddressInternalTransactions(address, `?limit=50&page=1`);
        
        const internalTxData = response.items.map((item: any) => ({
          parentHash: item.transaction_hash,
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value: item.value ? (parseInt(item.value) / 10 ** 18).toFixed(6) : "0",
        }));

        setInternalTxs(internalTxData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internal transactions:", err);
        setError('Error fetching internal transactions');
        setLoading(false);
      }
    };

    fetchInternalTransactions();
  }, [address]);

  if (loading) return <div>Loading internal transactions...</div>;
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Internal Transactions</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {internalTxs.map((tx, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
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
              <div>
                <p className="font-medium">Internal Transaction</p>
                <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                  #{parseAddress(tx.parentHash)}{" "}
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(tx.parentHash)}
                  />
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{tx.value} XDC</p>
              <p className="text-sm text-gray-500">
                From: {parseAddress(tx.from)} To: {parseAddress(tx.to)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternalTx;