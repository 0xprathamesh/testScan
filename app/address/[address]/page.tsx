"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface AddressDetailsProps {
  params: {
    address: string;
  };
}

interface ExternalTransaction {
  hash: string;
  blockNum: string;
  metadata: {
    blockTimestamp: string;
  };
  from: string;
  to: string;
  value: string;
  asset: string;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ params }) => {
  const { address } = params;
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [externalTxs, setExternalTxs] = useState<ExternalTransaction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rpcUrl = localStorage.getItem("rpcUrl") || "";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance).toString());

        const history = await provider.getHistory(address);
        const externalTransfers = history.filter(
          (tx) => tx.to && tx.to.toLowerCase() === address.toLowerCase()
        );

        const transfersWithMetadata = await Promise.all(
          externalTransfers.map(async (tx) => {
            const block = await provider.getBlock(tx.blockNumber);
            return {
              hash: tx.hash,
              blockNum: tx.blockNumber.toString(),
              metadata: {
                blockTimestamp: new Date(block.timestamp * 1000).toISOString(),
              },
              from: tx.from,
              to: tx.to!,
              value: ethers.utils.formatEther(tx.value),
              asset: "ETH",
            };
          })
        );

        setExternalTxs(transfersWithMetadata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, [address]);

  return loading ? (
    <h1 className="text-center">Loading...</h1>
  ) : (
    <div>
      <div className="bg-white mx-24 px-8 py-4 my-8 border rounded-lg divide-y">
        <h1 className="font-bold">
          Balance{" "}
          <span className="ml-4 font-normal">{balance} Ether</span>
        </h1>
      </div>
      <div className="bg-white mx-24 px-8 py-4 my-8 border rounded-lg divide-y">
        <div className="flex py-1 bg-sky-50">
          <h1 className="w-2/12">Txn Hash</h1>
          <h1 className="w-1/12">Block</h1>
          <h1 className="w-3/12">Age</h1>
          <h1 className="w-2/12">From</h1>
          <h1 className="w-2/12">To</h1>
          <h1 className="w-3/12">Value</h1>
        </div>
        {externalTxs.length <= 0 ? (
          <p className="py-4">No external transactions found.</p>
        ) : (
          externalTxs.map((tx, index) => (
            <div key={index} className="flex py-4">
              <p className="w-2/12 text-[#357BAD]">
                {tx.hash.slice(0, 16)}...
              </p>
              <p className="w-1/12">{tx.blockNum}</p>
              <p className="w-3/12">{tx.metadata.blockTimestamp}</p>
              <p className="w-2/12">{tx.from.slice(0, 16)}...</p>
              <p className="w-2/12 text-[#357BAD]">
                {tx.to.slice(0, 16)}...
              </p>
              <p className="w-3/12">
                {tx.value} {tx.asset}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressDetails;
