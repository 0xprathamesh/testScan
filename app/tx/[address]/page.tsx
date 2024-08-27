"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface PageProps {
  params: {
    address: string;
  };
}

const TransactionPage: React.FC<PageProps> = ({ params }) => {
  const [transactionData, setTransactionData] = useState<ethers.providers.TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.address) {
      fetchTransactionData(params.address);
    } else {
      setError('No transaction hash provided');
    }
  }, [params.address]);

  const fetchTransactionData = async (hash: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe`
      );

      const transaction = await provider.getTransaction(hash);

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
      <h1>Transaction Details</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transactionData && (
        <div>
          <p>
            <strong>Transaction Hash:</strong> {params.address}
          </p>
          <p>
            <strong>Confirmations:</strong> {transactionData.confirmations}
          </p>
          <p>
            <strong>Gas Limit:</strong> {transactionData.s}
          </p>
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
            <strong>Gas Limit:</strong> {transactionData.gasLimit.toString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;