// pages/block/[blocknumber]/transactions.tsx

"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import Navbar from "@/components/Devnav";

interface PageProps {
  params: {
    block: string;
  };
}

const TransactionsPage: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<ethers.providers.BlockWithTransactions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.block) {
      const blockNumber = parseInt(params.block, 10);
      if (isNaN(blockNumber)) {
        setError("Invalid block number");
      } else {
        fetchBlockData(blockNumber);
      }
    } else {
      setError("No Block Number Provided");
    }
  }, [params.block]);

  const fetchBlockData = async (blockNumber: number) => {
    try {
      const rpcUrl: string | null = localStorage.getItem("rpcUrl");
      if (!rpcUrl) {
        setError("No RPC URL found in local storage");
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlockWithTransactions(blockNumber);

      if (!block) {
        setError("No block information found");
        return;
      }

      setBlockData(block);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching block data");
    }
  };

  const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!blockData) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <section className="mt-16">
        <div className="px-10 py-4 mt-8 text-md font-chivo text-gray-900 w-full bg-[#f9f8fa] border-b">
          Blockchain &gt; Block &gt; Transactions &gt;
          <span className="text-gray-500 text-md ml-1">#{blockData.number}</span>
        </div>
        <div className="px-10 py-4  w-full border-b text-gray-500">
          <nav className="flex items-center justify-start gap-8">
            <Link href={`/block/${params.block}`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm">Overview</p>
            </Link>
            <Link href={`/block/${params.block}/transactions`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm ">Transactions</p>
            </Link>
          </nav>
        </div>

        <div className="bg-white px-8 py-4 rounded-lg">
          <h1 className="text-lg font-bold mb-4">Transactions</h1>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Txn Hash</th>
                <th className="border px-4 py-2 text-left">Method</th>
                <th className="border px-4 py-2 text-left">Block</th>
                <th className="border px-4 py-2 text-left">From</th>
                <th className="border px-4 py-2 text-left">To</th>
                <th className="border px-4 py-2 text-left">Value</th>
                <th className="border px-4 py-2 text-left">Txn Fee</th>
                <th className="border px-4 py-2 text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              {blockData.transactions.map((tx) => {
                const method = tx.data === "0x" ? "Transfer" : "Contract Call";
                const valueInEther = ethers.utils.formatEther(tx.value);
                const gasFeeInEther = ethers.utils.formatEther(tx.gasPrice.mul(tx.gasLimit));
                const age = new Date(Date.now() - blockData.timestamp * 1000).toISOString().substr(11, 8); // Displays time in HH:MM:SS format

                return (
                  <tr key={tx.hash}>
                    <td className="border px-4 py-2">
                      <Link href={`/transaction/${tx.hash}`}>
                        <p className="text-blue-500">{parseAddress(tx.hash)}</p>
                      </Link>
                    </td>
                    <td className="border px-4 py-2">{method}</td>
                    <td className="border px-4 py-2">{blockData.number}</td>
                    <td className="border px-4 py-2">{parseAddress(tx.from)}</td>
                    <td className="border px-4 py-2">{tx.to ? parseAddress(tx.to) : "Contract Creation"}</td>
                    <td className="border px-4 py-2">{valueInEther} ETH</td>
                    <td className="border px-4 py-2">{gasFeeInEther} ETH</td>
                    <td className="border px-4 py-2">{age} ago</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default TransactionsPage;
