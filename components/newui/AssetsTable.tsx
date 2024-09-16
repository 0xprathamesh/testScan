import React from 'react'
import Layout from '@/components/newui/Layout'
import { FileText, User } from 'lucide-react'

const AssetsTable = () => {
  const assets = [
    { name: 'Manta (MANTA)', icon: 'M', type: 'Token', marketCap: 'N/A', totalSupply: '1,000,000,000,000,000T MANTA', holders: 202520 },
    { name: 'MANTA (Claim on: claims-manta.com)', icon: 'C', type: 'Token', marketCap: 'N/A', totalSupply: '1,000,000,000 Claim on: claims-manta.com', holders: 193232 },
    { name: 'Manta Girls (MG)', icon: 'M', type: 'NFT', marketCap: 'N/A', totalSupply: '200,000 MG', holders: 87369 },
    { name: 'Tether USD (USDT)', icon: '💎', type: 'Token', marketCap: 'N/A', totalSupply: '9,376,209,274,389 USDT', holders: 58108 },
    { name: 'FOMO Manta (FANTA)', icon: 'F', type: 'Token', marketCap: 'N/A', totalSupply: '1,000,000,000,000,000,000T FANTA', holders: 56548 },
  ]

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
  )
}
export default AssetsTable;