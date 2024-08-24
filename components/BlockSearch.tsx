"use client"
import provider from '@/ethers';
import { useState } from 'react';


const BlockSearch = () => {
  const [blockNumber, setBlockNumber] = useState<string>('');
  const [blockData, setBlockData] = useState<any>(null);

  const fetchBlockData = async () => {
    try {
      const block = await provider.getBlock(Number(blockNumber));
      setBlockData(block);
    } catch (error) {
      console.error('Error fetching block data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        placeholder="Enter block number"
      />
      <button onClick={fetchBlockData}>Search Block</button>

      {blockData && (
        <div>
          <h3>Block #{blockData.number}</h3>
          <p>Timestamp: {new Date(blockData.timestamp * 1000).toLocaleString()}</p>
          <p>Transactions: {blockData.transactions.length}</p>
          <p>Miner: {blockData.miner}</p>
          <p>Gas Used: {blockData.gasUsed.toString()}</p>
          {/* You can add more block details here */}
        </div>
      )}
    </div>
  );
};

export default BlockSearch;
