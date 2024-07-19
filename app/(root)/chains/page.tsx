"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Chain {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  infoURL: string;
}

const Chains: React.FC = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch("https://chainid.network/chains.json");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setChains(data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl uppercase font-semibold mb-6 mt-0 text-slate-700 dark:text-slate-300">
        Chains
      </h1>
      {/* <ul>
        {chains.map((chain) => (
          <li key={chain.chainId}>
            <h2>{chain.name}</h2>
            <p>Chain ID: {chain.chainId}</p>
            <p>Chain: {chain.chain}</p>
            <p>RPC URLs: {chain.rpc.join(', ')}</p>
            <p>Faucets: {chain.faucets.join(', ')}</p>
            <p>
              Info URL: <a href={chain.infoURL}>{chain.infoURL}</a>
            </p>
          </li>
        ))}
      </ul> */}

      <ChainList chains={chains} />
    </div>
  );
};

export default Chains;

const ChainList = ({ chains }: { chains: Chain[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 ">
      {chains.map((chain) => (
        <ChainCard key={chain.chainId} chain={chain} />
      ))}
    </div>
  );
};

const ChainCard = ({ chain }: { chain: Chain }) => {
  return (
    <Link href={`/chain/${chain.chainId}`}>
      <div className="cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="font-medium text-md text-slate-700">{chain.chain}</h1>
        </div>
      </div>
    </Link>
  );
};
