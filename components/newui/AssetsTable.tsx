"use client";
import React, { useEffect, useState } from "react";
import { FileText, User } from "lucide-react";
import { contractAddresses } from "./utils/data";

interface Asset {
  name: string;
  icon: string;
  type: string;
  marketCap: string;
  totalSupply: string;
  holders: number;
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

const AssetsTable: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = "test";

  const formatTokenSupply = (supply: any): string => {
    const supplyBigInt = BigInt(supply);
    const scaledSupply = supplyBigInt / BigInt(1e18);
    return scaledSupply.toLocaleString();
  };

  const fetchTotalHoldersCount = async (address: string): Promise<number> => {
    try {
      let page = 1;
      let totalHolders = 0;
      let hasMorePages = true;
      const pageSize = 1000;

      while (hasMorePages) {
        const response = await fetch(
          `https://api-xdc.blocksscan.io/api?module=token&action=tokenholderlist&contractaddress=${address}&page=${page}&offset=${pageSize}&apikey=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "1" && data.result) {
          totalHolders += data.result.length;
          hasMorePages = data.result.length === pageSize;
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return totalHolders;
    } catch (error) {
      console.error("Error fetching total holders count:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchAssetsData = async () => {
      try {
        setLoading(true);
        const assetsData = await Promise.all(
          contractAddresses.map(async (address) => {
            const [tokenInfoResponse, holdersCount] = await Promise.all([
              fetch(
                `https://api-xdc.blocksscan.io/api?module=token&action=tokeninfo&contractaddress=${address}`
              ),
              fetchTotalHoldersCount(address),
            ]);

            const tokenInfo = await tokenInfoResponse.json();
            console.log(tokenInfo);

            if (tokenInfo.status === "1") {
              return {
                name: `${tokenInfo.result.tokenName} (${tokenInfo.result.symbol})`,
                icon: tokenInfo.result.symbol.charAt(0),
                type: tokenInfo.result.tokenType,
                marketCap: tokenInfo.result.tokenPriceUSD || "N/A",
                totalSupply: `${formatTokenSupply(
                  tokenInfo.result.totalSupply
                )} ${tokenInfo.result.symbol}`,
                holders: holdersCount,
              };
            }
            return null;
          })
        );
        setAssets(assetsData.filter((asset) => asset !== null) as Asset[]);
      } catch (err) {
        setError("Failed to load assets data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetsData();
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
        <a href="#" className="text-blue-500 hover:underline">
          View All
        </a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 font-light">Asset Name</th>
            <th className="font-light">Circulating Market Cap</th>
            <th className="font-light">Total Supply</th>
            <th className="font-light">Holders</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {asset.icon}
                </div>
                <div>
                  <div className="flex items-center font-bold">
                    {asset.name}{" "}
                    <FileText size={16} className="ml-1 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                    {asset.type}
                  </span>
                </div>
              </td>
              <td className="font-bold">{asset.marketCap}</td>
              <td className="font-light text-gray-600">{asset.totalSupply}</td>
              <td>
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
