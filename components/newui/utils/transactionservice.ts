import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_XDCSCAN_API_URL || 'https://api.xdcscan.io/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


function onSuccess(response: any) {
  if (response.data) {
    console.log('Response ============>', response.config.url, response.data);
    return response.data;
  }
  return response;
}

function onError(error: any) {
  console.error('Error:', error.response ? error.response.data : error.message);
  return { error: true, data: error.response ? error.response.data : error.message };
}

// TransactionService to handle different transaction API requests
export const transactionService = {
  // Fetch all transactions based on a query
  getTransactions: (query: string) => api.get(`/transactions${query}`).then(onSuccess, onError),

  // Fetch a specific transaction using a transaction hash
  getTransaction: (hash: string) => api.get(`/transactions/${hash}`).then(onSuccess, onError),

  // Fetch internal transactions related to a specific transaction hash
  getInternalTransaction: (hash: string, query: string = '') =>
    api.get(`/transactions/${hash}/internal-transactions${query}`).then(onSuccess, onError),

  // Fetch token transfers related to a specific transaction
  getTransactionTokenTransfer: (hash: string) =>
    api.get(`/transactions/${hash}/token-transfers`).then(onSuccess, onError),

  // Fetch logs for a specific transaction
  getTransactionLogs: (hash: string) => api.get(`/transactions/${hash}/logs`).then(onSuccess, onError),

  // Fetch a summary of a specific transaction
  getTransactionSummary: (hash: string) =>
    api.get(`/transactions/${hash}/summary`).then(onSuccess, onError),
};

export default transactionService;
