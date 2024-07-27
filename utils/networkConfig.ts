import { getNetworkConfig } from './getNetworkConfig';

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 51; // Default to Ethereum Mainnet

let dynamicNetworkConfig: any;

(async () => {
  try {
    dynamicNetworkConfig = await getNetworkConfig(chainId);
  } catch (error) {
    console.error("Failed to fetch network config:", error);
    dynamicNetworkConfig = null;
  }
})();

export { dynamicNetworkConfig };
