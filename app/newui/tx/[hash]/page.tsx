"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "@/components/newui/Layout";
import TransactionDetails from "@/components/newui/TransactionDetails";

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

const Transaction: React.FC<PageProps> = ({ params }) => {
  const [txData, setTxData] = useState<TxData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.hash) {
      fetchTransactionData(params.hash);
    } else {
      setError("No Transaction Hash Provided");
    }
  }, [params.hash]);

  const fetchTransactionData = async (hash: string) => {
    try {
      const rpcUrl =
        "https://erpc.xinfin.network/";
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const tx = await provider.getTransaction(hash);
      const receipt = await provider.getTransactionReceipt(hash);
      const block = tx.blockNumber !== undefined
      ? await provider.getBlock(tx.blockNumber)
      : null;
    

      const txData: TxData = {
        hash: tx.hash,
        status: receipt.status === 1,
        blockNumber: tx.blockNumber !== undefined ? tx.blockNumber : 4344556,
        timestamp:block ? block.timestamp : 4345666,
        confirmations: tx.confirmations,
        from: tx.from,
        to: tx.to || '',
        value: tx.value,
        gasLimit: tx.gasLimit,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: receipt.effectiveGasPrice,
        data: tx.data,
        action: tx.to ? "Send" : "Contract Deployment",
        tokenTransfers: [], // You would need to implement token transfer parsing here
      };

      setTxData(txData);
    } catch (err) {
      setError("Error fetching transaction data");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <TransactionDetails txData={txData} />
        )}
      </div>
    </Layout>
  );
};

export default Transaction;
