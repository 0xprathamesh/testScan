const env = "bitcoin";
export const token = "Bitcoin"
const getCoinData = async () => {
    const api = `https://api.coingecko.com/api/v3/coins/${env}?sparkline=true`;
    const data = await fetch(api);
    const coinData = await data.json();
    return coinData;
}
export { getCoinData };
