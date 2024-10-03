import React, { useEffect, useState } from "react";
import {
  ArrowBigDown,
  ArrowLeft,
  ArrowUpRight,
  Copy,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "../elements/Loading";
import { ethers } from "ethers";
import { FaCode } from "react-icons/fa";
import { LuCode2 } from "react-icons/lu";
import { transactionService } from "./utils/apiroutes";

interface TxData {
  hash: string;
  status: boolean;
  blockNumber: number;
  timestamp: number;
  confirmations: number;
  from: string;
  to: string;
  value: any;
  gasLimit: any;
  gasUsed: any;
  effectiveGasPrice: any;
  data: string;
  action: string;
  tokenTransfers: TokenTransfer[];
}

interface TokenTransfer {
  from: string;
  to: string;
  amount: string;
  token: string;
}

interface HashProps {
  hash: string;
}
interface TransactionDetailsProps {
  txData: TxData | null;
}

const parseAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};
const TransactionDetails: React.FC<TransactionDetailsProps> = ({ txData }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showTabs, setShowTabs] = useState(false);
  const router = useRouter();
  const tabs = [
    "Overview",
    "Internal Transactions",
    "Logs",
    "State",
    "Raw Trace",
  ];

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="mr-4" onClick={() => router.push("/newui")}>
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div>
          <div className="text-sm text-blue">
            Transaction Details •{" "}
            <span className="text-sm font-light ml-2">
              {txData?.hash.slice(0, 6)}...{txData?.hash.slice(-4)}
            </span>
          </div>
          <h1 className=" font-light">Home</h1>
        </div>
        {/* Toggle button */}

        <button
          className="ml-auto bg-indigo-100 text-indigo-700 p-2 rounded flex items-center "
          onClick={() => setShowTabs(!showTabs)}
        >
          <LuCode2 className="h-6 w-6 font-light mr-1" />
          {!showTabs ? "Enable Dev Mode" : "Disable Dev Mode"}
        </button>
      </div>

      <div className="flex space-x-6">
        <TransactionDetailsCard txData={txData} />

        <div className="w-1/2">
          {showTabs && (
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2  ${
                    activeTab === tab
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="text-sm font-chivo">{tab}</span>
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 text-sm ">
            {activeTab === "Overview" && (
              <>
                <OverviewTab txData={txData} />
              </>
            )}
            {showTabs && activeTab === "Internal Transactions" && (
              <InternalTransactionsTab txData={txData} />
            )}

            {showTabs && activeTab === "Logs" && <LogsTab txData={txData} />}
            {showTabs && activeTab === "State" && <StateTab txData={txData} />}
            {showTabs && activeTab === "Raw Trace" && (
              <RawTraceTab txData={txData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;

const OverviewTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;

  const formatGasFee = (gasUsed: any, gasPrice: any) => {
    // Calculate the total gas fee in Wei
    const feeInWei = Number(gasUsed) * Number(gasPrice);
    
    // Convert Wei to Ether (divide by 10^18)
    const feeInEther = feeInWei / 10 ** 18;
    
    // Return the result as a string, formatted to 6 decimal places for readability
    return feeInEther.toFixed(6);
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-3xl border border-gray-200">
        <h3 className="text-lg font-light mb-2">Transaction Value</h3>
        <div className="flex items-center bg-gray-100 p-3 rounded">
          <span className="font-bold text-lg">
            {ethers.utils.formatEther(txData.value)} ETH
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border-gray-200 border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-inter">From</h3>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2 text-sm leading">
              {shortenAddress(txData.from)}
            </span>
            <Copy
              className="h-4 w-4 ml-2 cursor-pointer text-gray-400"
              onClick={() => navigator.clipboard.writeText(txData.from)}
            />
          </div>
        </div>

        <div className=" flex items-center justify-between ml-60 text-gray-500">
          <ArrowBigDown />
        </div>

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-inter">To</h3>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2 text-sm leading">
              {txData.to ? shortenAddress(txData.to) : "Contract Creation"}
            </span>
            {txData.to && (
              <Copy
                className="h-4 w-4 ml-2 cursor-pointer text-gray-400"
                onClick={() => navigator.clipboard.writeText(txData.to)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border-gray-200 border">
        <h3 className="text-lg font-semibold mb-2">Transaction Fee</h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            {formatGasFee(txData.gasUsed, txData.effectiveGasPrice)} XDC
          </span>
          <span className="text-gray-500">
            {txData.gasUsed.toString()} Gas Used
          </span>
        </div>
      </div>
    </div>
  );
};

const InternalTransactionsTab: React.FC<TransactionDetailsProps> = ({
  txData,
}) => {
  if (!txData) return null;
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Internal Transactions</h3>
      <p>No internal transactions for this transaction.</p>
    </div>
  );
};

const LogsTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Transaction Logs</h3>
      <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
        {JSON.stringify(txData, null, 2)}
      </pre>
    </div>
  );
};

const StateTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-semibold mb-2">State Changes</h3>
      <p>State change information is not available.</p>
    </div>
  );
};

const RawTraceTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Raw Transaction Trace</h3>
      <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
        {JSON.stringify(txData, null, 2)}
      </pre>
    </div>
  );
};

const TransactionDetailsCard: React.FC<TransactionDetailsProps> = ({
  txData,
}) => {
  const [method, setMethod] = useState<string>();
  if (!txData)
    return (
      <div className="w-[45%] text-center text-blue">
        <Loading />
      </div>
    );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const shortenHash = (hash: string) =>
    `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  const fetchAction = async () => {
    try {
      const response = await transactionService.getTransaction(txData.hash);
      const action = response.tx_types;

      setMethod(action);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAction();
  });

  return (
    <div className="bg-black rounded-3xl text-white w-[45%] h-[600px]">
      <div className="rounded-t-3xl bg-green-500 py-2 px-4">
        <div className="rounded-full h-20 w-20 border-8 border-[#baf7d0] items-center">
          <ArrowUpRight className="h-16 w-16 font-bold text-[#baf7d0]" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Dynamically update the label for the transaction type */}
            <h2 className="text-2xl font-bold">{method}</h2>
          </div>
          <span
            className={`px-3 py-1 rounded-md text-sm ${
              txData.status ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {txData.status ? "Success" : "Failed"}
          </span>
        </div>

        <div className="mb-6 text-sm bg-black font-light">
          <span className="mr-2 text-gray-300">
            {formatDate(txData.timestamp)}
          </span>
          •
          <span className="ml-2 text-gray-500 font-light leading-10">
            Confirmed in {txData.confirmations} block
            {txData.confirmations !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">Located in</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <Link href={`/newui/block/${txData.blockNumber}`}>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
                {txData.blockNumber}
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">From</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <Link href={`/newui/address/${txData.from}`}>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border border-gray-400 leading">
                {shortenHash(txData.from)}
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">To</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <Link href={`/newui/address/${txData.to}`}>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
                {txData.to ? shortenHash(txData.to) : "Contract Creation"}
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm mb-2">Tags</span>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Value: {txData.value.toString()} XDC
            </span>
            <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Gas Used: {txData.gasUsed.toString()}
            </span>
          </div>
        </div>

        <div className="mt-6 bg-gray-500 bg-opacity-20 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span>Transaction Hash</span>
            <HelpCircle className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <Link href={`/newui/tx/${txData.hash}`}>
              <span className="text-sm font-inter leading">
                {shortenHash(txData.hash)}
              </span>
            </Link>
            <Copy className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

