const env = process.env.NEXT_PUBLIC_TOKEN_COINGEKOID;
export const token = "XDC"
const getCoinData = async () => {
    const api = `https://api.coingecko.com/api/v3/coins/${env}?sparkline=true`;
    const data = await fetch(api);
    const coinData = await data.json();
    return coinData;
}
export { getCoinData };
