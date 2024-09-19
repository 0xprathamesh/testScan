"use client"
import React, { useState } from "react";
import { ArrowLeft, ArrowUpRight, Copy, HelpCircle } from "lucide-react";

interface TxData {
  hash: string;
  status: boolean;
  blockNumber: number;
  timestamp: number;
  confirmations: number;
  from: string;
  to: string;
  value: any; // Using 'any' for BigNumber type
  gasLimit: any;
  gasUsed: any;
  effectiveGasPrice: any;
  data: string;
  action: string;
  tokenTransfers: any[]; // Using 'any[]' for simplicity
}

interface TransactionDetailsProps {
  txData: TxData | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ txData }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Internal Transactions",
    "Logs",
    "State",
    "Raw Trace",
  ];

  return (
    <div className="bg-[#f5f6f8] p-6 font-sans">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <div className="text-sm text-blue-500">Home • {txData?.hash.slice(0, 6)}...{txData?.hash.slice(-4)}</div>
          <h1 className="text-2xl font-bold">Transaction details</h1>
        </div>
        <button className="ml-auto bg-indigo-100 text-indigo-700 p-2 rounded">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4L4 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L20 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex space-x-6">
        <TransactionDetailsCard txData={txData} />

        {/* Right side - Tabs and content */}
        <div className="w-1/2">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {activeTab === "Overview" && <OverviewTab txData={txData} />}
            {activeTab === "Internal Transactions" && <InternalTransactionsTab txData={txData} />}
            {activeTab === "Logs" && <LogsTab txData={txData} />}
            {activeTab === "State" && <StateTab txData={txData} />}
            {activeTab === "Raw Trace" && <RawTraceTab txData={txData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
  if (!txData) return null;
  return (
    <div>
      <div className="mb-4 mt-4 bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Transaction Value</h3>
        <div className="flex items-center">
          <img
            src="/api/placeholder/24/24"
            alt="Token icon"
            className="mr-2 rounded-full"
          />
          <span className="font-bold">{txData.value.toString()} ETH</span>
        </div>
      </div>
      <div className="mb-4 bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">From</h3>
        <div className="flex items-center">
          <span className="bg-red-100 text-red-800 p-1 rounded mr-2">
            {txData.from}
          </span>
          <Copy className="h-4 w-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(txData.from)} />
        </div>
      </div>
      <div className="mb-4 bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">To</h3>
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 p-1 rounded mr-2">
            {txData.to || 'Contract Creation'}
          </span>
          {txData.to && <Copy className="h-4 w-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(txData.to)} />}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">
          Transaction Fee
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{(Number(txData.gasUsed) * Number(txData.effectiveGasPrice)).toString()} Wei</span>
          <span className="text-gray-500">{txData.gasUsed.toString()} Gas Used</span>
        </div>
      </div>
    </div>
  );
};

const InternalTransactionsTab: React.FC<TransactionDetailsProps> = ({ txData }) => {
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

export default TransactionDetails;

// TransactionDetailsCard component remains unchanged

const TransactionDetailsCard: React.FC<TransactionDetailsProps> = ({ txData }) => {
    if (!txData) return <div className="w-[45%]">Loading...</div>;
  
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };
  
    const shortenHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  
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
              <h2 className="text-2xl font-bold">{txData.action}</h2>
            </div>
            <span className={`px-3 py-1 rounded-md text-sm ${txData.status ? 'bg-green-500' : 'bg-red-500'}`}>
              {txData.status ? 'Success' : 'Failed'}
            </span>
          </div>
  
          <div className="mb-6 text-sm bg-black font-light">
            <span className="mr-2 text-gray-300">{formatDate(txData.timestamp)}</span>•
            <span className="ml-2 text-gray-500 font-light leading-10">
              Confirmed in {txData.confirmations} block{txData.confirmations !== 1 ? 's' : ''}
            </span>
          </div>
  
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">Located in</span>
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
                {txData.blockNumber}
              </div>
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">From</span>
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
                {shortenHash(txData.from)}
              </div>
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">To</span>
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
                {txData.to ? shortenHash(txData.to) : 'Contract Creation'}
              </div>
            </div>
          </div>
  
          <div className="mt-6">
            <span className="text-sm mb-2">Tags</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Value: {txData.value.toString()} Wei
              </span>
              <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Gas Used: {txData.gasUsed.toString()}
              </span>
            </div>
          </div>
  
          <div className="mt-6 bg-black bg-opacity-20 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span>Transaction Hash</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{shortenHash(txData.hash)}</span>
              <Copy className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  
  

// const TransactionDetailsCard = () => {
//   return (
//     <div className="bg-black rounded-3xl  text-white w-[45%] h-[600px]">
//       <div className=" rounded-t-3xl bg-green-500 py-2 px-4 ">
//         <div className="rounded-full h-20 w-20 border-8 border-[#baf7d0] items-center ">
//           <ArrowUpRight className="h-16 w-16 font-bold text-[#baf7d0]" />
//         </div>
//       </div>
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4 ">
//           <div className="flex items-center">
//             <h2 className="text-2xl font-bold">Send</h2>
//           </div>
//           <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
//             Success
//           </span>
//         </div>

//         <div className="mb-6 text-sm bg-black font-light">
//           <span className="mr-2 text-gray-300">3 weeks</span>•
//           <span className="mx-2 text-gray-300 ">Aug-27-2024</span>•
//           <span className="ml-2 text-gray-500 font-light leading-10">Confirmed in &lt;= 10s</span>
//         </div>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span className="mr-2">Located in</span>
//               <HelpCircle className="h-4 w-4" />
//             </div>
//             <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md flex items-center">
//               <svg
//                 className="h-4 w-4 mr-2"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <rect
//                   x="3"
//                   y="3"
//                   width="18"
//                   height="18"
//                   rx="2"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
//               </svg>
//               <span>3051499</span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span className="mr-2">Current stage</span>
//               <HelpCircle className="h-4 w-4" />
//             </div>
//             <div className="bg-white bg-opacity-20 px-3 py-1 rounded-md">
//               Confirmed
//             </div>
//           </div>
//         </div>

//         <div className="text-right text-green-200 text-sm mt-2">
//           180205 block confirmations
//         </div>

//         <div className="mt-6">
//           <span className="text-sm mb-2 ">Tags</span>
//           <div className="flex flex-wrap gap-2">
//             <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
//               Nonce: 17
//             </span>
//             <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
//               Transaction type: 2 (EIP-1559)
//             </span>
//             <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
//               Position: 11
//             </span>
//           </div>
//         </div>

//         <div className="mt-6 bg-black bg-opacity-20 p-4 rounded-xl">
//           <div className="flex items-center justify-between mb-2">
//             <span>Transaction ID</span>
//             <HelpCircle className="h-4 w-4" />
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm">0xfac4238b82aef...3d2fb60254d9fd1</span>
//             <Copy className="h-4 w-4" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
