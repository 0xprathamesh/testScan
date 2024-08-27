
"use client"
import { useState } from 'react';
import { ethers } from 'ethers';

const TransactionPage: React.FC = () => {
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [transactionData, setTransactionData] = useState<ethers.providers.TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionData = async () => {
    if (!transactionHash) {
      setError('Please enter a transaction hash');
      return;
    }

    try {
      // Connect to a provider (e.g., Ethereum mainnet)
      const provider = new ethers.providers.JsonRpcProvider(
        'https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe'
      );

      // Fetch transaction data
      const transaction = await provider.getTransaction(transactionHash);

      if (!transaction) {
        setError('Transaction not found');
        setTransactionData(null);
        return;
      }

      setTransactionData(transaction);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching transaction data');
    }
  };

  return (
    <div className="container">
      <h1>Fetch Transaction Data</h1>
      <input
        type="text"
        value={transactionHash}
        onChange={(e) => setTransactionHash(e.target.value)}
        placeholder="Enter transaction hash"
      />
      <button onClick={fetchTransactionData}>Fetch Data</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transactionData && (
        <div>
          <h2>Transaction Details</h2>
          <p>
            <strong>Block Number:</strong> {transactionData.blockNumber}
          </p>
          <p>
            <strong>From:</strong> {transactionData.from}
          </p>
          <p>
            <strong>To:</strong> {transactionData.to}
          </p>
          <p>
            <strong>Value:</strong> {ethers.utils.formatEther(transactionData.value)} ETH
          </p>
          <p>
            <strong>Gas Used:</strong> {transactionData.gasLimit.toString()}
          </p>
          {/* Add more transaction details as needed */}
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
