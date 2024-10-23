"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { IoReceiptOutline, IoCubeOutline } from "react-icons/io5";
import { FiSearch, FiCopy, FiArrowRight } from "react-icons/fi";
import Layout from "@/components/newui/Layout";
import Loading from "@/components/elements/Loading";
import Link from "next/link";
import { Copy } from "lucide-react";
import { getTimeAgo } from "@/lib/helpers";
import {
  addressService,
  transactionService,
} from "@/components/newui/utils/apiroutes";
import { formatUSDValue } from "@/lib/helpers";
import { getCoinData } from "@/components/newui/utils/coingeko";

interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  method: string;
  value: string;
  gasPrice?: string;
  gasLimit?: string;
  gasFee?: number;
  timestamp: string;
}
const currency = process.env.NEXT_PUBLIC_VALUE_SYMBOL;

const TransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
    >([]);
    const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const data = async () => {
     try {
       const data = await getCoinData();
       setCoinData(data)
     } catch (err) {
       console.log(err);
       return null
     }
  }

  useEffect(() => {
    data();
    fetchTransactions();
  }, []);

  const tokenPrice = coinData?.market_data?.current_price?.usd ? parseFloat(coinData.market_data.current_price.usd.toFixed(6)) : 0; // Default to 0 if loading
  const fetchTransactions = async () => {
    try {
      let fetchedTransactions: Transaction[];
      
      if (process.env.NEXT_PUBLIC_FETCH_API === "true") {
        const response = await transactionService.transactions(
          "?limit=50&page=1"
        );
        fetchedTransactions = response.items.map((item: any) => ({
          hash: item.hash,
          blockNumber: item.block_number,
          from: item.from?.hash || "",
          to: item.to?.hash || null,
          method: item.method || "Transfer",
          value: ethers.utils.formatEther(item.value || "0"),
          gasPrice: item.gas_price,
          gasLimit: item.gas_limit,
          gasFee: item.fee?.value
            ? (item.fee?.value / 10 ** 18).toFixed(3)
            : null,
          timestamp:item.timestamp
        }));
      } else {
        const rpcUrl = "https://erpc.xinfin.network/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const latestBlockNumber = await provider.getBlockNumber();
        const block = await provider.getBlockWithTransactions(
          latestBlockNumber
        );
        fetchedTransactions = block.transactions.map((tx) => ({
          hash: tx.hash,
          blockNumber: tx.blockNumber ?? 0,
          from: tx.from,
          to: tx.to || null,
          method: getMethodName(tx),
          value: ethers.utils.formatEther(tx.value || "0"),
          gasPrice: tx.gasPrice?.toString(),
          gasLimit: tx.gasLimit.toString(),
          timestamp:tx.timestamp?.toString() || "",
        }));
      }

      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((tx) => {
        return (
          tx.hash.toLowerCase().includes(query) ||
          (tx.from && tx.from.toLowerCase().includes(query)) ||
          (tx.to && tx.to.toLowerCase().includes(query)) ||
          (tx.blockNumber && tx.blockNumber.toString().includes(query))
        );
      });
      setFilteredTransactions(filtered);
    }
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
          <a href="/newui" className="text-blue-500">
            Home
          </a>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search ID / Address / Transactions"
            value={searchQuery}
            onChange={handleSearch}
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
                  Value {currency}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Txn Fee {currency}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Age
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => {
                const gasFeeInEther =
                  tx.gasPrice && tx.gasLimit
                    ? ethers.utils.formatEther(
                        ethers.BigNumber.from(tx.gasPrice).mul(
                          ethers.BigNumber.from(tx.gasLimit)
                        )
                      )
                    : "N/A";
                    const value = parseFloat(tx.value);
                    const usdHelper = (value * tokenPrice).toFixed(2); // Ensure multiplication is done with numbers
                
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
                        <span className="text-center font-chivo">
                          {tx.method}
                        </span>
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="bg-black px-1 text-center rounded-md text-white flex items-center justify-around ">
                        <IoCubeOutline />
                        <Link href={`/newui/block/${tx.blockNumber}`}>
                          {tx.blockNumber}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                        <Link href={`/newui/address/${tx.from}`}>
                          {truncateAddress(tx.from)}
                        </Link>
                        <Copy
                          className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                          onClick={() => navigator.clipboard.writeText(tx.from)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-500">
                      <FiArrowRight className="h-4 w-4" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue text-sm font-light font-chivo leading flex items-center">
                        {tx.to ? (
                          <Link href={`/newui/address/${tx.to}`}>
                            {truncateAddress(tx.to)}
                          </Link>
                        ) : (
                          "Contract Creation"
                        )}
                        {tx.to && (
                          <Copy
                            className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                            onClick={() =>
                              navigator.clipboard.writeText(tx.to || "")
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                    {value.toFixed(2)} {currency} (${usdHelper})
         
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {/* {typeof gasFeeInEther === "string" ? gasFeeInEther : parseFloat(gasFeeInEther).toFixed(6)} */}
                      {tx.gasFee} {currency}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {getTimeAgo(tx.timestamp)}
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
