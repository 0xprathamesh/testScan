import { ConnectButton, useNetworkSwitcherModal } from "thirdweb/react";
import { client, wallets } from "../utils/client";
import { xdcApothemNetwork } from "@/utils/xdcApothemNetwork";
import {
  useActiveAccount,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import Link from "next/link";
import React from "react";



const Navbar = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const isConnected = useActiveWalletConnectionStatus();

  console.log(isConnected);
  console.log(activeChain?.id);
  console.log(account);

  const networkSwitcher = useNetworkSwitcherModal();
  const handleClick = () => {
    networkSwitcher.open({
      client,
      theme: "light",
      sections: [{ chains: [xdcApothemNetwork], label: "Supported Networks" }],
    });
  };

  return (
    <div className="w-full px-32 py-8 flex items-center justify-between">
      <p className="text-2xl font-medium text-green-500">
        XDC <span className="text-gray-700">Explorer</span>
      </p>
      <div className="flex items-baseline justify-between gap-x-14">
        <Link className="text-lg font-medium text-gray-700" href="/chains">
          Chains
        </Link>

        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"light"}
          connectModal={{ size: "compact" }}
        />
        {activeChain?.id !== 51 && isConnected === "connected" ? (
          <button onClick={handleClick}>Change Network</button>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
