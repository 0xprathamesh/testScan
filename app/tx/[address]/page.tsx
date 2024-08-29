"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface PageProps {
  params: {
    address: string;
  };
}

const TransactionPage: React.FC<PageProps> = ({ params }) => {
  const [transactionData, setTransactionData] = useState<ethers.providers.TransactionResponse | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
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
      setTransactionType(determineTransactionType(transaction));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching transaction data');
    }
  };

  const determineTransactionType = (transaction: ethers.providers.TransactionResponse): string => {
    if (transaction.to && transaction.data) {
      if (transaction.data.startsWith('0xa9059cbb')) {
        return 'ERC-20 Token Transfer';
      }
    }

    if (!transaction.to) {
      return 'Contract Creation';
    }

    return 'Regular Transaction';
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
            <strong>Type:</strong> {transactionType}
          </p>
          <p>
            <strong>Confirmations:</strong> {transactionData.confirmations}
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
          <p>
            <strong>Input Data:</strong> {transactionData.data}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
