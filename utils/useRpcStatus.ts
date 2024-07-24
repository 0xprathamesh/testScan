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

export default useRpcStatus;
