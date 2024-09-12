"use client";
// app/chains/page.tsx
import ChainCard from "@/components/ChainCard";
import Navbar from "@/components/Navbar";
import SearchChains from "@/components/SearchChains";
import Loading from "@/components/elements/Loading";
import Spinner from "@/components/elements/Spinner";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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

const Chains: React.FC = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Chain[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch("https://chainid.network/chains.json");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setChains(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }

      const response = await fetch(`/api/chains/search?query=${query}`);
      const data = await response.json();
      setSearchResults(data);
    };

    const debounceFetch = setTimeout(fetchSearchResults, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  const handleSearchResults = (query: string) => {
    setQuery(query);
  };
  const displayedChains = searchResults.length > 0 ? searchResults : chains;

  if (loading) {
    return <div className="h-40 m-auto text-blue"><Loading /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className=" flex flex-col justify-center items-center px-32 py-8">
        <h1 className="text-2xl uppercase font-semibold  text-slate-700 dark:text-slate-300">
          Chains
        </h1>

        <SearchChains handleSearch={handleSearchResults} />
        <ChainList chains={displayedChains} />
      </div>
    </>
  );
};

export default Chains;

const ChainList = ({ chains }: { chains: Chain[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-8 ">
      {chains.map((chain) => (
        <ChainCard key={chain.chainId} chain={chain} />
      ))}
    </div>
  );
};


