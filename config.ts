import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { xdcTestnet } from "./utils/CustomChain";



export const config = createConfig(
  getDefaultConfig({
    appName: "ConnectKit Next.js demo",
    chains: [xdcTestnet],

    transports: {
      [xdcTestnet.id]: http(
        `https://rpc.ankr.com/multichain/6944333ba8fa52fa3f28576862e5d2ea1b9568a72a3207c76956b6f335db4fc0`
      ),
    },

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
