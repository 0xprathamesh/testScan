"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Chain {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  infoURL: string;
}

const ChainDetail: React.FC = () => {
  const { chainId } = useParams();
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chainId) {
      const fetchChain = async () => {
        try {
          const response = await fetch("https://chainid.network/chains.json");
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data: Chain[] = await response.json();
          const selectedChain = data.find(
            (chain) => chain.chainId === Number(chainId)
          );
          if (selectedChain) {
            setChain(selectedChain);
          } else {
            setError("Chain not found");
          }
        } catch (err:any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchChain();
    }
  }, [chainId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      {chain ? (
        <>
          <h1 className="text-2xl uppercase font-semibold mb-6 mt-0 text-slate-700 dark:text-slate-300">
            {chain.name}
          </h1>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <p>
              <strong>Chain ID:</strong> {chain.chainId}
            </p>
            <p>
              <strong>Chain:</strong> {chain.chain}
            </p>

            <p>
              <strong>RPC URLs:</strong> {chain.rpc.join(", ")}
            </p>
            <p>
              <strong>Faucets:</strong> {chain.faucets.join(", ")}
            </p>
            <p>
              <strong>Info URL:</strong>{" "}
              <a href={chain.infoURL} target="_blank" rel="noopener noreferrer">
                {chain.infoURL}
              </a>
            </p>
          </div>
        </>
      ) : (
        <div>Chain not found</div>
      )}
    </div>
  );
};

export default ChainDetail;
