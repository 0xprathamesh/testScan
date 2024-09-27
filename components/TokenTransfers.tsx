"use client";

import { addressService } from "./newui/utils/apiroutes";
import React, { useState, useEffect } from "react";

interface TokenTransfer {
  token: {
    symbol: string;
  };
  from: string;
  to: string;
  value: string;
}

interface TokenTransfersProps {
  address: string;
}

const TokenTransfers: React.FC<TokenTransfersProps> = ({ address }) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenTransfers = async () => {
      try {
        const response = await addressService.getTokenTransfers(
          address,
          `?limit=50&page=1`
        );
        console.log(response.items); // Log the response

        // Map through the items and extract the necessary information
        const tokenTransferData = response.items.map((item: any) => ({
          token: {
            symbol: item.token?.symbol || "Unknown", // Handle missing token symbol
          },
          from: item.from?.hash || "Unknown", // Extract from.hash
          to: item.to?.hash || "Unknown", // Extract to.hash
          value: (parseInt(item.total.value) / 10 ** item.token.decimals).toFixed(4), // Convert token value
        }));

        setTransfers(tokenTransferData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token transfers:", err);
        setError("Error fetching token transfers");
        setLoading(false);
      }
    };

    fetchTokenTransfers();
  }, [address]);

  if (loading) return <div>Loading token transfers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Token Transfers</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Token</th>
            <th className="text-left">From</th>
            <th className="text-left">To</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer, index) => (
            <tr key={index}>
              <td>{transfer.token.symbol}</td>
              <td>{transfer.from}...</td> {/* Truncate `from` address */}
              <td>{transfer.to}...</td> {/* Truncate `to` address */}
              <td className="text-right">
                {transfer.value} {transfer.token.symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTransfers;
