import { useState, useEffect } from 'react';

const useRpcStatus = (rpcUrls: string[]) => {
  const [rpcStatuses, setRpcStatuses] = useState<{ [url: string]: boolean }>({});

  useEffect(() => {
    const checkRpcStatus = async () => {
      const statuses: { [url: string]: boolean } = {};
      for (const url of rpcUrls) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', method: 'web3_clientVersion', params: [], id: 1 }),
          });
          statuses[url] = response.ok;
        } catch (error) {
          statuses[url] = false;
        }
      }
      setRpcStatuses(statuses);
    };

    checkRpcStatus();
  }, [rpcUrls]);

  return rpcStatuses;
};



const useRpcLatency = (rpcUrls:string[]) => {
  const [latencies, setLatencies] = useState<{ [key: string]: number | null }>({});

  useEffect(() => {
    const measureLatency = async (url: string) => {
      const start = Date.now();
      try {
        await fetch(url, { method: 'HEAD' });
        const latency = Date.now() - start;
        return latency;
      } catch (error) {
        console.error(`Error measuring latency for ${url}:`, error);
        return null;
      }
    };

    const fetchLatencies = async () => {
      const results: { [key: string]: number | null } = {};
      for (const url of rpcUrls) {
        const latency = await measureLatency(url);
        results[url] = latency;
      }
      setLatencies(results);
    };

    fetchLatencies();
  }, [rpcUrls]);

  return latencies;
};

export { useRpcLatency, useRpcStatus };
 

