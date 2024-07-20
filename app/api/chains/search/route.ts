import { NextResponse } from "next/server";

// Define the structure of a Chain object
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

async function fetchChains(): Promise<Chain[]> {
  const url = "https://chainid.network/chains.json";
  const response = await fetch(url, {
    method: "GET",
  });
  const chains: Chain[] = await response.json();
  return chains;
}

export async function GET(request: Request) {
  const chains = await fetchChains();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase();

  if (!query) {
    return NextResponse.json([]);
  }

  const filteredChains = chains.filter((chain: Chain) => {
    return (
      chain.name.toLowerCase().includes(query) ||
      chain.chain.toLowerCase().includes(query)
    );
  });

  return NextResponse.json(filteredChains);
}
