"use client";
import React, { useEffect, useState } from "react";
import { FileText, User } from "lucide-react";
import { tokenService } from "./utils/apiroutes";
import Link from "next/link";

interface Asset {
  name: string;
  icon: string;
  type: string;
  marketCap: string;
  price: string;
  priceChange24h: string;
  holders: number;
  address: string;
}

const Skeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-12 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
};

interface AssetsList {
  quantity: number;
}

const AssetsTable: React.FC<AssetsList> = ({ quantity }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      const response = await tokenService.tokens(`/`);
      const data = response.items.map((token: any) => ({
        name: `${token.name} (${token.symbol})`,
        icon: `https://cdn.blocksscan.io/tokens/img/${token.symbol}.png`,
        type: token.type,
        marketCap: `$${parseFloat(token.circulating_market_cap_usd).toLocaleString()}`,
        price: `$${parseFloat(token.exchange_rate).toFixed(6)}`,
        priceChange24h: parseFloat(token.price_change_24h).toFixed(2),
        holders: token.holders,
        address: token.address,
      }));
      setAssets(data.slice(0, quantity));
    } catch (error) {
      console.log(error);
      setError("Failed to load assets data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Assets</h2>
        <a href="/newui/erc20" className="text-blue hover:underline">
          View All
        </a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 font-light">Asset Name</th>
            <th className="py-2 font-light">Price</th>
            <th className="py-2 font-light">24h Change</th>
            <th className="py-2 font-light">Circulating Market Cap</th>
            <th className="font-light">Holders</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Link href={`/newui/tokens/${asset.address}`}>
                    <img
                      src={asset.icon}
                      alt={asset.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Link>
                </div>
                <div>
                  <Link href={`/newui/tokens/${asset.address}`}>
                    <div className="flex items-center font-bold">
                      {asset.name}
                      <FileText size={16} className="ml-1 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                      {asset.type}
                    </span>
                  </Link>
                </div>
              </td>
              <td className="font-normal text-sm">{asset.price}</td>
              <td
                className={`font-normal text-sm ${
                  parseFloat(asset.priceChange24h) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {asset.priceChange24h}%
              </td>
              <td className="font-normal text-sm">{asset.marketCap}</td>
              <td className="font-normal text-sm">
                <div className="flex items-center">
                  <User size={16} className="mr-1 text-blue-500" />
                  {asset.holders.toLocaleString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsTable;
