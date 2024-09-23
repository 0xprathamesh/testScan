"use client";
import React, { useEffect, useState } from 'react';
import Layout from '@/components/newui/Layout';
import { FileText, User } from 'lucide-react';

// Define an interface for the asset data
interface Asset {
  name: string;
  icon: string;
  type: string;
  marketCap: string;
  totalSupply: string;
  holders: number;
}

const AssetsTable: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]); // Assets should be an array of the Asset type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = 'test'; 
  const contractAddresses: string[] = [
    '0x5d5f074837f5d4618b3916ba74de1bf9662a3fed', 
    '0x8f9920283470f52128bf11b0c14e798be704fd15',
    '0xff7412ea7c8445c46a8254dfb557ac1e48094391',
    '0x49d3f7543335cf38fa10889ccff10207e22110b5',
    '0x3fb46c4db76d8e9f69f3f8388f43a7ca7e140807',
  ];

  // Function to format the token supply
  const formatTokenSupply = (supply: any): string => {
    const supplyBigInt = BigInt(supply);
    const scaledSupply = supplyBigInt / BigInt(1e18);
    return scaledSupply.toLocaleString();
  };

  // Function to fetch total holders count for a given contract address
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
        
        if (data.status === '1' && data.result) {
          totalHolders += data.result.length;
          hasMorePages = data.result.length === pageSize;
          page++;
        } else {
          hasMorePages = false;
        }
      }

      return totalHolders;
    } catch (error) {
      console.error('Error fetching total holders count:', error);
      return 0;
    }
  };

  // Fetch assets data when the component mounts
  useEffect(() => {
    const fetchAssetsData = async () => {
      try {
        setLoading(true);
        const assetsData = await Promise.all(
          contractAddresses.map(async (address) => {
            const [tokenInfoResponse, holdersCount] = await Promise.all([
              fetch(`https://api-xdc.blocksscan.io/api?module=token&action=tokeninfo&contractaddress=${address}`),
              fetchTotalHoldersCount(address),
            ]);

            const tokenInfo = await tokenInfoResponse.json();
            console.log(tokenInfo);
            
            if (tokenInfo.status === '1') {
              return {
                name: `${tokenInfo.result.tokenName} (${tokenInfo.result.symbol})`,
                icon: tokenInfo.result.symbol.charAt(0),
                type: tokenInfo.result.tokenType,
                marketCap: tokenInfo.result.tokenPriceUSD || 'N/A',
                totalSupply: `${formatTokenSupply(tokenInfo.result.totalSupply)} ${tokenInfo.result.symbol}`,
                holders: holdersCount,
              };
            }
            return null;
          })
        );
        setAssets(assetsData.filter((asset) => asset !== null) as Asset[]);
      } catch (err) {
        setError('Failed to load assets data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssetsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Assets</h2>
        <a href="#" className="text-blue-500 hover:underline">View All</a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">Asset Name</th>
            <th>Circulating Market Cap</th>
            <th>Total Supply</th>
            <th>Holders</th>
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
                  <div className="flex items-center">
                    {asset.name} <FileText size={16} className="ml-1 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded-full">{asset.type}</span>
                </div>
              </td>
              <td>{asset.marketCap}</td>
              <td>{asset.totalSupply}</td>
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
