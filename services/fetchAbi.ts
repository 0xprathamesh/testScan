export const fetchAbi = async (contractAddress: string) => {
    const apiKey = 'testkey'; // Replace with your XDC scan API key
    const url = `https://api-xdc.blocksscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.status !== '1') {
      throw new Error(data.result);
    }
  
    return JSON.parse(data.result);
  };
  