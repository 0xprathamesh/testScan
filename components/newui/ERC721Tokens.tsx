import React, { useEffect, useState } from "react";
import { tokenService } from "@/components/newui/utils/apiroutes";
import { User } from "lucide-react";
import Loading from "../elements/Loading";


interface Asset {
  name: string;
  icon: string | null;
  type: string;
  marketCap: string;
  holders: number;
  address: string;
  transfers: number;
  owners: number;
  totalAssets: string;
}

const ERC721Tokens: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tokenService.tokens(
        `?type=ERC-721%2CERC-1155&limit=50&page=1&sort=holders&order=desc`
      );
      const data = response.items.map((token: any) => ({
        name: `${token.name} (${token.symbol})`,
        icon: token.icon_url
          ? token.icon_url
          : `https://cdn.blocksscan.io/tokens/img/${token.symbol}.png`,
        type: token.type,
        marketCap: `$${parseFloat(
          token.circulating_market_cap_usd
        ).toLocaleString()}`,
        holders: token.holders,
        address: token.address,
        transfers: token.stats?.token_transfers_count || 0, // Fallback to 0 if undefined
        owners: token.stats?.holder_count || 0, // Fallback to 0 if undefined
        totalAssets: token.total_supply || "N/A",
      }));
      setAssets(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load ERC721 tokens data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  if (loading) {
    return <div className="text-center text-blue"><Loading/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 font-light">Asset Name</th>
            <th className="py-2 font-light">Circulating Market Cap</th>
            <th className="py-2 font-light">Transfers</th>
            <th className="py-2 font-light">Owners</th>
            <th className="py-2 font-light">Total Assets</th>
            <th className="font-light">Holders</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {asset.icon ? (
                    <img
                      src={asset.icon}
                      alt={asset.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-xs text-gray-500">{asset.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center font-bold">
                    {asset.name}
                  </div>
                  <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                    {asset.type}
                  </span>
                </div>
              </td>
              <td className="font-normal text-sm">{asset.marketCap}</td>
              <td className="font-normal text-sm">{asset.transfers.toLocaleString()}</td>
              <td className="font-normal text-sm">{asset.owners.toLocaleString()}</td>
              <td className="font-normal text-sm">{asset.totalAssets.toLocaleString()}</td>
              <td className="font-normal text-sm">
                <div className="flex items-center">
                  <User size={16} className="mr-1 text-blue" />
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

export default ERC721Tokens;
