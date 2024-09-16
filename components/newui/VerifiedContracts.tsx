import React from 'react'
import Layout from '@/components/newui/Layout'
import { ArrowRight, Check, X } from 'lucide-react'

const VerifiedContracts = () => {
  const contracts = [
    { name: 'UniswapV2Pair', address: '0xb31...626f', balance: '0 ETH', txns: 1, compiler: 'Solidity', version: 'v0.5.16+commit.9c3226ce', optimization: true, constructorArg: false, status: 'Verified', time: '4h ago' },
    { name: 'GnosisSafeProxy', address: '0x6c3...09e4', balance: '0 ETH', txns: 0, compiler: 'Solidity', version: 'v0.7.6+commit.7338295f', optimization: false, constructorArg: true, status: 'Verified', time: '4h ago' },
    { name: 'iZiSwapPool', address: '0x429...836B', balance: '0 ETH', txns: 0, compiler: 'Solidity', version: 'v0.8.4+commit.c7e474f2', optimization: true, constructorArg: false, status: 'Verified', time: '4h ago' },
    { name: 'iZiSwapPool', address: '0x322...e429', balance: '0 ETH', txns: 0, compiler: 'Solidity', version: 'v0.8.4+commit.c7e474f2', optimization: true, constructorArg: false, status: 'Verified', time: '5h ago' },
    { name: 'UniswapV3Pool', address: '0x862...2a8C', balance: '0 ETH', txns: 0, compiler: 'Solidity', version: 'v0.7.6+commit.7338295f', optimization: true, constructorArg: false, status: 'Verified', time: '5h ago' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Verified Contracts</h2>
        <a href="#" className="text-blue-500 hover:underline">View All</a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">Contracts</th>
            <th>Balance</th>
            <th>Txns</th>
            <th>Compiler</th>
            <th>Version</th>
            <th>Settings</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index} className="border-t">
              <td className="py-3">
                <div>{contract.name}</div>
                <div className="text-sm text-gray-500">{contract.address}</div>
              </td>
              <td>{contract.balance}<br /><span className="text-sm text-gray-500">$0</span></td>
              <td>{contract.txns}</td>
              <td><span className="bg-gray-200 px-2 py-1 rounded-full text-sm">{contract.compiler}</span></td>
              <td>{contract.version}</td>
              <td>
                <div className="flex items-center">
                  {contract.optimization ? <Check className="text-green-500 mr-1" size={16} /> : <X className="text-red-500 mr-1" size={16} />}
                  <span className={contract.optimization ? "text-green-500" : "text-red-500"}>Optimization</span>
                </div>
                <div className="flex items-center">
                  {contract.constructorArg ? <Check className="text-green-500 mr-1" size={16} /> : <X className="text-red-500 mr-1" size={16} />}
                  <span className={contract.constructorArg ? "text-green-500" : "text-red-500"}>Constructor arg</span>
                </div>
              </td>
              <td>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">{contract.status}</span>
                <div className="text-sm text-gray-500">{contract.time}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default VerifiedContracts