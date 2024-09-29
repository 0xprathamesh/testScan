"use client";
import React, { useEffect, useState } from "react";
import { tokenService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Link from "next/link";
import { parseAddress } from "@/lib/helpers";
import { BsPerson } from "react-icons/bs";

interface HoldersProps {
  address: string;
}

interface Holder {
  name?: string; // Optional holder name
  hash: string; // Address hash
  quantity: string;
  percentage: number;
}

const TokenHolders: React.FC<HoldersProps> = ({ address }) => {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const response = await tokenService.getTokenHolders(
          address,
          `?limit=50&page=1`
        );
        console.log("Token Holders ==========> ", response.items);
        const holdersData = response.items.map((item: any) => {
          const decimals = parseInt(item.token.decimals, 10);
          const balance = parseFloat(item.value) / Math.pow(10, decimals); 
          const totalSupply =
            parseFloat(item.token.total_supply) / Math.pow(10, decimals); 
          // Calculate percentage holding
          const percentage = (balance / totalSupply) * 100;

          return {
            name: item.address?.name || null, // Store the name if available
            hash: item.address?.hash, // Always use the address hash for the URL
            quantity: item.value,
            percentage: percentage,
          };
        });
        setHolders(holdersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };
    fetchHolders();
  }, [address]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  const formatTokenQuantity = (quantity: any, decimals = 18) => {
    const formattedQuantity = parseFloat(quantity) / Math.pow(10, decimals);
    return formattedQuantity.toLocaleString("en-US");
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-4 w-[869px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Holders</h2>
          <ChevronUp className="w-5 h-5" />
        </div>

        {/* Holder List */}
        <div className="space-y-4">
          {holders.map((holder, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 w-full"
            >
              <div className="flex items-center justify-between w-full">
                {/* Holder Address */}
                <div className="flex items-center" style={{ minWidth: "300px" }}>
                  <div className="bg-gray-200 rounded-full p-2">
                    <BsPerson className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center justify-between gap-x-4">
                      <div
                        className="text-blue text-sm font-light leading font-chivo flex items-center truncate"
                        style={{ maxWidth: "200px" }} // Limit address width
                      >
                        <Link href={`/newui/address/${holder.hash}`}>
                          {/* Show name if present, else fall back to parsed address */}
                          {holder.name || parseAddress(holder.hash)}
                        </Link>
                        <FiCopy
                          className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                          onClick={() =>
                            navigator.clipboard.writeText(holder.hash)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Quantity */}
                <div className="flex-shrink-0" style={{ width: "150px" }}>
                  <p className="text-sm text-gray-700 font-light text-center">
                    {formatTokenQuantity(holder.quantity)} Tokens
                  </p>
                </div>

                {/* Percentage Holding */}
                <div className="flex-shrink-0" style={{ width: "80px" }}>
                  <p className="text-sm text-gray-700 font-light text-right">
                    {holder.percentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TokenHolders;
