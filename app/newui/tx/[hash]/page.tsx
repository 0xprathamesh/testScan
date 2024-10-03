// "use client";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import Layout from "@/components/newui/Layout";
// import TransactionDetails from "@/components/newui/TransactionDetails";
// import Loading from "@/components/elements/Loading";
// import { transactionService } from "@/components/newui/utils/apiroutes";

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
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (params.hash) {
//       fetchTransactionData(params.hash);
//     } else {
//       setError("No Transaction Hash Provided");
//       setLoading(false);
//     }
//   }, [params.hash]);

//   const fetchTransactionData = async (hash: string) => {
//     try {
//       const rpcUrl = "https://erpc.xinfin.network/";
//       const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

//       const tx = await provider.getTransaction(hash);
//       const receipt = await provider.getTransactionReceipt(hash);
//       const block = tx.blockNumber !== undefined
//         ? await provider.getBlock(tx.blockNumber)
//         : null;

//       if (tx && receipt && block) {
//         const tokenTransfers = parseTokenTransfers(receipt.logs);
//         const action = determineTransactionAction(tx, tokenTransfers);

//         const txData: TxData = {
//           hash: tx.hash,
//           status: receipt.status === 1,
//           blockNumber: tx.blockNumber!,
//           timestamp: block.timestamp,
//           confirmations: (await provider.getBlockNumber()) - tx.blockNumber!,
//           from: tx.from,
//           to: tx.to || '',
//           value: tx.value,
//           gasLimit: tx.gasLimit,
//           gasUsed: receipt.gasUsed,
//           effectiveGasPrice: receipt.effectiveGasPrice,
//           data: tx.data,
//           action,
//           tokenTransfers,
//         };

//         setTxData(txData);
//         setError(null);
//       } else {
//         setError("Transaction data not found");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while fetching transaction data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseTokenTransfers = (logs: ethers.providers.Log[]): TokenTransfer[] => {
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

//   const determineTransactionAction = (tx: ethers.providers.TransactionResponse, transfers: TokenTransfer[]): string => {
//     if (transfers.length > 0) {
//       const firstTransfer = transfers[0];
//       return `Transfer ${firstTransfer.amount} of token at ${firstTransfer.token} from ${firstTransfer.from} to ${firstTransfer.to}`;
//     }
//     if (tx.to === null) {
//       return "Contract Creation";
//     }
//     return "Regular Transaction";
//   };

//   if (loading) {
//     return <div className="h-40 m-auto text-blue"><Loading /></div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <Layout>
//       <div className="">
//         {txData ? <TransactionDetails txData={txData} /> : <div>No transaction data available</div>}
//       </div>
//       <TransactionData hash={params.hash} />
//     </Layout>
//   );
// };

// export default Transaction;
"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "@/components/newui/Layout";
import TransactionDetails from "@/components/newui/TransactionDetails";
import Loading from "@/components/elements/Loading";
import { transactionService } from "@/components/newui/utils/apiroutes";
import { parseAddress } from "@/lib/helpers";
import TokenTransfers from "@/components/TokenTransfers";
import Link from "next/link";
import { FiArrowRight, FiCopy } from "react-icons/fi";

interface PageProps {
  params: {
    hash: string;
  };
}

interface TokenTransfer {
  tokenName?: string;
  symbol?: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  icon?: string;
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

  // const fetchTransactionData = async (hash: string) => {
  //   const fetchFromApi = process.env.NEXT_PUBLIC_FETCH_API === "true";

  //   if (fetchFromApi) {
  //     try {
  //       const dataResponse = await transactionService.getTransaction(hash);
  //       const txData: TxData = {
  //         hash: dataResponse.hash,
  //         status: dataResponse.status === "ok",
  //         blockNumber: dataResponse.block_number,
  //         timestamp: dataResponse.timestamp,
  //         confirmations: dataResponse.confirmations,
  //         from: dataResponse.from?.hash || "",
  //         to: dataResponse.to?.hash || "",
  //         value: ethers.BigNumber.from(dataResponse.value),
  //         gasLimit: ethers.BigNumber.from(dataResponse.gas_limit),
  //         gasUsed: ethers.BigNumber.from(dataResponse.gas_used),
  //         effectiveGasPrice: ethers.BigNumber.from(dataResponse.gas_price),
  //         data: dataResponse.input,
  //         action: dataResponse.tx_types,
  //         tokenTransfers: dataResponse.token_transfers.map((transfer: any) => ({
  //           from: transfer.from,
  //           to: transfer.to,
  //           amount: transfer.amount,
  //           token: transfer.token,
  //         })),
  //       };
  //       setTxData(txData);
  //       setLoading(false);
  //       setError(null);
  //     } catch (err) {
  //       console.error("Error fetching transaction data from API:", err);
  //       setError("An error occurred while fetching transaction data from API");
  //       setLoading(false);
  //     }
  //   } else {
  //     try {
  //       const rpcUrl = "https://erpc.xinfin.network/";
  //       const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  //       const tx = await provider.getTransaction(hash);
  //       const receipt = await provider.getTransactionReceipt(hash);
  //       const block =
  //         tx.blockNumber !== undefined
  //           ? await provider.getBlock(tx.blockNumber)
  //           : null;

  //       if (tx && receipt && block) {
  //         const tokenTransfers = parseTokenTransfers(receipt.logs);
  //         const action = determineTransactionAction(tx, tokenTransfers);

  //         const txData: TxData = {
  //           hash: tx.hash,
  //           status: receipt.status === 1,
  //           blockNumber: tx.blockNumber!,
  //           timestamp: block.timestamp,
  //           confirmations: (await provider.getBlockNumber()) - tx.blockNumber!,
  //           from: tx.from,
  //           to: tx.to || "",
  //           value: tx.value,
  //           gasLimit: tx.gasLimit,
  //           gasUsed: receipt.gasUsed,
  //           effectiveGasPrice: receipt.effectiveGasPrice,
  //           data: tx.data,
  //           action,
  //           tokenTransfers,
  //         };

  //         setTxData(txData);
  //         setLoading(false)
  //         setError(null);
  //       } else {
  //         setError("Transaction data not found");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setError("An error occurred while fetching transaction data from RPC");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
  const fetchTransactionData = async (hash: string) => {
    const fetchFromApi = process.env.NEXT_PUBLIC_FETCH_API === "true";

    if (fetchFromApi) {
      try {
        const dataResponse = await transactionService.getTransaction(hash);
        console.log(dataResponse.timestamp);

        const txData: TxData = {
          hash: dataResponse.hash,
          status: dataResponse.status === "ok" ? true : false,
          blockNumber: dataResponse.block_number,
          timestamp: Math.floor(
            new Date(dataResponse.timestamp).getTime() / 1000
          ),
          confirmations: dataResponse.confirmations,
          from: dataResponse.from?.hash || "",
          to: dataResponse.to?.hash || "",
          value: ethers.BigNumber.from(dataResponse.value || "0"), // Add default value here
          gasLimit: ethers.BigNumber.from(dataResponse.gas_limit || "0"), // Add default value here
          gasUsed: ethers.BigNumber.from(dataResponse.gas_used || "0"), // Add default value here
          effectiveGasPrice: ethers.BigNumber.from(
            dataResponse.gas_price || "0"
          ), // Add default value here
          data: dataResponse.input,
          action: dataResponse.tx_types,
          tokenTransfers: dataResponse.token_transfers.map((transfer: any) => ({
            from: transfer.from,
            to: transfer.to,
            amount: transfer.amount,
            token: transfer.token,
          
          })),
        };
        setTxData(txData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching transaction data from API:", err);
        setError("An error occurred while fetching transaction data from API");
        setLoading(false);
      }
    } else {
      try {
        const rpcUrl = "https://erpc.xinfin.network/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const tx = await provider.getTransaction(hash);
        const receipt = await provider.getTransactionReceipt(hash);
        const block =
          tx.blockNumber !== undefined
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
            to: tx.to || "",
            value: tx.value,
            gasLimit: tx.gasLimit,
            gasUsed: receipt.gasUsed,
            effectiveGasPrice: receipt.effectiveGasPrice,
            data: tx.data,
            action,
            tokenTransfers,
          };

          setTxData(txData);
          setLoading(false);
          setError(null);
        } else {
          setError("Transaction data not found");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching transaction data from RPC");
      } finally {
        setLoading(false);
      }
    }
  };

  const parseTokenTransfers = (
    logs: ethers.providers.Log[]
  ): TokenTransfer[] => {
    const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
    return logs
      .filter((log) => log.topics[0] === transferTopic)
      .map((log) => ({
        tokenName: "W",
        symbol:"He",
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

  useEffect(() => {
    if (params.hash) {
      fetchTransactionData(params.hash);
    } else {
      setError("No Transaction Hash Provided");
      setLoading(false);
    }
  }, [params.hash]);

  if (loading) {
    return (
      <Layout>
        <div className="h-40 m-auto text-blue">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <div className="">
        {txData ? (
          <TransactionDetails txData={txData} />
        ) : (
          <div>No transaction data available</div>
        )}
      </div>
      <TokenTransfer hash={params.hash} />

      {/* <TransactionData hash={params.hash} /> */}
    </Layout>
  );
};

export default Transaction;

interface TransactionProps {
  hash: string;
}
// const TransactionData = ({ hash }: TransactionProps) => {
// const [transactionDatas, setTransactionDatas] = useState<TransactionData | null>(null)
//   const [tx, setTx] = useState<Transaction | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTransaction = async () => {
//       try {
//         const response = await transactionService.getTransaction(hash);
//         console.log("Transaction Response ===>", response.hash);
//         setTx({
//           hash: response.hash,
//           block: response.block_number,
//           from: response.from?.hash,
//           to: response.to?.hash,
//           value: parseInt(response.value),
//           fee: parseInt(response.fee.value),
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching transactions:", err);
//         setError("Error fetching transactions");
//         setLoading(false);
//       }
//     };
//     fetchTransaction();
//     fetchTransactionDatas();
//   }, [hash]);

//   const fetchTransactionDatas = async () => {
//     try {
//       const dataResponse = await transactionService.getTransaction(hash);
//       console.log("Transaction Data =====>", dataResponse.token_transfers);
//       const data: TransactionData = {
//         hash: dataResponse.hash,
//         status: dataResponse.status === "ok" ? true : false,
//         blocknumber: dataResponse.block_number,
//         timestamp: dataResponse.timestamp,
//         confirmations: dataResponse.confirmations,
//         from: dataResponse.from?.hash,
//         to: dataResponse.to?.hash,
//         value: dataResponse.value,
//         gasLimit: dataResponse.gas_limit,
//         gasUsed: dataResponse.gas_used,
//         effectiveGasPrice: dataResponse.gas_price,
//         data: dataResponse.input,
//         action: dataResponse.tx_types,
//         tokenTransfers:dataResponse.token_transfers
//       }
//       console.log(data);
//       setTransactionDatas(data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//       setError("Error fetching transactions");
//       setLoading(false);
//     }
//   }
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (!tx) return <div>No transaction data found</div>;
//   return (
//     <div>
//       <h3>Transaction Details</h3>
//       <p><strong>Hash:</strong> {tx.hash}</p>
//       <p><strong>From:</strong> {tx.from}</p>
//       <p><strong>To:</strong> {tx.to}</p>
//       <p><strong>Block Number:</strong> {tx.block}</p>
//       <p><strong>Value:</strong> {tx.value} Wei</p>
//       <p><strong>Fee:</strong> {tx.fee} Wei</p>
//     </div>
//   );
// };

const TokenTransfer = ({ hash }: TransactionProps) => {
  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[] | null>(
    []
  );


  useEffect(() => {
    fetchTransfers();

  }, [hash]);

  const fetchTransfers = async () => {
    try {
      const response = await transactionService.getTransaction(hash);

      const data = response.token_transfers.map((item: any) => ({
        from: item.from?.hash || "", 
        to: item.to?.hash || "",
        amount: item.total?.value || "0",
        token: item.token?.address || "", 
        icon: item.token?.icon_url,

      }));

      setTokenTransfers(data); 
    } catch (err) {
      console.error(err);
    }
  };
  const formatTokenAmount = (amount: string, decimals: number) => {
    return (parseInt(amount) / 10 ** decimals).toFixed(4); // Adjust decimal places as needed
  };
  return (
    <div>
      {tokenTransfers && tokenTransfers.length > 0 ? (
        <div className="bg-white px-8 py-4 rounded-lg mt-8">
          <div className="text-md font-chivo text-gray-900 mb-2">
            ERC-20 Tokens Transferred
          </div>
          <div className="space-y-4">
            {tokenTransfers.map((transfer, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium">Token Transfer</p>
                    <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                      <Link href={`/newui/tx/${hash}`}>
                        #{parseAddress(hash)}{" "}
                      </Link>
                      <FiCopy
                        className="ml-2 text-gray-400 cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(hash)}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-x-4">
                  <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                    <Link href={`/newui/address/${transfer.from}`}>
                      {parseAddress(transfer.from)}
                    </Link>
                    <FiCopy
                      className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                      onClick={() =>
                        navigator.clipboard.writeText(transfer.from)
                      }
                    />
                  </div>
                  <FiArrowRight className="h-4 w-4" />
                  <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                    <Link href={`/newui/address/${transfer.to}`}>
                      {parseAddress(transfer.to)}
                    </Link>
                    <FiCopy
                      className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                      onClick={() => navigator.clipboard.writeText(transfer.to)}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {formatTokenAmount(
                      transfer.amount,
                      18
                    )}{" "} XDC
                   
                  </p>
                </div>
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                    <Link href={`/newui/tokens/${transfer.token}`}>
                      {parseAddress(transfer.token)}
                    </Link>
                    <FiCopy
                      className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                      onClick={() =>
                        navigator.clipboard.writeText(transfer.token)
                      }
                    />
                  </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mt-4">
        
        </div>
      )}
    </div>
  );
};
