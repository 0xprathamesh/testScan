import { Chain } from "viem";

export const xdcTestnet: Chain = {
    id: 51,
    name: "xdc",
    nativeCurrency: {
        decimals: 18,
        name: "XinFin",
        symbol: "TXDC",
    },
    rpcUrls: {
        default:{http:["https://rpc.apothem.network"]},
    },
    blockExplorers: {
        default:{name: "xdcscan", url: "https://apothem.xinfinscan.com"}
    },
    testnet: true,
}