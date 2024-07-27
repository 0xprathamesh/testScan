// utils/rpcUtils.ts

export const getRpcStatus = async (rpcUrls: string[]) => {
  const statuses: { [url: string]: boolean } = {};
  for (const url of rpcUrls) {
    try {
      const response = await fetch(url);
      statuses[url] = response.ok;
    } catch (error) {
      statuses[url] = false;
    }
  }
  return statuses;
};

export const getRpcLatency = async (rpcUrls: string[]) => {
  const latencies: { [url: string]: number | null } = {};
  for (const url of rpcUrls) {
    const start = Date.now();
    try {
      await fetch(url);
      const latency = Date.now() - start;
      latencies[url] = latency;
    } catch (error) {
      latencies[url] = null;
    }
  }
  return latencies;
};
