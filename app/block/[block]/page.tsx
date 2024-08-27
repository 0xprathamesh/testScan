"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface PageProps {
  params: {
    block: string;  // Changed to string as URL params are strings
  };
}

const BlockDetails: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<ethers.providers.Block | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.block) {
      const blockNumber = parseInt(params.block, 10);
      if (isNaN(blockNumber)) {
        setError("Invalid block number");
      } else {
        fetchBlockData(blockNumber);
      }
    } else {
      setError("No Block Number Provided");
    }
  }, [params.block]);

  const fetchBlockData = async (blockNumber: number) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe`
      );
      const block = await provider.getBlock(blockNumber);
      if (!block) {
        setError("Block Not Found");
        setBlockData(null);
        return;
      }
      setBlockData(block);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("An Error Occurred while fetching block data");
    }
  };

  return (
    <div>
      <h1>Block Data</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {blockData && (
        <div>
          <p><strong>Block Number:</strong> {blockData.number}</p>
          <p><strong>Hash:</strong> {blockData.hash}</p>
          <p><strong>Timestamp:</strong> {new Date(blockData.timestamp * 1000).toLocaleString()}</p>
          <p><strong>Transactions:</strong> {blockData.transactions.length}</p>
          <p><strong>Gas Used:</strong> {blockData.gasUsed.toString()}</p>
          <p><strong>Gas Limit:</strong> {blockData.gasLimit.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default BlockDetails;