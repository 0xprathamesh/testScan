"use client"
import React, { useEffect, useState } from "react";
import { addressService } from "./utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Image from "next/image";
import { IoCubeOutline } from "react-icons/io5";
import Link from "next/link"
interface PageProps {
  address: string;
}
interface Contract {
    sourcecode?: string;
    creationcode: string;
    deployedcode: string;
    abi?: string;
}

const ContractDetails: React.FC<PageProps> = ({ address }) => {
  return (
    <div>
      ContractDetails
      <div></div>
    </div>
  );
};

export default ContractDetails;
