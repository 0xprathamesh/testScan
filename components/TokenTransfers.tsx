// "use client";

// import { addressService } from "./newui/utils/apiroutes";
// import React, { useState, useEffect } from "react";

// interface TokenTransfer {
//   token: {
//     symbol: string;
//   };
//   from: string;
//   to: string;
//   value: string;
// }

// interface TokenTransfersProps {
//   address: string;
// }

// const TokenTransfers: React.FC<TokenTransfersProps> = ({ address }) => {
//   const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTokenTransfers = async () => {
//       try {
//         const response = await addressService.getTokenTransfers(
//           address,
//           `?limit=50&page=1`
//         );
//         console.log(response.items); // Log the response

//         // Map through the items and extract the necessary information
//         const tokenTransferData = response.items.map((item: any) => ({
//           token: {
//             symbol: item.token?.symbol || "Unknown", // Handle missing token symbol
//           },
//           from: item.from?.hash || "Unknown", // Extract from.hash
//           to: item.to?.hash || "Unknown", // Extract to.hash
//           value: (parseInt(item.total.value) / 10 ** item.token.decimals).toFixed(4), // Convert token value
//         }));

//         setTransfers(tokenTransferData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching token transfers:", err);
//         setError("Error fetching token transfers");
//         setLoading(false);
//       }
//     };

//     fetchTokenTransfers();
//   }, [address]);

//   if (loading) return <div>Loading token transfers...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Token Transfers</h2>
//       <table className="w-full">
//         <thead>
//           <tr>
//             <th className="text-left">Token</th>
//             <th className="text-left">From</th>
//             <th className="text-left">To</th>
//             <th className="text-right">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transfers.map((transfer, index) => (
//             <tr key={index}>
//               <td>{transfer.token.symbol}</td>
//               <td>{transfer.from}...</td> {/* Truncate `from` address */}
//               <td>{transfer.to}...</td> {/* Truncate `to` address */}
//               <td className="text-right">
//                 {transfer.value} {transfer.token.symbol}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TokenTransfers;
"use client"
import React, { useState, useEffect } from "react";
import { addressService } from "./newui/utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import Image from "next/image";

interface TokenTransfer {
  token: {
    symbol: string;
    name: string;
    icon_url: string;
  };
  from: string;
  to: string;
  value: string;
  hash: string;
}

interface TokenTransfersProps {
  address: string;
}

const TokenTransfers: React.FC<TokenTransfersProps> = ({ address }) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenTransfers = async () => {
      try {
        const response = await addressService.getTokenTransfers(
          address,
          `?limit=50&page=1`
        );
        console.log(response.items);

        const tokenTransferData = response.items.map((item: any) => ({
          token: {
            symbol: item.token?.symbol || "Unknown",
            name: item.token?.name || "Unknown Token",
            icon_url: item.token?.icon_url || "/path-to-default-icon.png",
          },
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value: (parseInt(item.total.value) / 10 ** item.token.decimals).toFixed(4),
          hash: item.tx_hash || "N/A",
        }));

        setTransfers(tokenTransferData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token transfers:", err);
        setError("Error fetching token transfers");
        setLoading(false);
      }
    };

    fetchTokenTransfers();
  }, [address]);

  if (loading) return <div>Loading token transfers...</div>;
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Token Transfers</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transfers.map((transfer, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-full">
                <Image
                  src={transfer.token.icon_url}
                  width={32}
                  height={32}
                  alt={transfer.token.symbol}
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p className="font-medium">{transfer.token.name} Transfer</p>
                <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                  #{parseAddress(transfer.hash)}{" "}
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(transfer.hash)}
                  />
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {transfer.value} {transfer.token.symbol}
              </p>
              <p className="text-sm text-gray-500">
                From: {parseAddress(transfer.from)} To: {parseAddress(transfer.to)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenTransfers;