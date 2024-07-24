export const xdcApothemNetwork: Network = {
    id: 51,
    name: "XDC Apothem Network",
    rpc: "https://rpc.apothem.network",
    nativeCurrency: {
      name: "XinFin",
      symbol: "TXDC",
      decimals: 18
    },
    blockExplorers: [
      {
        name: "xdcscan",
        url: "https://apothem.xinfinscan.com",
        icon: "https://path-to-icon/blocksscan-icon.png", // Replace with the actual URL for the icon
        standard: "EIP3091"
      },
      {
        name: "blocksscan",
        url: "https://apothem.blocksscan.io",
        icon: "https://path-to-icon/blocksscan-icon.png", // Replace with the actual URL for the icon
        standard: "EIP3091"
      }
    ],
    testnet: true,
    faucets: [
      "https://faucet.apothem.network"
    ]
}
  
 export const xdcNetwork = {
  id: 50,
  name: "XDC Network",
  rpc:     "https://erpc.xinfin.network",
  nativeCurrency: {
    name: "XinFin",
    symbol: "XDC",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "xdcscan",
      url: "https://xdcscan.io",
      icon: "https://path-to-icon/blocksscan-icon.png", // Replace with the actual URL for the icon
      standard: "EIP3091",
    },
    {
      name: "blocksscan",
      url: "https://xdc.blocksscan.io",
      icon: "https://path-to-icon/blocksscan-icon.png", // Replace with the actual URL for the icon
      standard: "EIP3091",
    },
  ],
  testnet: false,
  faucets: [],
};