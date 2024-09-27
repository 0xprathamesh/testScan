"use client"
import React, { useState, useEffect } from 'react';
import { addressService, transactionService } from './newui/utils/apiroutes';

interface InternalTransaction {
  parentHash: string;
  from: string;
  to: string;
  value?: string;
}

interface InternalTxProps {
  address: string;
}

const InternalTx: React.FC<InternalTxProps> = ({ address }) => {
  const [internalTxs, setInternalTxs] = useState<InternalTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternalTransactions = async () => {
      try {
        const response = await addressService.getAddressInternalTransactions(address, `?limit=50&page=1`);
               // Map through the items and extract the necessary information
               const internalTxData = response.items.map((item: any) => ({
                token: {
                  symbol: item.token?.symbol || "Unknown", // Handle missing token symbol
                 },
                 parentHash: item.transaction_hash ,
                from: item.from?.hash || "Unknown", // Extract from.hash
                to: item.to?.hash || "Unknown", // Extract to.hash
              
              }));
        setInternalTxs(internalTxData || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching internal transactions');
        setLoading(false);
      }
    };

    fetchInternalTransactions();
  }, [address]);

  if (loading) return <div>Loading internal transactions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Internal Transactions</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Parent Tx Hash</th>
            <th className="text-left">From</th>
            <th className="text-left">To</th>
            <th className="text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {internalTxs.map((tx, index) => (
            <tr key={index}>
              <td>{tx.parentHash}...</td>
              <td>{tx.from}...</td>
              <td>{tx.to}...</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InternalTx;