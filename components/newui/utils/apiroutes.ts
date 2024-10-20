import axios from "axios";
import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.REACT_APP_OPEN_AI_KEY,
//     dangerouslyAllowBrowser: true,
// });

let api = axios.create();
const chartApi = axios.create();
const csvApi = axios.create();
const contractApi = axios.create();
const codeRunInstance = axios.create({
  baseURL: process.env.REACT_APP_CODERUN_AI_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_CODERUN_AI_KEY}`,
  },
});
const articleInstance = axios.create({
  baseURL: process.env.REACT_APP_ARTICLE_URL,
  headers: {
    // "Content-Type": "application/json",
    "api-key": `${process.env.REACT_APP_ARTICLE_KEY}`,
  },
});
const envAPI = process.env.NEXT_PUBLIC_MAINNET_API_URL;
// api.defaults.baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SOCKET_URL : 'https://api.xdcscan.io';
api.defaults.baseURL = envAPI;
contractApi.defaults.baseURL = envAPI;
// export const setAPIBaseURL = (baseURL: string) => {
//   api.defaults.baseURL = baseURL;
//   console.log(`API base URL set to: ${baseURL}`);
// };
// chartApi.defaults.baseURL = process.env.REACT_APP_CHART_URL || process.env.REACT_APP_SOCKET_URL || api.defaults.baseURL;
// csvApi.defaults.baseURL = process.env.REACT_APP_CSV_URL || process.env.REACT_APP_SOCKET_URL || api.defaults.baseURL;
// contractApi.defaults.baseURL = process.env.REACT_APP_SMART_CONTRACT_URL1 || process.env.REACT_APP_SOCKET_URL1 || api.defaults.baseURL;
// api.defaults.baseURL = 'https://abapi.blocksscan.io/';

// const socket = io(process.env.REACT_APP_SOCKET_URL as string, {
//     transports: ["websocket"],
// });

// socket.connect();

// export const sendData = <T = any>(method: string, params: any[]) => {
//     return new Promise<T>((resolve, reject) => {
//         // socket.emit(method, params, (res: any) => {
//         //     try {
//         //         const payload = JSON.parse(res.payload);
//         //         console.log(method, '=>', params, '<=', payload)
//         //         if (res.event === "Response") {
//         //             resolve(payload);
//         //         } else {
//         //             reject(payload);
//         //         }
//         //     } catch (err) {
//         //         reject(null);
//         //     }
//         // });
//         reject(null);
//     });
// };

function onError(response: any) {
  return { error: true, data: response.response.data };
}

function onSuccess(response: any) {
  if (response.data) {
    console.log(response.config.url, "Response ============", response.data);
    return response.data;
  } else {
    return response;
  }
}

export const dashboardService = {
  stats: () => api.get(`/stats`).then(onSuccess, onError),
  blocks: () => api.get(`/main-page/blocks`).then(onSuccess, onError),
  transactions: () =>
    api.get(`/main-page/transactions`).then(onSuccess, onError),
  chartTransactions: (formDate?: any, toDate?: any) =>
    api
      .get(`/stats/charts/transactions?from=${formDate}&to=${toDate}`)
      .then(onSuccess, onError),
  priceChart: () => chartApi.get(`/stats/charts/market`),
  search: (query: any) =>
    api.get(`/search/quick${query}`).then(onSuccess, onError),
  syncStatus: () => api.get(`/sync-status`).then(onSuccess, onError),
  accountGrowthChart: (fromDate?: any, toDate?: any) =>
    chartApi
      .get(`/lines/accountsGrowth?from=${fromDate}&to=${toDate}`)
      .then(onSuccess, onError),
  getNodeList: () =>
    api.get(`/nodeTracker/getNodeList`).then(onSuccess, onError),
  getAuditData: (hash: any) =>
    api.get(`smart-contracts/${hash}/audit-scan`).then(onSuccess, onError),
};
export const transactionService = {
  transactionStats: () =>
    api.get(`/transactions/stats`).then(onSuccess, onError),
  transactions: (query: any) =>
    api.get(`/transactions${query}`).then(onSuccess, onError),
  pendingTransactions: (query: any) =>
    api.get(`/transactions${query}`).then(onSuccess, onError),
  getInternalTransaction: (hash: any, query?: any) =>
    api
      .get(`/transactions/${hash}/internal-transactions${query}`)
      .then(onSuccess, onError),
  getTransaction: (hash: any) =>
    api.get(`/transactions/${hash}`).then(onSuccess, onError),
  getTransactionSummary: (hash: any) =>
    api.get(`/transactions/${hash}/summary`).then(onSuccess, onError),
  getTransactionTokenTransfer: (hash: any) =>
    api.get(`/transactions/${hash}/token-transfers`).then(onSuccess, onError),
  getTransactionLogs: (hash: any) =>
    api.get(`/transactions/${hash}/logs`).then(onSuccess, onError),
  getTransactionRowTrace: (hash: any) =>
    api.get(`/transactions/${hash}/raw-trace`).then(onSuccess, onError),
  getTransactionState: (hash: any, query: any) =>
    api
      .get(`/transactions/${hash}/state-changes${query}`)
      .then(onSuccess, onError),
  getSpecificTransaction: (query: any) =>
    api.get(`/transactions?date=${query}`).then(onSuccess, onError),
};
export const blockService = {
  blocks: (query: any) => api.get(`/blocks${query}`).then(onSuccess, onError),
  getBlock: (block: any) =>
    api.get(`/blocks/${block}`).then(onSuccess, onError),
  getBlockTransaction: (block: any, query: any) =>
    api.get(`/blocks/${block}/transactions${query}`).then(onSuccess, onError),
  getSpecficTransaction: (date: any, query: any) =>
    api.get(`/blocks/${date}/transactions${query}`).then(onSuccess, onError),
};
export const addressService = {
  addresses: (query: any) =>
    api.get(`/addresses${query}`).then(onSuccess, onError),
  getAddress: (address: any) =>
    api.get(`/addresses/${address}`).then(onSuccess, onError),
  getContract: (address: any) =>
    api.get(`/smart-contracts/${address}`).then(onSuccess, onError),
  verifiedAddressesStats: () =>
    contractApi.get(`/smart-contracts/counters`).then(onSuccess, onError),
  verifiedAddresses: (query: any) =>
    contractApi.get(`/smart-contracts${query}`).then(onSuccess, onError),
  getVerifiedAddress: (address: any, path: any) =>
    contractApi
      .get(`/smart-contracts/${address}${path}`)
      .then(onSuccess, onError),
  getContractConfig: () =>
    contractApi
      .get(`/smart-contracts/verification/config`)
      .then(onSuccess, onError),
  verifyContract: (address: any, method: any, data: any) =>
    contractApi
      .post(`/smart-contracts/${address}/verification/via/${method}`, data)
      .then(onSuccess, onError),
  queryRead: (address: any, query: any, data: any) =>
    contractApi
      .post(`/smart-contracts/${address}${query}`, data)
      .then(onSuccess, onError),
  getAddressTransactions: (address: any, query: string) =>
    api
      .get(`/addresses/${address}/transactions${query}`)
      .then(onSuccess, onError),
  getAddressInternalTransactions: (address: any, query: any) =>
    api
      .get(`/addresses/${address}/internal-transactions${query}`)
      .then(onSuccess, onError),
  getAddressTokens: (address: any, query: any) =>
    api.get(`/addresses/${address}/tokens${query}`).then(onSuccess, onError),
  getTokenTransfers: (token: any, query: any) =>
    api
      .get(`/addresses/${token}/token-transfers${query}`)
      .then(onSuccess, onError),
  downloadAddressCSV: (query: any) =>
    csvApi.get(`/transactions-csv${query}`).then(onSuccess, onError),
};
export const tokenService = {
  tokens: (query: any) => api.get(`/tokens${query}`).then(onSuccess, onError),
  getToken: (token: any) =>
    api.get(`/tokens/${token}`).then(onSuccess, onError),
  getTransferCount: (token: any) =>
    api.get(`/tokens/${token}/counters`).then(onSuccess, onError),
  getTransferHodlerCount: (token: any) =>
    api.get(`/counters?address=${token}&type=token`).then(onSuccess, onError),
  getNFTToken: (token: any, id: any) =>
    api.get(`/tokens/${token}/instances/${id}`).then(onSuccess, onError),
  getNFTTokenTransfers: (token: any, id: any, query: any) =>
    api
      .get(`/tokens/${token}/instances/${id}/transfers${query}`)
      .then(onSuccess, onError),
  getTokenTransfersList: (query: any) =>
    api.get(`/tokens/transfers${query}`).then(onSuccess, onError),
  getTokenTransfers: (token: any, query: any) =>
    api.get(`/tokens/${token}/transfers${query}`).then(onSuccess, onError),
  getTokenHolders: (token: any, query: any) =>
    api.get(`/tokens/${token}/holders${query}`).then(onSuccess, onError),
  getTokenInventory: (token: any, query: any) =>
    api.get(`/tokens/${token}/instances${query}`).then(onSuccess, onError),
  getTopMints: (query: any) =>
    api.get(`/nft/top-mints${query}`).then(onSuccess, onError),
  getLatestMints: (query: any) =>
    api.get(`/nft/latest-mints${query}`).then(onSuccess, onError),
  getLabels: () => api.get(`/tokens/categories`).then(onSuccess, onError),
  getCategorySlugs: (query: any) =>
    api
      .get(`/tokens?sort=holder_count&order=desc&category=${query}`)
      .then(onSuccess, onError),
  getTokenHolding: (token: any, from: any, to: any) =>
    api
      .get(`/stats/charts/tokens?hash=${token}&from=${from}&to=${to}`)
      .then(onSuccess, onError),
};

export const nodeTrackerServices = {
  getNodesData: () =>
    api.get(`nodeTracker/getNodeTrackerData`).then(onSuccess, onError),
  getNodelist: (query: any) =>
    api.get(`nodeTracker/getNodeList${query}`).then(onSuccess, onError),
  getNodeDetail: (query: any) =>
    api
      .get(`nodeTracker/getIndividualNodeData?id=${query}`)
      .then(onSuccess, onError),
  getNodeCount: () =>
    api.get(`nodeTracker/getNodeCount`).then(onSuccess, onError),
};

export const additionalServices = {
  getAccountBalance: (data: any) =>
    api
      .post(`/addresses/addressHistoricalBalance`, data)
      .then(onSuccess, onError),
  getTokenBalance: (data: any) =>
    api.post(`/tokens/tokenHistoricalBalance`, data).then(onSuccess, onError),
};

export const resourceService = {
  exportCSV: (query: any) =>
    chartApi.get(`/export/csv${query}`).then(onSuccess, onError),
};

export const chartService = {
  getChartSection: () => chartApi.get(`/lines`).then(onSuccess, onError),
  getBalanceHistory: (address: any) =>
    chartApi
      .get(`/addresses/${address}/coin-balance-history-by-day`)
      .then(onSuccess, onError),
};

export const gasService = {
  getGasSection: () => api.get(`/stats`).then(onSuccess, onError),
};

// export const openAIService = {
//     sendMessageToOpenAI: async (gptInfo: any) => await openai.chat.completions.create({model: gptInfo?.model, messages: gptInfo?.messages,}).then(onSuccess, onError),
//     sendMessageToCodeRunAI: async (data: any) => await codeRunInstance.post(`/chat/`, data).then(onSuccess, onError),
// };

// export const articleService = {
//     publishAsArticle: async (data: any) => await articleInstance.post(`/articles`, data).then(onSuccess, onError),
// };

// export const profileAccountService = {
//     getVerified: async (data: any) => await api.post(`/verify/verifyPayload`, data).then(onSuccess, onError),
//     getProfileData: async (data: any) => await api.post(`/user/update`, data).then(onSuccess, onError),
//     createApiKey: async (data: any) => await api.post(`/user/create-api-key`, data).then(onSuccess, onError),
// }

export { api };
