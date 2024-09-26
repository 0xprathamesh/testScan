"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "@/components/newui/Layout";
import TransactionDetails from "@/components/newui/TransactionDetails";
import Loading from "@/components/elements/Loading";  // Assuming you have a Loading component

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (params.hash) {
      fetchTransactionData(params.hash);
    } else {
      setError("No Transaction Hash Provided");
      setLoading(false);
    }
  }, [params.hash]);

  const fetchTransactionData = async (hash: string) => {
    try {
      const rpcUrl = "https://erpc.xinfin.network/";
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      const tx = await provider.getTransaction(hash);
      const receipt = await provider.getTransactionReceipt(hash);
      const block = tx.blockNumber !== undefined
        ? await provider.getBlock(tx.blockNumber)
        : null;

      if (tx && receipt && block) {
        const tokenTransfers = parseTokenTransfers(receipt.logs);
        const action = determineTransactionAction(tx, tokenTransfers);

        const txData: TxData = {
          hash: tx.hash,
          status: receipt.status === 1,
          blockNumber: tx.blockNumber!,
          timestamp: block.timestamp,
          confirmations: (await provider.getBlockNumber()) - tx.blockNumber!,
          from: tx.from,
          to: tx.to || '',
          value: tx.value,
          gasLimit: tx.gasLimit,
          gasUsed: receipt.gasUsed,
          effectiveGasPrice: receipt.effectiveGasPrice,
          data: tx.data,
          action,
          tokenTransfers,
        };

        setTxData(txData);
        setError(null);
      } else {
        setError("Transaction data not found");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching transaction data");
    } finally {
      setLoading(false);
    }
  };

  const parseTokenTransfers = (logs: ethers.providers.Log[]): TokenTransfer[] => {
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

  const determineTransactionAction = (tx: ethers.providers.TransactionResponse, transfers: TokenTransfer[]): string => {
    if (transfers.length > 0) {
      const firstTransfer = transfers[0];
      return `Transfer ${firstTransfer.amount} of token at ${firstTransfer.token} from ${firstTransfer.from} to ${firstTransfer.to}`;
    }
    if (tx.to === null) {
      return "Contract Creation";
    }
    return "Regular Transaction";
  };

  if (loading) {
    return <div className="h-40 m-auto text-blue"><Loading /></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <div className="">
        {txData ? <TransactionDetails txData={txData} /> : <div>No transaction data available</div>}
      </div>
    </Layout>
  );
};

export default Transaction;





// "use client";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import Layout from "@/components/newui/Layout";
// import TransactionDetails from "@/components/newui/TransactionDetails";

// interface PageProps {
//   params: {
//     hash: string;
//   };
// }

// interface TokenTransfer {
//   from: string;
//   to: string;
//   amount: string;
//   token: string;
// }

// interface TxData {
//   hash: string;
//   status: boolean;
//   blockNumber: number;
//   timestamp: number;
//   confirmations: number;
//   from: string;
//   to: string;
//   value: ethers.BigNumber;
//   gasLimit: ethers.BigNumber;
//   gasUsed: ethers.BigNumber;
//   effectiveGasPrice: ethers.BigNumber;
//   data: string;
//   action: string;
//   tokenTransfers: TokenTransfer[];
// }

// const Transaction: React.FC<PageProps> = ({ params }) => {
//   const [txData, setTxData] = useState<TxData | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (params.hash) {
//       fetchTransactionData(params.hash);
//     } else {
//       setError("No Transaction Hash Provided");
//     }
//   }, [params.hash]);

//   const fetchTransactionData = async (hash: string) => {
//     try {
//       const rpcUrl =
//         "https://erpc.xinfin.network/";
//       const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

//       const tx = await provider.getTransaction(hash);
//       const receipt = await provider.getTransactionReceipt(hash);
//       const block = tx.blockNumber !== undefined
//       ? await provider.getBlock(tx.blockNumber)
//       : null;
//       const tokenTransfers = parseTokenTransfers(receipt.logs);

//       const txData: TxData = {
//         hash: tx.hash,
//         status: receipt.status === 1,
//         blockNumber: tx.blockNumber !== undefined ? tx.blockNumber : 4344556,
//         timestamp:block ? block.timestamp : 4345666,
//         confirmations: tx.confirmations,
//         from: tx.from,
//         to: tx.to || '',
//         value: tx.value,
//         gasLimit: tx.gasLimit,
//         gasUsed: receipt.gasUsed,
//         effectiveGasPrice: receipt.effectiveGasPrice,
//         data: tx.data,
//         action: tx.to ? "Send" : "Contract Deployment",
//         tokenTransfers: tokenTransfers, 
//       };

//       setTxData(txData);
//     } catch (err) {
//       setError("Error fetching transaction data");
//       console.error(err);
//     }
//   };
//   const parseTokenTransfers = (
//     logs: ethers.providers.Log[]
//   ): TokenTransfer[] => {
//     const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
//     return logs
//       .filter((log) => log.topics[0] === transferTopic)
//       .map((log) => ({
//         from: ethers.utils.getAddress("0x" + log.topics[1].slice(26)),
//         to: ethers.utils.getAddress("0x" + log.topics[2].slice(26)),
//         amount: ethers.BigNumber.from(log.data).toString(),
//         token: log.address,
//       }));
//   };

//   return (
//     <Layout>
//       <div className="">
//         {error ? (
//           <div className="text-red-500">{error}</div>
//         ) : (
//           <TransactionDetails txData={txData} />
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Transaction;
