import { ethers } from "ethers";
import { dashboardService, addressService } from "./apiroutes";
interface TopAccount {
  hash: string;
  coin_balance: string;
}
const getBlockchainData = async (rpcUrl: string) => {
  try {
    // Initialize provider using RPC URL
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Get latest block number
    const latestBlockNumber = await provider.getBlockNumber();

    // Get latest block details
    const latestBlock = await provider.getBlock(latestBlockNumber);
    const totalBlockTransactions = await latestBlock.transactions.length;
    const latestTransaction = await latestBlock.transactions.slice(0, 1);
    // Get total transactions on chain
    const totalTransactions = "325.67M";
    const totalBlocks = await provider.getBlock(latestBlockNumber);
    // You can also get other block data such as:
    const gasUsed = latestBlock.gasUsed.toString();
    const gasLimit = latestBlock.gasLimit.toString();
    const miner = latestBlock.miner;
    const timestamp = latestBlock.timestamp;

    return {
      latestBlockNumber,
      totalTransactions,
      totalBlockTransactions,
      gasUsed,
      gasLimit,
      miner,
      timestamp,
      latestBlock,
      latestTransaction,
    };
  } catch (error) {
    console.error("Error fetching blockchain data:", error);
    throw error;
  }
};
const fetchdata = async () => {
  try {
    const response = await dashboardService.stats();
    const { total_addresses, total_blocks, total_transactions } = response;
    return { total_addresses, total_blocks, total_transactions };
  } catch (error) {
    console.log(error);
    return null;
  }
};
const fetchContracts = async () => {
  try {
    const resposne = await addressService.getContract(`/counters`);
    const {
      smart_contracts,
      new_smart_contracts_24h,
      verified_smart_contracts,
      new_verified_smart_contracts_24h,
    } = resposne;
    return {
      smart_contracts,
      new_smart_contracts_24h,
      verified_smart_contracts,
      new_verified_smart_contracts_24h,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
const fetchTopAccounts = async () => {
  try {
    const response = await addressService.addresses(`?limit=50&page=1`);

    const topThreeAccounts: TopAccount[] = response.items
      .slice(0, 3)
      .map((account: any) => ({
        hash: account.hash,
        coin_balance: account.coin_balance,
      }));
    return topThreeAccounts;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const fetchChartData = async () => {
  try {
    const resposne = await dashboardService.chartTransactions(undefined, undefined);
    
  } catch (err) {
    console.log(err)
  }
}

export { getBlockchainData, fetchdata, fetchTopAccounts,fetchContracts };
