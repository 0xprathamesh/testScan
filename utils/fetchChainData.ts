export const fetchChainData = async () => {
    const response = await fetch('https://chainid.network/chains.json');
    if (!response.ok) {
      throw new Error('Failed to fetch chain data');
    }
    const data = await response.json();
    return data;
};
  