"use client";
import React, { useEffect, useState } from "react";
import { tokenService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Link from "next/link";

interface HoldersProps {
  address: string;
}
interface Holder {
  address: string;
  quantity: number;
  percentage: number;
}
const TokenHolders: React.FC<HoldersProps> = ({ address }) => {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolders = async () => {
        try {
            const response = await tokenService.getTokenHolders(address, `?limit=50&page=1`);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };
  });
  return <div>TokenHolders</div>;
};

export default TokenHolders;
