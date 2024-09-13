"use client"
import { ConnectButton, useNetworkSwitcherModal } from "thirdweb/react";
import { client, wallets } from "../utils/client";
import { xdcApothemNetwork } from "@/utils/xdcApothemNetwork";
import ParentComponent from "./elements/ModalButton";

import {
  useActiveAccount,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { dynamicNetworkConfig } from "@/utils/networkConfig";

const Navbar = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const isConnected = useActiveWalletConnectionStatus();
  const [networkConfig, setNetworkConfig] = useState<any>(null);

  console.log(isConnected);
  console.log(activeChain?.id);
  console.log(account);

  const networkSwitcher = useNetworkSwitcherModal();
  // const handleClick = () => {
  //   networkSwitcher.open({
  //     client,
  //     theme: "light",
  //     sections: [{ chains: [xdcApothemNetwork], label: "Supported Networks" }],
  //   });
  // };
  const handleClick = () => {
    if (networkConfig) {
      networkSwitcher.open({
        client,
        theme: "light",
        sections: [{ chains: [networkConfig], label: "Supported Networks" }],
      });
    }
  };
  useEffect(() => {
    if (dynamicNetworkConfig) {
      setNetworkConfig(dynamicNetworkConfig);
    }
  }, []);
  return (
    <div className="w-full px-32 py-8 flex items-center justify-between">
      <p className="text-2xl font-medium text-green-500">
        XDC <span className="text-gray-700">Explorer</span>
      </p>
      <div className="flex items-baseline justify-between gap-x-14">
        <Link className="text-lg font-medium text-gray-700" href="/chains">
          Chains
        </Link>
        <ParentComponent />
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"light"}
          connectModal={{ size: "compact" }}
        />
        {activeChain?.id !== networkConfig?.id &&
        isConnected === "connected" ? (
          <button onClick={handleClick}>Change Network</button>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
