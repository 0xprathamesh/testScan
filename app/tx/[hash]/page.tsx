"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Navbar from "@/components/Devnav";
import Link from "next/link";
import Loading from "@/components/elements/Loading";

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
  if (!txData) return <div className="h-40 m-auto text-blue"><Loading /></div>;

  return (
    <>
      <Navbar />
      <section className="mt-16">
        <div className="px-10 py-4 mt-8 text-md font-chivo text-gray-900 w-full bg-[#f9f8fa] border-b">
          Blockchain &gt; Transaction &gt;
          <span className="text-gray-500 text-md ml-1">
            #{txData.hash.slice(0, 10)}...
          </span>
        </div>
        <div className="px-10 py-4  w-full border-b text-gray-500">
          <nav className="flex items-center justify-start gap-8">
            <Link href={`/transaction/${params.hash}`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm">
                Overview
              </p>
            </Link>
            <Link href={`/transaction/${params.hash}/details`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm">
                Details
              </p>
            </Link>
          </nav>
        </div>

        <div className="bg-white px-8 py-4 rounded-lg divide-y">
          <div className="grid grid-cols-2 gap-4">
            <TitleComponent title="Transaction Hash" />
            <p className="py-6 font-mono break-all">{txData.hash}</p>

            <TitleComponent title="Status" />
            <p className={`py-6 ${txData.status ? "text-green-500" : "text-red-500"}`}>
              {txData.status ? "Success" : "Failed"}
            </p>

            <TitleComponent title="Block" />
            <p className="py-6 text-blue-400">
              {txData.blockNumber}{" "}
              <span className="text-gray-400 bg-gray-200 px-2 py-1 rounded-md">
                {txData.confirmations} Block Confirmations
              </span>
            </p>

            <TitleComponent title="Timestamp" />
            <p className="py-6">
              {new Date(txData.timestamp * 1000).toUTCString()}
            </p>

            <TitleComponent title="From" />
            <p className="py-6 font-mono break-all text-blue-400">
              {txData.from}
            </p>

            <TitleComponent title="To" />
            <p className="py-6 font-mono break-all text-blue-400">
              {txData.to}
            </p>

            <TitleComponent title="Value" />
            <p className="py-6">
              {ethers.utils.formatEther(txData.value)} ETH
            </p>

            <TitleComponent title="Transaction Fee" />
            <p className="py-6">
              {ethers.utils.formatEther(
                txData.gasUsed.mul(txData.effectiveGasPrice)
              )}{" "}
              ETH
            </p>

            <TitleComponent title="Gas Price" />
            <p className="py-6">
              {ethers.utils.formatUnits(txData.effectiveGasPrice, "gwei")} Gwei
            </p>

            <TitleComponent title="Gas Limit & Usage" />
            <p className="py-6">
              {txData.gasLimit.toString()} | {txData.gasUsed.toString()} (
              {txData.gasUsed.mul(100).div(txData.gasLimit).toString()}%)
            </p>
          </div>
        </div>

        {txData.tokenTransfers.length > 0 && (
          <div className="bg-white px-8 py-4 rounded-lg mt-8">
            <div className="text-md font-chivo text-gray-900 mb-2">
              ERC-20 Tokens Transferred
            </div>
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
                      {parseAddress(transfer.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parseAddress(transfer.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ethers.utils.formatEther(transfer.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parseAddress(transfer.token)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white px-8 py-4 rounded-lg mt-8">
          <div className="flex items-center justify-between">
            <div className="text-md font-chivo text-gray-900">
              Raw Transaction Data
            </div>
            <AiOutlineQuestionCircle
              className="cursor-pointer text-gray-500"
              onClick={() => setShowRawData(!showRawData)}
            />
          </div>
          {showRawData && (
            <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(txData, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </>
  );
};

interface TitleComponentProps {
  title: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ title }) => {
  return <h4 className="py-6 font-semibold text-gray-900">{title}</h4>;
};

export default DetailedTransactionPage;
