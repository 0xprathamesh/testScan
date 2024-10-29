"use client";
import { InfoIcon } from "lucide-react";
import Layout from "@/components/newui/Layout";
import { addressService } from "@/components/newui/utils/apiroutes";
import React, { useEffect, useState } from "react";
import SolidityStandard from "@/components/newui/contract/SolidityStandard";
import SoliditySourcify from "@/components/newui/contract/SoliditySourcify";
import SoliditySourceCode from "@/components/newui/contract/SoliditySourceCode";
import VyperSourcify from "@/components/newui/contract/VyperSourcify";

interface PageProps {
  params: {
    address: string;
  };
}

interface ContractConfig {
  verification_options: string[];
  solidity_compiler_versions: string[];
  vyper_compiler_versions: string[];
  solidity_evm_versions: string[];
  license_types: Record<string, number>;
}

const VerifyContract: React.FC<PageProps> = ({ params }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>("");

  const verification_options = [
    "Solidity (Flattened Source Code)",
    "Solidity (Standard JSON Input)",
    "Solidity (Sourcify)",
    "Solidity (Multi Parts File)",
    "Solidity (Foundry)",
    "Solidity (Hardhat)",
    "Vyper (Contract)",
    "Vyper (Multi Parts File)",
    "Vyper (Standard JSON Input)",
  ];

  const fetchConfig = async () => {
    try {
      const response = await addressService.getContractConfig();
      setConfig(response as ContractConfig);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);
  const renderDynamicComponent = () => {
    switch (selectedMethod) {
      case "Solidity (Standard JSON Input)":
        return (
          <SolidityStandard address={params.address} licenseType={selectedLicenseType} />
        );
        case "Solidity (Sourcify)":
          return (
            <SoliditySourcify address={params.address} licenseType={selectedLicenseType} />
          );
          case "Solidity (Flattened Source Code)":
            return (
              <SoliditySourceCode address={params.address} licenseType={selectedLicenseType} />
            );
            case "Vyper (Multi Parts File)":
              return (
                <VyperSourcify address={params.address} licenseType={selectedLicenseType} />
              );
          
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl font-chivo">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-blue">
              Verify & Publish Contract Source Code
            </h1>
            <div className="mt-2 flex items-center gap-2 text-gray-600">
              <InfoIcon className="w-4 h-4" />
              <span>Contract Address: {params.address}</span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Type
                </label>
                <select
                  name="selectedLicense"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue focus:border-blue"
                  required
                  onChange={(e) => setSelectedLicenseType(e.target.value)}
                >
                  <option value="">Select License Type</option>
                  {config &&
                    Object.entries(config.license_types).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key.replace(/_/g, " ")}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Method
                </label>
                <select
                  name="verificationMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  <option value="">Select verification method</option>
                  {verification_options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              {renderDynamicComponent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyContract;
