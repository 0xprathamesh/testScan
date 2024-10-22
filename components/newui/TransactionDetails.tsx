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
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Tooltip } from "react-tooltip";
import { getCoinData } from "./utils/coingeko";

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
  const tabs = ["Overview", "Internal Transactions", "JSON", "State"];

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div>
          <div className="flex items-center">
            <Link href="/newui">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Link>
            <span className="text-md font-semibold">User Details •</span>
          </div>
          <div>
            <Link href="/newui" className="text-blue text-sm">
              Home •
            </Link>

            <span className="text-sm font-light ml-2">
              {txData?.hash.slice(0, 6)}...{txData?.hash.slice(-4)}
            </span>
          </div>
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

            {showTabs && activeTab === "JSON" && <JSONTab txData={txData} />}
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
  const [coinData, setCoinData] = useState<any>(null);
  useEffect(() => {
    const data = async () => {
      try {
        const data = await getCoinData();
        setCoinData(data);
      } catch (err) {
        console.log(err);
        return null;
      }
    };
    data();
  }, []);
  const tokenPrice = coinData?.market_data?.current_price?.usd
    ? parseFloat(coinData.market_data.current_price.usd.toFixed(6))
    : 0;

  const value = parseFloat(ethers.utils.formatEther(txData?.value));
  const gasFeetoUSD = parseFloat(ethers.utils.formatEther(txData?.gasUsed))
  const usdHelpergas = (gasFeetoUSD * tokenPrice).toFixed(2);
  const usdHelper = (value * tokenPrice).toFixed(2);
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
        <h3 className="text-lg font-inter mb-2">Transaction Value</h3>
        <div className="flex items-center bg-gray-100 p-3 rounded">
          <span className="font-semibold text-lg font-chivo">
            {ethers.utils.formatEther(txData.value)} XDC (${usdHelper})
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border-gray-200 border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-inter">From</h3>
          <div className="flex items-center">
            <Link
              href={`/newui/address/${txData.from}`}
              className="text-gray-600 mr-2 text-sm leading"
            >
              {shortenAddress(txData.from)}
            </Link>
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
            <Link
              href={`/newui/address/${txData.to}`}
              className="text-gray-600 mr-2 text-sm leading"
            >
              {txData.to ? shortenAddress(txData.to) : "Contract Creation"}
            </Link>
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
        <h3 className="text-lg font-inter mb-2">Transaction Fee</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-chivo font-semibold">
            {formatGasFee(txData.gasUsed, txData.effectiveGasPrice)} XDC (${usdHelpergas})
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

const JSONTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="h-[500px] overflow-auto">
        <SyntaxHighlighter
          language="json"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            textWrap: "wrap",
          }}
        >
          {JSON.stringify(txData, null, 2)}
        </SyntaxHighlighter>
      </div>
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
  useEffect(() => {
    if (txData) {
      fetchAction();
    }
  }, [txData]);
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
      const action = response.tx_types.length > 0 ? response.tx_types : "Send";
      console.log(action);
      setMethod(action);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black rounded-3xl text-white w-[45%] h-[600px]">
      <div className="rounded-t-3xl bg-[#16a24b] py-4 px-4">
        <div className="rounded-full h-20 w-20 border-8 border-[#baf7d0] items-center">
          <ArrowUpRight className="h-16 w-16 font-bold text-[#baf7d0]" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Dynamically update the label for the transaction type */}
            <h2 className="text-2xl font-semibold capitalize font-chivo">
              {method}
            </h2>
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
              <span className="mr-2 text-sm ">Located in</span>
              <HelpCircle
                className="h-4 w-4"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Block Number "
                data-tooltip-place="top"
              />
              <Tooltip id="my-tooltip" />
            </div>
            <Link href={`/newui/block/${txData.blockNumber}`}>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border-gray-400 border leading">
                {txData.blockNumber}
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm">From</span>
              <HelpCircle
                className="h-4 w-4"
                data-tooltip-id="sender-tooltip"
                data-tooltip-content="Sender "
                data-tooltip-place="bottom"
              />
              <Tooltip id="sender-tooltip" />
            </div>
            <Link href={`/newui/address/${txData.from}`}>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md text-sm border border-gray-400 leading">
                {shortenHash(txData.from)}
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-sm">To</span>
              <HelpCircle
                className="h-4 w-4"
                data-tooltip-id="reciever-tooltip"
                data-tooltip-content="Reciever "
                data-tooltip-place="bottom"
              />
              <Tooltip id="reciever-tooltip" />
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
              Value: {ethers.utils.formatEther(txData.value)} XDC
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
            <Copy
              className="h-4 w-4"
              onClick={() => navigator.clipboard.writeText(txData.hash)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
