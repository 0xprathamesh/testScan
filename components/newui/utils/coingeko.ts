const getCoinData = async () => {
    const api = "https://api.coingecko.com/api/v3/coins/xdce-crowd-sale?sparkline=true";
    const data = await fetch(api);
    const coinData = await data.json();
    return coinData;
}
export { getCoinData };
