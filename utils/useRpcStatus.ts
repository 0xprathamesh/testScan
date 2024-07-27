// utils/rpcUtils.ts
import { useState, useEffect } from "react";

export const useRpcStatus = (rpcUrls: string[]) => {
  const [rpcStatuses, setRpcStatuses] = useState<{ [url: string]: boolean }>({});

  useEffect(() => {
    const checkRpcStatus = async () => {
      const statuses: { [url: string]: boolean } = {};
      for (const url of rpcUrls) {
        try {
          const response = await fetch(url);
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

export const useRpcLatency = (rpcUrls: string[]) => {
  const [rpcLatencies, setRpcLatencies] = useState<{ [url: string]: number | null }>({});

  useEffect(() => {
    const checkRpcLatency = async () => {
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
      setRpcLatencies(latencies);
    };

    checkRpcLatency();
  }, [rpcUrls]);

  return rpcLatencies;
};
