import { ethers } from "ethers";

export const networkService = {
    fetchBlockchainData: async (rpcUrl: string) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

            // Get latest block number
            const latestBlockNumber = await provider.getBlockNumber();

            // Get latest block details
            const latestBlock = await provider.getBlock(latestBlockNumber);
            const totalBlockTransactions = latestBlock.transactions.length;
            const totalTransactions = "325.67M"; // You might want to change this to a dynamic value based on your needs
            const gasUsed = latestBlock.gasUsed.toString();
            const gasLimit = latestBlock.gasLimit.toString();
            const miner = latestBlock.miner;
            const timestamp = latestBlock.timestamp;

            // Fetch latest transactions
            const latestTransactions = await Promise.all(
                latestBlock.transactions.slice(0, 10).map(async (tx) => {
                    const transaction = await provider.getTransaction(tx);
                    return {
                        ...transaction,
                        timestamp: latestBlock.timestamp,
                    };
                })
            );

            // Fetch the last 10 blocks
            const latestBlocks = await Promise.all(
                [...Array(10)].map((_, i) =>
                    provider.getBlock(latestBlockNumber - i)
                )
            );

            return {
                totalTransactions,
                totalBlockTransactions,
                gasUsed,
                gasLimit,
                miner,
                timestamp,
                latestBlock,
                latestTransactions,
                latestBlocks,
            };
        } catch (error) {
            console.error("Error fetching blockchain data:", error);
            throw error;
        }
    },
};
export const transact=  {
     
 }