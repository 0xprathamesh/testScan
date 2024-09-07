import { createWalletClient, custom } from 'viem';

// Create wallet client
const walletClient = createWalletClient({
  transport: custom(window.ethereum!)
});

// Function to sign a message
export const signMessage = async (message: string) => {
  try {
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
