"use client"
import React, { useState, useEffect } from "react";
import { addressService } from "./utils/apiroutes";
import { FileText } from "lucide-react";
import Image from "next/image";

interface Token {
  name: string;
  type: string;
  icon_url: string | null; 
  symbol: string;
  balance: string;
  value: string | null;
}

interface WalletProps {
  address: string;
}

const Wallet: React.FC<WalletProps> = ({ address }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await addressService.getAddressTokens(address, "");
        const tokenData = response.items.map((item: any) => {
          const { token, value } = item;
          const balance = (
            parseInt(value) /
            10 ** parseInt(token.decimals)
          ).toFixed(4);
          const usdValue = token.exchange_rate
            ? (parseFloat(balance) * parseFloat(token.exchange_rate)).toFixed(2)
            : null;

          // Use a fallback URL if icon_url is null
          const iconUrl = token.icon_url || "/path-to-default-icon.png"; 
          
          return {
            name: token.name,
            type: token.type,
            icon_url: iconUrl,
            symbol: token.symbol,
            balance,
            value: usdValue,
          };
        });
        setTokens(tokenData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching tokens");
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address]);

  if (loading) return <div>Loading tokens...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="bg-white rounded-3xl w-[869px]">
        <div className="flex space-x-2 p-4">
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">
            All {}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Tokens
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            NFTs
          </span>
        </div>
        <div className="border-t-[0.5px]">
          {tokens.map((token, index) => (
            <div className="border-t" key={index}>
              <div className="flex items-center p-4">
                <li className="rounded-full flex items-center justify-center mr-3">
                  <Image
                    src={token.icon_url ||  ""} 
                    width={12}
                    height={12}
                    alt="icon"
                    className="w-12 h-12"
                  />
                </li>
                <div>
                  <div className="flex items-center font-semibold font-inter">
                    {token.name} ({token.symbol})
                    <FileText size={16} className="ml-1 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                    {token.type}
                  </span>
                </div>
                <div className="text-right ml-80">
                  <p className="font-medium">
                    {token.balance} {token.symbol}
                  </p>
                  <p className="text-sm text-gray-500">
                    {token.value ? `$${token.value}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

const Tokens = () => <div>Tokens</div>;

const NFTs = () => <div>Nfts</div>;
