"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { IoReceiptOutline,IoCubeOutline } from "react-icons/io5";
import { FiSearch, FiCopy, FiArrowRight } from "react-icons/fi";
import Layout from "@/components/newui/Layout";
import Loading from "@/components/elements/Loading";
import Link from "next/link";
import { Copy } from "lucide-react";
const TransactionTable = () => {
  // Fixing the transactions state type
  const [transactions, setTransactions] = useState<
    ethers.providers.TransactionResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const rpcUrl =
        "https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe";
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const latestBlockNumber = await provider.getBlockNumber();
      const block = await provider.getBlockWithTransactions(latestBlockNumber);

      // TypeScript will now know this is of type TransactionResponse[]
      setTransactions(block.transactions.slice(0, 10)); // Limiting to 10 transactions for this example
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching transaction data");
      setLoading(false);
    }
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getMethodName = (tx: ethers.providers.TransactionResponse) => {
    if (tx.data === "0x") return "Transfer";
    if (tx.to === null) return "Contract Creation";
    return "Contract Call";
  };

  if (loading)
    return (
      <Layout>
        <div className="h-40 m-auto text-blue">
          <Loading />
        </div>
      </Layout>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <a href="#" className="text-blue-500">
            Home
          </a>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search ID / Address / Transactions"
            className="w-full p-2 pl-10 rounded border"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Txn Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Txn Fee (ETH)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => {
                const method = getMethodName(tx);
                const valueInEther = ethers.utils.formatEther(tx.value || "0");
                const gasFeeInEther =
                  tx.gasPrice && tx.gasLimit
                    ? ethers.utils.formatEther(tx.gasPrice.mul(tx.gasLimit))
                    : "N/A";

                return (
                  <tr key={tx.hash} className="border-b">
                    <td className="px-6 py-4">
                      <div className="text-blue font-chivo text-sm font-light leading flex items-center">
                        <Link href={`/newui/tx/${tx.hash}`}>
                          {truncateAddress(tx.hash)}
                        </Link>
                        <Copy
                          className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                          onClick={() => navigator.clipboard.writeText(tx.hash)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="inline-flex items-center text-center border px-2 text-sm py-1 rounded-full">
                        <span className="inline-block rounded-full bg-green-500 h-2 w-2 mr-2"></span>
                        <span className="text-center font-chivo">{method}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="bg-black px-1 text-center rounded-md text-white flex items-center">
                        <IoCubeOutline />
                        {tx.blockNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue text-sm font-light">
                        {truncateAddress(tx.from)}
                        <FiCopy className="inline cursor-pointer ml-2" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-500">
                      <FiArrowRight className="h-4 w-4" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue text-sm font-light">
                        {tx.to ? truncateAddress(tx.to) : "Contract Creation"}
                        <FiCopy className="inline cursor-pointer ml-2" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {parseFloat(valueInEther).toFixed(2)} ETH
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {parseFloat(gasFeeInEther).toFixed(6)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionTable;
