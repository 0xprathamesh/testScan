import React from 'react'
interface Asset {
    name: string;
    symbol: string;
    balance: number;
    value: number;
    price: number;
  }
const Wallet:React.FC<{assets:Asset[]}> = ({assets}) => {
  return (
    <div className="mt-4">
    <div className="flex space-x-2 mb-4">
      <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
        All ({assets.length})
      </span>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        Tokens ({assets.length})
      </span>
    </div>
    {assets.map((asset, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-4 flex items-center justify-between mb-2"
      >
        <div className="flex items-center">
          <img
            src={`/api/placeholder/32/32?text=${asset.symbol}`}
            alt={asset.name}
            className="w-8 h-8 mr-2"
          />
          <div>
            <p className="font-medium">
              {asset.name} ({asset.symbol})
            </p>
            <p className="text-sm text-gray-500">Token</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">
            ${asset.value.toFixed(2)} ({asset.balance.toFixed(4)}{" "}
            {asset.symbol})
          </p>
          <p className="text-sm text-gray-500">
            1 {asset.symbol} = ${asset.price.toFixed(2)}
          </p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default Wallet