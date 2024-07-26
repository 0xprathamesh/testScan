import { fetchChainData } from './fetchChainData';

export const getNetworkConfig = async (chainId: number) => {
  const chainData = await fetchChainData();
  const network = chainData.find((chain: any) => chain.chainId === chainId);

  if (!network) {
    throw new Error(`Network with chain ID ${chainId} not found`);
  }

  return {
    id: network.chainId,
    name: network.name,
    rpc: network.rpc[0],
    nativeCurrency: network.nativeCurrency,
    blockExplorers: network.explorers,
    testnet: network.testnet || false,
    faucets: network.faucets || [],
  };
};
