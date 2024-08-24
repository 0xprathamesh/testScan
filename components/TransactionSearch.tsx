"use client"
import { useState } from 'react';
import { ethers } from 'ethers';
import provider from '@/ethers';

const TransactionSearch = () => {
  const [txHash, setTxHash] = useState<string>('');
  const [txData, setTxData] = useState<any>(null);

  const fetchTransactionData = async () => {
    try {
      const transaction = await provider.getTransaction(txHash);
      setTxData(transaction);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder="Enter transaction hash"
      />
      <button onClick={fetchTransactionData}>Search Transaction</button>

      {txData && (
        <div>
          <h3>Transaction Hash: {txData.hash}</h3>
          <p>Block Number: {txData.blockNumber}</p>
          <p>From: {txData.from}</p>
          <p>To: {txData.to}</p>
          <p>Value: {ethers.utils.formatEther(txData.value)} ETH</p>
          <p>Gas Price: {ethers.utils.formatUnits(txData.gasPrice, 'gwei')} Gwei</p>
          {/* You can add more transaction details here */}
        </div>
      )}
    </div>
  );
};

export default TransactionSearch;
