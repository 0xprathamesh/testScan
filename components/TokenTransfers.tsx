"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "./newui/utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiCopy, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { IoCubeOutline } from "react-icons/io5";
import { getTimeAgo } from "@/lib/helpers";

interface TokenTransfer {
  token: {
    symbol: string;
    name: string;
    icon_url: string;
  };
  from: string;
  to: string;
  value: string;
  hash: string;
  type: string;
  method: string;
  blockNumber: number;
  timestamp: string;
}

interface TokenTransfersProps {
  address: string;
}

const TokenTransfers: React.FC<TokenTransfersProps> = ({ address }) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenTransfers = async () => {
      try {
        const response = await addressService.getTokenTransfers(
          address,
          `?limit=50&page=1`
        );
        console.log(response.items);

        const tokenTransferData = response.items.map((item: any) => ({
          token: {
            symbol: item.token?.symbol || "Unknown",
            name: item.token?.name || "Unknown Token",
            icon_url: item.token?.symbol
              ? `https://cdn.blocksscan.io/tokens/img/${item.token.symbol}.png`
              : "",
          },
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value:
            (parseInt(item.total.value) / 10 ** item.token.decimals).toFixed(
              4
            ) || 0,
          hash: item.tx_hash || "N/A",
          type: item.type,
          method: item.method_name,
          blockNumber: item.block_number,
          timestamp: item.timestamp,
        }));

        setTransfers(tokenTransferData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token transfers:", err);
        setError("Error fetching token transfers");
        setLoading(false);
      }
    };

    fetchTokenTransfers();
  }, [address]);

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderSkeleton = () => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-200 w-8 h-8"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-36 h-4 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 w-[869px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Token Transfers</h2>
          <ChevronUp className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Token Transfers</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transfers.map((transfer, index) => {
          const direction =
            transfer.to.toLowerCase() === address.toLowerCase() ? "IN" : "OUT";
          return (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="rounded-full">
                  <Image
                    src={transfer.token.icon_url}
                    width={32}
                    height={32}
                    alt={transfer.token.symbol}
                    className="w-8 h-8"
                  />
                </div>
                <div className="ml-1">
                  <p className="font-medium flex items-center">
                    {transfer.token.name}{" "}
                  </p>
                  <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                    <Link href={`/newui/tx/${transfer.hash}`}>
                      #{parseAddress(transfer.hash)}{" "}
                    </Link>
                    <FiCopy
                      className="ml-2 text-gray-400 cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(transfer.hash)
                      }
                    />
                  </p>
                </div>
              </div>
              {/* <div className="px-4 py-2">
                <p className="inline-flex items-center text-center border px-2 text-sm py-1 rounded-full">
                  <span className="inline-block rounded-full bg-green-500 h-2 w-2 mr-2"></span>
                  <span className="text-center font-chivo capitalize ">
                    {transfer.method}
                  </span>
                </p>
              </div> */}

              {/* <div className="px-6 py-4 text-sm">
                <div className="bg-black px-1 text-center rounded-md text-white flex items-center justify-around ">
                  <IoCubeOutline />
                  <Link href={`/newui/block/${transfer.blockNumber}`}>
                    {transfer.blockNumber}
                  </Link>
                </div>
              </div> */}

              <div className="flex items-center justify-between gap-x-4">
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  <Link href={`/newui/address/${transfer.from}`}>
                    {parseAddress(transfer.from)}
                  </Link>
                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(transfer.from)}
                  />
                </div>
                <FiArrowRight className="h-4 w-4" />
                <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                  <Link href={`/newui/address/${transfer.to}`}>
                    {parseAddress(transfer.to)}
                  </Link>
                  <FiCopy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(transfer.to)}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {transfer.value} {transfer.token.symbol}
                </p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(transfer.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenTransfers;
