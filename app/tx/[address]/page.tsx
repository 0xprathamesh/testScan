// /app/tx/[txHash]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter, useSearchParams } from "next/navigation";
import provider from "@/ethers"; // Make sure to adjust the import path
import Copyable from "@/components/elements/Copyable"; // Adjust the import path if necessary

const TransactionDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txHash = searchParams.get('txHash'); // Extract transaction hash from the search parameters
  const [txData, setTxData] = useState<any>(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (txHash) {
        try {
          // Fetch transaction data using ethers.js provider
          const transaction = await provider.getTransaction(txHash as string);
          setTxData(transaction);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        }
      }
    };

    fetchTransactionData();
  }, [txHash]);

  if (!txData) {
    return <div className="p-4">Loading transaction data...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <div className="mb-2">
          <span className="font-medium">Transaction Hash:</span> {txData.hash}
        </div>
        <div className="mb-2">
          <span className="font-medium">Block Number:</span> {txData.blockNumber}
        </div>
        <div className="mb-2">
          <span className="font-medium">From:</span>{" "}
          <Copyable text={txData.from} copyText={txData.from} />
        </div>
        <div className="mb-2">
          <span className="font-medium">To:</span>{" "}
          {txData.to ? <Copyable text={txData.to} copyText={txData.to} /> : "Contract Creation"}
        </div>
        <div className="mb-2">
          <span className="font-medium">Value:</span> {ethers.utils.formatEther(txData.value)} ETH
        </div>
        <div className="mb-2">
          <span className="font-medium">Gas Price:</span>{" "}
          {ethers.utils.formatUnits(txData.gasPrice, "gwei")} Gwei
        </div>
        <div className="mb-2">
          <span className="font-medium">Nonce:</span> {txData.nonce}
        </div>
        <div className="mb-2">
          <span className="font-medium">Gas Limit:</span> {txData.gasLimit.toString()}
        </div>
        <div className="mb-2">
          <span className="font-medium">Transaction Index:</span> {txData.transactionIndex}
        </div>
        {/* Add more transaction details if needed */}
      </div>
    </div>
  );
};

export default TransactionDetails;
