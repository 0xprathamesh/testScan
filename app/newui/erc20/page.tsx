"use client";
import React from "react";
import Layout from "@/components/newui/Layout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AssetsTable from "@/components/newui/AssetsTable";

import { ArrowRight, Check, X } from "lucide-react";

import { FiCopy } from "react-icons/fi";
import { parseAddress } from "@/lib/helpers";
const Tokens = () => {
  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="text-sm">Tokens</div>
          <h1 className="text-xs text-blue font-bold">Home</h1>
        </div>
      </div>
      <AssetsTable quantity={250} />
    </Layout>
  );
};

export default Tokens;
