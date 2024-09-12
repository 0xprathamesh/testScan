import { createWalletClient, custom, WalletClient } from 'viem';

// Explicitly declare the type of walletClient
let walletClient: WalletClient | undefined;

if (typeof window !== 'undefined' && window.ethereum) {
  // Create wallet client only in the browser
  walletClient = createWalletClient({
    transport: custom(window.ethereum)
  });
}

// Function to sign a message
export const signMessage = async (message: string) => {
  try {
    if (!walletClient) {
      throw new Error("Wallet client is not initialized.");
    }

    const [account] = await walletClient.getAddresses();
    const signature = await walletClient.signMessage({
      account,
      message,
    });
    return { signature, address: account };
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};
