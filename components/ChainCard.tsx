import Link from 'next/link';
import React from 'react'

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
          </div>
        </div>
      </Link>
    );
  };

export default ChainCard