import React, { useState, useEffect } from "react";
// Detaisl Dialog box with rpc data
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { useRpcStatus, useRpcLatency } from "../utils/useRpcStatus"; // Import the utility functions

interface Chain {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  infoURL: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

interface DetailsDialogProps {
  chain: Chain;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({ chain }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rpcStatuses, setRpcStatuses] = useState<{ [key: string]: boolean }>({});
  const [rpcLatencies, setRpcLatencies] = useState<{ [key: string]: number | undefined }>({});

  useEffect(() => {
    if (showDetails) {
      const fetchRpcData = async () => {
        const statuses = await useRpcStatus(chain.rpc);
        const latencies = await useRpcLatency(chain.rpc);

        // Convert null values to undefined
        const updatedLatencies: { [key: string]: number | undefined } = {};
        for (const key in latencies) {
          updatedLatencies[key] = latencies[key] ?? undefined;
        }

        setRpcStatuses(statuses);
        setRpcLatencies(updatedLatencies);
      };

      fetchRpcData();
    }
  }, [showDetails, chain.rpc]);

  return (
    <DropdownMenu onOpenChange={(isOpen) => setShowDetails(isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Details</Button>
      </DropdownMenuTrigger>
      {showDetails && (
        <DropdownMenuContent className="min-w-full">
          <DropdownMenuLabel className="text-center">RPC URLs</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-60">
            <ul className="list-none space-y-2">
              {chain.rpc.map((rpcUrl) => (
                <React.Fragment key={rpcUrl}>
                  <li
                    className={`px-2 ${
                      rpcStatuses[rpcUrl] ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {rpcUrl} - {rpcStatuses[rpcUrl] ? "Working" : "Not Working"} -{" "}
                    {rpcLatencies[rpcUrl] !== undefined
                      ? `${rpcLatencies[rpcUrl]} ms`
                      : "Latency not available"}
                  </li>
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))}
            </ul>
          </ScrollArea>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default DetailsDialog;