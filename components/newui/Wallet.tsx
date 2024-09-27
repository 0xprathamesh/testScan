"use client";

import { useEffect, useState } from "react";
// import React from 'react'
// interface Asset {
//     name: string;
//     symbol: string;
//     balance: number;
//     value: number;
//     price: number;
//   }
// const Wallet:React.FC<{assets:Asset[]}> = ({assets}) => {
//   return (
//     <div className="mt-4">
//     <div className="flex space-x-2 mb-4">
//       <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
//         All ({assets.length})
//       </span>
//       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//         Tokens ({assets.length})
//       </span>
//     </div>
//     {assets.map((asset, index) => (
//       <div
//         key={index}
//         className="bg-white rounded-lg p-4 flex items-center justify-between mb-2"
//       >
//         <div className="flex items-center">
//           <img
//             src={`/api/placeholder/32/32?text=${asset.symbol}`}
//             alt={asset.name}
//             className="w-8 h-8 mr-2"
//           />
//           <div>
//             <p className="font-medium">
//               {asset.name} ({asset.symbol})
//             </p>
//             <p className="text-sm text-gray-500">Token</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="font-medium">
//             ${asset.value.toFixed(2)} ({asset.balance.toFixed(4)}{" "}
//             {asset.symbol})
//           </p>
//           <p className="text-sm text-gray-500">
//             1 {asset.symbol} = ${asset.price.toFixed(2)}
//           </p>
//         </div>
//       </div>
//     ))}
//   </div>
//   )
// }

// export default Walletimport React, { useState, useEffect } from 'react';
import { addressService } from "./utils/apiroutes";
import { FileText } from "lucide-react";
import Image from "next/image";

interface Token {
  name: string;
  type: string;
  icon: string;
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

          return {
            name: token.name,
            type: token.type,
            icon: token.icon,
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
      {" "}
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
        <div className=" border-t-[0.5px]">
          {tokens.map((token, index) => (
            <div className="border-t " key={index}>
              <div className="flex items-center p-4 ">
                <li className=" rounded-full flex items-center justify-center mr-3">
                  <Image
                    src={`https://coin-images.coingecko.com/coins/images/16922/small/StorX_Logo_white_300x300-01.png?1696516493`}
                    width={12}
                    height={12}
                    alt="icon"
                    className="w-12 h-12"
                  />
                </li>
                <div>
                  <div className="flex items-center font-semibold font-inter">
                    {token.name}{" "}({token.symbol})
                    <FileText size={16} className="ml-1 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                    {token.type}
                  </span>
                </div>
                {/* <li>{token.name || "Unknown Token"}</li>
                <li className="text-right">{token.balance}</li> */}
                {/* <li className="text-right">
                  {token.value ? `$${token.value}` : "N/A"}
                </li> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Token</th>
            <th className="text-left">Symbol</th>
            <th className="text-right">Balance</th>
            <th className="text-right">Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index}>
              <td>{token.name || "Unknown Token"}</td>
              <td>{token.symbol || "N/A"}</td>
              <td className="text-right">{token.balance}</td>
              <td className="text-right">
                {token.value ? `$${token.value}` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Wallet;

const Tokens = () => <div>Tokens</div>;

const NFTs = () => <div>Nfts</div>;
