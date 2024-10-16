"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/newui/Layout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { FileText, User } from "lucide-react";
import { tokenService } from "@/components/newui/utils/apiroutes";
import ERC721Tokens from "@/components/newui/ERC721Tokens"; 

interface Asset {
  name: string;
  icon: string;
  type: string;
  marketCap: string;
  price: string;
  priceChange24h: string;
  totalSupply: string;
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

const Tokens = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string>("ERC20");

  const formatTokenSupply = (supply: any): string => {
    const supplyBigInt = BigInt(supply);
    const scaledSupply = supplyBigInt / BigInt(1e18);
    return scaledSupply.toLocaleString();
  };

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tokenService.tokens(
        `/`
      );
      const data = response.items.map((token: any) => ({
        name: `${token.name} (${token.symbol})`,
        icon: `https://cdn.blocksscan.io/tokens/img/${token.symbol}.png`,
        type: token.type,
        marketCap: `$${parseFloat(
          token.circulating_market_cap_usd
        ).toLocaleString()}`,
        price: `$${parseFloat(token.exchange_rate).toFixed(6)}`,
        priceChange24h: parseFloat(token.price_change_24h).toFixed(2),
        totalSupply: `${formatTokenSupply(token.total_supply)} ${token.symbol}`,
        holders: token.holders,
        address: token.address,
      }));
      setAssets(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load assets data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [tokenType]);

  if (loading) {
    return (
      <Layout>
        <Skeleton />
      </Layout>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/newui" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <div className="text-sm">Tokens</div>
            <h1 className="text-xs text-blue font-bold">Home</h1>
          </div>
        </div>
        <div>
          <select
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="ERC20">ERC20</option>
            <option value="ERC721">ERC721</option>
          </select>
        </div>
      </div>
      {tokenType === "ERC20" ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
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
                          {asset.name}{" "}
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
                      <User size={16} className="mr-1 text-blue" />
                      {asset.holders.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ERC721Tokens />
      )}
    </Layout>
  );
};

export default Tokens;





// "use client";
// import React, { useEffect, useState } from "react";
// import Layout from "@/components/newui/Layout";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import ERC721Tokens from "@/components/newui/ERC721Tokens";
// import { FileText, User } from "lucide-react";

// import { tokenService } from "@/components/newui/utils/apiroutes";

// interface Asset {
//   name: string;
//   icon: string;
//   type: string;
//   marketCap: string;
//   price: string;
//   priceChange24h: string;
//   totalSupply: string;
//   holders: number;
//   address: string;
// }
// const Skeleton: React.FC = () => {
//   return (
//     <div className="animate-pulse space-y-4">
//       {[...Array(5)].map((_, index) => (
//         <div key={index} className="h-12 bg-gray-200 rounded"></div>
//       ))}
//     </div>
//   );
// };

// const Tokens = () => {
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const formatTokenSupply = (supply: any): string => {
//     const supplyBigInt = BigInt(supply);
//     const scaledSupply = supplyBigInt / BigInt(1e18);
//     return scaledSupply.toLocaleString();
//   };

//   const fetchTokens = async () => {
//     try {
//       const response = await tokenService.tokens(`/`);
//       const data = response.items.map((token: any) => ({
//         name: `${token.name} (${token.symbol})`,
//         icon: `https://cdn.blocksscan.io/tokens/img/${token.symbol}.png`,
//         type: token.type,
//         marketCap: `$${parseFloat(
//           token.circulating_market_cap_usd
//         ).toLocaleString()}`,
//         price: `$${parseFloat(token.exchange_rate).toFixed(6)}`,
//         priceChange24h: parseFloat(token.price_change_24h).toFixed(2),
//         totalSupply: `${formatTokenSupply(token.total_supply)} ${token.symbol}`,
//         holders: token.holders,
//         address: token.address,
//       }));
//       setAssets(data);
//     } catch (error) {
//       console.log(error);
//       setError("Failed to load assets data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTokens();
//   }, []);

//   if (loading) {
//     return (
//       <Layout>
//         <Skeleton />
//       </Layout>
//     );
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }
//   return (
//     <Layout>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Link href="/newui" className="mr-4">
//             <ArrowLeft className="h-6 w-6" />
//           </Link>
//           <div>
//             <div className="text-sm">Tokens</div>
//             <h1 className="text-xs text-blue font-bold">Home</h1>
//           </div>
//         </div>
//         <div>
//           <p>Select Tokens Type</p>
//         </div>
//       </div>
//       <div className="bg-white rounded-3xl border border-gray-200 p-6">
//         <table className="w-full">
//           <thead>
//             <tr className="text-left text-gray-500">
//               <th className="py-2 font-light">Asset Name</th>
//               <th className="py-2 font-light">Price</th>
//               <th className="py-2 font-light">24h Change</th>
//               <th className="py-2 font-light">Circulating Market Cap</th>
//               <th className="font-light">Holders</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assets.map((asset, index) => (
//               <tr key={index} className="border-t">
//                 <td className="py-4 flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                     <Link href={`/newui/tokens/${asset.address}`}>
//                       <img
//                         src={asset.icon}
//                         alt={asset.name}
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     </Link>
//                   </div>
//                   <div>
//                     <Link href={`/newui/tokens/${asset.address}`}>
//                       <div className="flex items-center font-bold">
//                         {asset.name}{" "}
//                         <FileText size={16} className="ml-1 text-gray-400" />
//                       </div>
//                       <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
//                         {asset.type}
//                       </span>
//                     </Link>
//                   </div>
//                 </td>
//                 <td className="font-normal text-sm">{asset.price}</td>
//                 <td
//                   className={`font-normal text-sm ${
//                     parseFloat(asset.priceChange24h) >= 0
//                       ? "text-green-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   {asset.priceChange24h}%
//                 </td>
//                 <td className="font-normal text-sm">{asset.marketCap}</td>
//                 <td className="font-normal text-sm">
//                   <div className="flex items-center">
//                     <User size={16} className="mr-1 text-blue" />
//                     {asset.holders.toLocaleString()}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Layout>
//   );
// };

// export default Tokens;
