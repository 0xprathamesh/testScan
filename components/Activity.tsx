"use client"
import React, { useState, useEffect } from "react";
import { addressService } from "./newui/utils/apiroutes";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
}

interface ActivityProps {
  address: string;
}

const Activity: React.FC<ActivityProps> = ({ address }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await addressService.getAddressTransactions(
          address,
          `?limit=50&page=1`
        );
        console.log('API Response:', response.items);

        // Process only transactions, ensuring no objects are rendered directly
        const transactionData = response.items.map((item: any) => ({
          hash: item.hash || "N/A", // Use "N/A" if no hash is found
          from: item.from?.hash || "Unknown", // Handle nested `from.hash`
          to: item.to?.hash || "Unknown", // Handle nested `to.hash`
          value: (parseInt(item.value) / 10 ** 18).toFixed(4), // Assuming value is in wei
        }));

        setTransactions(transactionData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;
  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Activity</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Transaction Hash</th>
            <th className="text-left">From</th>
            <th className="text-left">To</th>
            <th className="text-right">Value (XDC)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{parseAddress(tx.hash)}...</td> {/* Truncate hash for display */}
              <td>{parseAddress(tx.from)}...</td> {/* Truncate address */}
              <td>{parseAddress(tx.to)}...</td> {/* Truncate address */}
              <td className="text-right">{tx.value} XDC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activity;
