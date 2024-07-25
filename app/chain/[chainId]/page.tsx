"use client";

import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ethers } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {useRpcStatus, useRpcLatency} from "@/utils/useRpcStatus"; // Adjust the import path as needed

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
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchChain();
    }
  }, [chainId]);

  const rpcStatuses = useRpcStatus(chain?.rpc || []);
  const rpcLatencies = useRpcLatency(chain?.rpc || []);

  const handleAddChain = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainIdHex = "0x" + chain!.chainId.toString(16);
      const blockExplorerUrls = chain!.blockExplorerUrls?.length
        ? chain!.blockExplorerUrls
        : null;

      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: chainIdHex,
            chainName: chain!.name,
            rpcUrls: chain!.rpc,
            blockExplorerUrls: blockExplorerUrls,
            nativeCurrency: chain!.nativeCurrency,
          },
        ]);

        await provider.send("wallet_switchEthereumChain", [
          { chainId: chainIdHex },
        ]);
      } catch (error) {
        console.error("Failed to add or switch the chain:", error);
      }
    } else {
      console.error("Web3 connection failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 justify-center items-center px-32 py-8">
        {chain ? (
          <>
            <h1 className="text-2xl uppercase font-semibold mb-6 mt-0 text-slate-700 dark:text-slate-300">
              {chain.name}
            </h1>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 max-w-96">
              <p className="text-xl font-semibold">{chain.name}</p>
              <div className="flex items-center justify-start gap-24 mt-2">
                <p className="text-lg font-semibold">
                  Chain ID{" "}
                  <span className="text-md font-normal">{chain.chainId}</span>
                </p>
                <p className="text-lg font-semibold">
                  Currency{" "}
                  <span className="text-md font-normal">{chain.chain}</span>
                </p>
              </div>
              <p>
                <span className="text-lg font-semibold">More Info :</span>{" "}
                <a
                  href={chain.infoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chain.infoURL}
                </a>
              </p>
              <button
                className="bg-green-400 mt-4 py-1 px-2 text-md rounded-lg w-30"
                onClick={handleAddChain}
              >
                Add Chain
              </button>
            </div>
          </>
        ) : (
          <div>Chain not found</div>
        )}
        {chain && (
          <div className="flex mt-10 justify-start gap-10">
            <ScrollArea className="h-60 w-1/2 rounded-md border">
              <div className="py-4">
                <div className="mb-4 text-sm font-medium leading-none text-center border-b pb-4">
                  RpcUrls
                </div>
                <ul className="list-none space-y-2">
                  {chain.rpc.map((rpcUrl) => (
                    <>
                      <li
                        key={rpcUrl}
                        className={`px-2 ${
                          rpcStatuses[rpcUrl]
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {rpcUrl} -{" "}
                        {rpcStatuses[rpcUrl] ? "Working" : "Not Working"} -{" "}
                        {rpcLatencies[rpcUrl] !== undefined
                          ? `${rpcLatencies[rpcUrl]} ms`
                          : "Latency not available"}
                      </li>
                      <Separator className="my-2" />
                    </>
                  ))}
                </ul>
              </div>
            </ScrollArea>
            <ScrollArea className="h-60 rounded-md border w-1/2">
              <div className="py-4">
                <div className="mb-4 text-sm font-medium leading-none text-center border-b pb-4">
                  Faucets
                </div>
                <ul className="list-none space-y-2">
                  {chain.faucets.map((faucet) => (
                    <li key={faucet}>
                      <a
                        href={faucet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2"
                      >
                        {faucet}
                      </a>
                      <Separator className="my-2" />
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
};

export default ChainDetail;
