"use client"
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import Navbar from "@/components/Devnav";
import { HiOutlineDuplicate } from "react-icons/hi";
import { FaLongArrowAltRight } from "react-icons/fa";
import Loading from "@/components/elements/Loading";

interface PageProps {
  params: {
    block: string;
  };
}

interface BlockData {
  number: number;
  timestamp: number;
  transactions: ethers.providers.TransactionResponse[];
}

const TransactionsPage: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<BlockData | null>(null);
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
      const rpcUrl = localStorage.getItem("rpcUrl");
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!blockData) return <div className="h-40 m-auto text-blue"><Loading /></div>;

  return (
    <>
      <Navbar />
      <section className="mt-16">
        <div className="px-10 py-4 mt-8 text-md font-chivo text-gray-900 w-full bg-[#f9f8fa] border-b">
          Blockchain &gt; Block &gt; Transactions &gt;
          <span className="text-gray-500 text-md ml-1">
            #{blockData.number}
          </span>
        </div>
        <div className="px-10 py-4  w-full border-b text-gray-500">
          <nav className="flex items-center justify-start gap-8">
            <Link href={`/block/${params.block}`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm">
                Overview
              </p>
            </Link>
            <Link href={`/block/${params.block}/transactions`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm ">
                Transactions
              </p>
            </Link>
          </nav>
        </div>

        <div className="bg-white px-8 py-4 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 ">
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Txn Hash
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Block
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    From
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500"></th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500"></th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    To
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Txn Fee
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody>
                {blockData.transactions.map((tx) => {
                  const method = tx.data === "0x" ? "Transfer" : "Contract Call";
                  const valueInEther = ethers.utils.formatEther(tx.value);
                  const gasFeeInEther = tx.gasPrice && tx.gasLimit ? (
                    ethers.utils.formatEther(
                      tx.gasPrice.mul(tx.gasLimit)
                    )
                  ) : "Gas fee not available";
                  const age = new Date(Date.now() - blockData.timestamp * 1000)
                    .toISOString()
                    .substr(11, 8);

                  return (
                    <tr key={tx.hash} className="border-b ">
                      <td className="px-4 py-2">
                        <Link href={`/transaction/${tx.hash}`}>
                          <p className="text-blue font-chivo text-sm font-light leading ">
                            {parseAddress(tx.hash)}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <p className="inline-flex items-center text-center border px-2 text-sm py-1 rounded-full">
                          <span className="inline-block rounded-full bg-green-500 h-2 w-2 mr-2"></span>
                          <span className="text-center font-chivo">{method}</span>
                        </p>
                      </td>
                      <td className="px-4 py-2 text-sm text-blue font-inter font-light tracking-wide">
                        {blockData.number}
                      </td>
                      <td className="px-4 py-2 flex ">
                        <p className=" text-blue font-chivo text-sm font-light leading hover:bg-orange-200 p-1 px-2 rounded-md  hover:border border-dashed border-orange-500 ">
                          {parseAddress(tx.from)}
                        </p>
                      </td>
                      <td className="">
                        <Copy copyText={tx.from} />
                      </td>
                      <td className="text-green-500 mx-4">
                        <p className="bg-green-100 rounded-full h-4 w-4 flex items-center justify-center">
                          <FaLongArrowAltRight className="h-3 w-3" />
                        </p>
                      </td>
                      <td className=" py-2 ">
                        <p className="  text-blue font-chivo text-sm font-light leading hover:bg-orange-200 p-1 px-2 rounded-md  hover:border border-dashed border-orange-500">
                          {tx.to ? parseAddress(tx.to) : "Contract Creation"}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-sm ">
                        {parseFloat(valueInEther).toFixed(1)} ETH
                      </td>
                      <td className="px-4 py-2 text-[12px] text-gray-400">{parseFloat(gasFeeInEther).toFixed(6)}</td>
                      <td className="px-4 py-2 text-sm font-light">{age} ago</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default TransactionsPage;

interface CopyProps {
  text?: string;
  copyText?: string;
}

const Copy: React.FC<CopyProps> = ({ copyText = "" }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
  };

  return (
    <span onClick={copyToClipboard} className="h-2 w-2 cursor-pointer">
      <HiOutlineDuplicate />
    </span>
  );
};