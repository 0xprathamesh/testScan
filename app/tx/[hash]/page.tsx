"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AiOutlineQuestionCircle } from "react-icons/ai";

interface PageProps {
  params: {
    hash: string;
  };
}

interface TokenTransfer {
  from: string;
  to: string;
  amount: string;
  token: string;
}

interface TxData {
  hash: string;
  status: boolean;
  blockNumber: number;
  timestamp: number;
  confirmations: number;
  from: string;
  to: string;
  value: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  gasUsed: ethers.BigNumber;
  effectiveGasPrice: ethers.BigNumber;
  data: string;
  action: string;
  tokenTransfers: TokenTransfer[];
}

const DetailedTransactionPage: React.FC<PageProps> = ({ params }) => {
  const [txData, setTxData] = useState<TxData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    if (params.hash) {
      fetchTransactionData(params.hash);
    } else {
      setError("No transaction hash provided");
    }
  }, [params.hash]);

  const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const fetchTransactionData = async (hash: string) => {
    try {
      const rpcUrl: string | null = localStorage.getItem("rpcUrl");
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const tx = await provider.getTransaction(hash);
      const receipt = await provider.getTransactionReceipt(hash);
      const block = await provider.getBlock(tx.blockNumber);

      if (tx && receipt && block) {
        const tokenTransfers = parseTokenTransfers(receipt.logs);
        const action = determineTransactionAction(tx, tokenTransfers);

        setTxData({
          hash: tx.hash,
          status: receipt.status === 1,
          blockNumber: tx.blockNumber!,
          timestamp: block.timestamp,
          confirmations: (await provider.getBlockNumber()) - tx.blockNumber!,
          from: tx.from,
          to: tx.to!,
          value: tx.value,
          gasLimit: tx.gasLimit,
          gasUsed: receipt.gasUsed,
          effectiveGasPrice: receipt.effectiveGasPrice,
          data: tx.data,
          action,
          tokenTransfers,
        });
      } else {
        setError("Transaction data not found");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching transaction data");
    }
  };

  const parseTokenTransfers = (
    logs: ethers.providers.Log[]
  ): TokenTransfer[] => {
    const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
    return logs
      .filter((log) => log.topics[0] === transferTopic)
      .map((log) => ({
        from: ethers.utils.getAddress("0x" + log.topics[1].slice(26)),
        to: ethers.utils.getAddress("0x" + log.topics[2].slice(26)),
        amount: ethers.BigNumber.from(log.data).toString(),
        token: log.address,
      }));
  };

  const determineTransactionAction = (
    tx: ethers.providers.TransactionResponse,
    transfers: TokenTransfer[]
  ): string => {
    if (transfers.length > 0) {
      const firstTransfer = transfers[0];
      return `Transfer ${firstTransfer.amount} of token at ${firstTransfer.token} from ${firstTransfer.from} to ${firstTransfer.to}`;
    }
    if (tx.to === null) {
      return "Contract Creation";
    }
    return "Regular Transaction";
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!txData) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white mx-24 px-8 py-4 my-8 border rounded-lg divide-y">
        <div className="pb-3 text-[#3498DA] font-bold text-3xl mb-6">
          Transaction Details
        </div>
        <div className="flex">
          <div className="w-1/2 divide-y">
            <TitleComponent title="Transaction Hash" />
            <TitleComponent title="Status" />
            <TitleComponent title="Block" />
            <TitleComponent title="Timestamp" />
            <TitleComponent title="Transaction Action" />
            <TitleComponent title="From" />
            <TitleComponent title="To" />
            <TitleComponent title="Value" />
            <TitleComponent title="Transaction Fee" />
            <TitleComponent title="Gas Price" />
            <TitleComponent title="Gas Limit & Usage" />
          </div>
          <div className="divide-y w-full">
            <p className="py-6 font-mono break-all">{txData.hash}</p>
            <p
              className={`py-6 ${
                txData.status ? "text-green-500" : "text-red-500"
              }`}
            >
              {txData.status ? "Success" : "Failed"}
            </p>
            <p className="py-6 text-blue-400">
              {txData.blockNumber}{" "}
              <span className="text-gray-400 bg-gray-200 px-2 py-1 rounded-md">
                {txData.confirmations} Block Confirmations
              </span>
            </p>
            <p className="py-6">
              {new Date(txData.timestamp * 1000).toUTCString()}
            </p>
            <p className="pb-2 pt-1 text-sm">{txData.action}</p>
            <p className="py-6 font-mono break-all text-blue-400">
              {txData.from}
            </p>
            <p className="py-6 font-mono break-all text-blue-400">
              {txData.to}
            </p>
            <p className="py-6">{ethers.utils.formatEther(txData.value)} ETH</p>
            <p className="py-6">
              {ethers.utils.formatEther(
                txData.gasUsed.mul(txData.effectiveGasPrice)
              )}{" "}
              ETH
            </p>
            <p className="py-6">
              {ethers.utils.formatUnits(txData.effectiveGasPrice, "gwei")} Gwei
            </p>
            <p className="py-6">
              {txData.gasLimit.toString()} | {txData.gasUsed.toString()} (
              {txData.gasUsed.mul(100).div(txData.gasLimit).toString()}%)
            </p>
          </div>
        </div>
      </div>

      {txData.tokenTransfers.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden w-[85%] mx-auto mb-6">
          <div className="px-8 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold">ERC-20 Tokens Transferred</h2>
          </div>
          <div className="px-8 py-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {txData.tokenTransfers.map((transfer, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transfer.from}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseAddress(transfer.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseAddress(transfer.token)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden w-[85%] mx-auto">
        <div className="px-8 py-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Raw Transaction Data</h2>
        </div>
        <div className="px-8 py-4">
          <button
            className="text-blue-500 underline"
            onClick={() => setShowRawData(!showRawData)}
          >
            {showRawData ? "Hide Raw Data" : "Show Raw Data"}
          </button>
          {showRawData && <p className="font-mono break-all">{txData.data}</p>}
        </div>
      </div>
    </div>
  );
};

const TitleComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center">
    <AiOutlineQuestionCircle />
    <p className="ml-2 py-6">{title}</p>
  </div>
);

export default DetailedTransactionPage;
