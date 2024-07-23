import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface Chain {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  infoURL: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
};

const ChainCard = ({ chain }: { chain: Chain }) => {
  const [rpcStatuses, setRpcStatuses] = useState<{ [url: string]: boolean }>({});

  useEffect(() => {
    const checkRpcStatus = async () => {
      const statuses: { [url: string]: boolean } = {};
      for (const url of chain.rpc) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', method: 'web3_clientVersion', params: [], id: 1 }),
          });
          statuses[url] = response.ok;
        } catch (error) {
          statuses[url] = false;
        }
      }
      setRpcStatuses(statuses);
    };

    checkRpcStatus();
  }, [chain.rpc]);

  return (
    <Link href={`/chain/${chain.chainId}`}>
      <div className="cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm min-w-96 min-h-48">
        <div className="flex flex-col space-y-1.5 p-6">
          <p className="text-xl font-semibold">{chain.name}</p>
          <div className="flex items-center justify-start gap-24 mt-2">
            <p className="text-lg font-semibold">
              Chain ID <p className="text-md font-normal">{chain.chainId}</p>
            </p>
            <p className="text-lg font-semibold">
              Currency <p className="text-md font-normal">{chain.chain}</p>
            </p>
          </div>
          <p>
            <span className="text-lg font-semibold">More Info :</span> {""}
            <a href={chain.infoURL} target="_blank" rel="noopener noreferrer">
              {chain.infoURL}
            </a>
          </p>
          <div>
            <span className="text-lg font-semibold">RPC URLs:</span>
            <ul>
              {chain.rpc.map((url) => (
                <li key={url} className={rpcStatuses[url] ? 'text-green-500' : 'text-red-500'}>
                  {url} - {rpcStatuses[url] ? 'Working' : 'Not Working'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChainCard;

// import Link from 'next/link';
// import React from 'react'

// interface Chain {
//     name: string;
//     chain: string;
//     chainId: number;
//     rpc: string[];
//     faucets: string[];
//     infoURL: string;
//     nativeCurrency?: {
//       name: string;
//       symbol: string;
//       decimals: number;
//     };
//     blockExplorerUrls?: string[];
// };
//   const ChainCard = ({ chain }: { chain: Chain }) => {
//     return (
//       <Link href={`/chain/${chain.chainId}`}>
//         <div className="cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm min-w-96 min-h-48">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <p className="text-xl font-semibold">{chain.name}</p>
//             <div className="flex items-center justify-start gap-24 mt-2">
//               <p className="text-lg font-semibold">
//                 Chain ID <p className="text-md font-normal">{chain.chainId}</p>
//               </p>
//               <p className="text-lg font-semibold">
//                 Currency <p className="text-md font-normal">{chain.chain}</p>
//               </p>
//             </div>
//             <p>
//               <span className="text-lg font-semibold">More Info :</span> {""}
//               <a href={chain.infoURL} target="_blank" rel="noopener noreferrer">
//                 {chain.infoURL}
//               </a>
//             </p>
//           </div>
//         </div>
//       </Link>
//     );
//   };

// export default ChainCard