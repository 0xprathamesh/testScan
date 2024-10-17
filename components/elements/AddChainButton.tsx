"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { chainConfig } from "../newui/utils/chainConfig";
import { metamaskfox } from "@/public/assets";
import Image from "next/image";

interface ChainConfig {
  chainId: number;
  name: string;
  rpc: string[];
  blockExplorerUrls?: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const AddChainButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
          const network = await provider.getNetwork();
          setCurrentChainId(network.chainId.toString());
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        setIsConnected(true);
        const network = await provider.getNetwork();
        setCurrentChainId(network.chainId.toString());
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const handleAddOrSwitchChain = async () => {
    if (!isConnected) {
      await handleConnect();
    }

    if (currentChainId === chainConfig.chainId.toString()) {
      alert(`You are already on the ${chainConfig.name} network.`);
      return;
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainIdHex = "0x" + chainConfig.chainId.toString(16);
      const blockExplorerUrls = chainConfig.blockExplorerUrls?.length
        ? chainConfig.blockExplorerUrls
        : null;

      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: chainIdHex,
            chainName: chainConfig.name,
            rpcUrls: chainConfig.rpc,
            blockExplorerUrls: blockExplorerUrls,
            nativeCurrency: chainConfig.nativeCurrency,
          },
        ]);

        await provider.send("wallet_switchEthereumChain", [
          { chainId: chainIdHex },
        ]);
        alert(`${chainConfig.name} added and switched successfully`);
        setCurrentChainId(chainConfig.chainId.toString());
      } catch (error) {
        console.error("Failed to add or switch the chain:", error);
      }
    } else {
      console.error("MetaMask connection failed");
    }
  };

  const getButtonLabel = () => {
    if (isConnected && currentChainId === chainConfig.chainId.toString()) {
      return "Connected";
    }
    return isConnected ? `Switch to ${chainConfig.name}` : "Connect and Switch";
  };

  return (
    <button
      onClick={handleAddOrSwitchChain}
      className="border border-green-300 text-gray-400 px-2 rounded-md flex items-center"
    >
      <Image src={metamaskfox} width={32} height={32} alt="metamaskfox" />
      {getButtonLabel()}
    </button>
  );
};

export default AddChainButton;
