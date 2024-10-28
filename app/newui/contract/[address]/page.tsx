"use client";
import React, { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";
import Layout from "@/components/newui/Layout";
import { addressService } from "@/components/newui/utils/apiroutes";

interface ContractConfig {
  verification_options: string[];
  solidity_compiler_versions: string[];
  vyper_compiler_versions: string[];
  solidity_evm_versions: string[];
  license_types: Record<string, number>;
}

const ContractVerification = ({ params }: { params: { address: string } }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const hardcodedMethods = ["Hardhat", "Foundry"];
  const [formData, setFormData] = useState({
    verificationMethod: "",
    selectedLicense: 0,
    compilerVersion: "",
    evmVersion: "default",
    isYulContract: false,
    optimizationEnabled: false,
    sourceCode: "",
    standardInput: "",
    constructorArgs: "",
    contractName: "",
    contractLibrary: "",
    interfaces: "",
    tryFetchArgs: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await addressService.getContractConfig();

        setConfig(response as ContractConfig);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch configuration"
        );
      }
    };
    fetchConfig();
  }, []);
  const verificationMethod = config?.verification_options
    ? [...hardcodedMethods, ...config.verification_options]
    : hardcodedMethods;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const renderMethodSpecificFields = () => {
    switch (formData.verificationMethod) {
      case "multi-part":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-chivo">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compiler Version
                </label>
                <select
                  name="compilerVersion"
                  value={formData.compilerVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_compiler_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EVM Version
                </label>
                <select
                  name="evmVersion"
                  value={formData.evmVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_evm_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="optimizationEnabled"
                  checked={formData.optimizationEnabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Optimization Enabled
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contract Library
                </label>
                <input
                  type="text"
                  name="contractLibrary"
                  value={formData.contractLibrary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Add contract library address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source Files
                </label>
                <textarea
                  name="sourceCode"
                  value={formData.sourceCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                  placeholder="Enter .sol or .yul files"
                />
              </div>
            </div>
          </>
        );

      case "vyper-multi-part":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-chivo">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compiler Version
                </label>
                <select
                  name="compilerVersion"
                  value={formData.compilerVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.vyper_compiler_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EVM Version
                </label>
                <select
                  name="evmVersion"
                  value={formData.evmVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_evm_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main Interfaces
              </label>
              <textarea
                name="interfaces"
                value={formData.interfaces}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                placeholder="Enter .vy or .json files"
              />
            </div>
          </>
        );

      case "vyper-standard-input":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-chivo">
                Compiler Version
              </label>
              <select
                name="compilerVersion"
                value={formData.compilerVersion}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              >
                {config?.vyper_compiler_versions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                JSON Input
              </label>
              <textarea
                name="standardInput"
                value={formData.standardInput}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                placeholder="Enter JSON input"
              />
            </div>
          </>
        );

      case "flattened-code":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-chivo">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compiler Version
                </label>
                <select
                  name="compilerVersion"
                  value={formData.compilerVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_compiler_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EVM Version
                </label>
                <select
                  name="evmVersion"
                  value={formData.evmVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_evm_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isYulContract"
                  checked={formData.isYulContract}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Is Yul Contract</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tryFetchArgs"
                  checked={formData.tryFetchArgs}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Try to Fetch Arguments Automatically
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="optimizationEnabled"
                  checked={formData.optimizationEnabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Optimization Enabled
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contract Library
                </label>
                <input
                  type="text"
                  name="contractLibrary"
                  value={formData.contractLibrary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Add contract library address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source Code
                </label>
                <textarea
                  name="sourceCode"
                  value={formData.sourceCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                  placeholder="Enter source code"
                />
              </div>
            </div>
          </>
        );

      case "standard-input":
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chivo">
                  Contract Name
                </label>
                <input
                  type="text"
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter contract name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compiler Version
                </label>
                <select
                  name="compilerVersion"
                  value={formData.compilerVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_compiler_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tryFetchArgs"
                  checked={formData.tryFetchArgs}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Try to Fetch Arguments Automatically
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Standard JSON Input
                </label>
                <textarea
                  name="standardInput"
                  value={formData.standardInput}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                  placeholder="Enter standard JSON input"
                />
              </div>
            </div>
          </>
        );

      case "vyper-code":
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chivo">
                  Contract Name
                </label>
                <input
                  type="text"
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter contract name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compiler Version
                </label>
                <select
                  name="compilerVersion"
                  value={formData.compilerVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.vyper_compiler_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EVM Version
                </label>
                <select
                  name="evmVersion"
                  value={formData.evmVersion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {config?.solidity_evm_versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source Code
                </label>
                <textarea
                  name="sourceCode"
                  value={formData.sourceCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
                  placeholder="Enter source code"
                />
              </div>
            </div>
          </>
        );
      case "foundry":
        return (
          <>
            <div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contract verification via Foundry
                </label>
                <pre>
                  {`
                    forge verify-contract \ --rpc-url https://xdcscan.io \
                    --verifier XDC \ --verifier-url
                    'https://rpc.xinfin.network/api/' \{params.address} \
                    [contractFile]:[contractName]
      `}
                </pre>
              </div>
            </div>
          </>
        );
      case "hardhat":
        return (
          <>
            <div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contract verification via Foundry
                </label>
                <pre>
                  {`
        const config: HardhatUserConfig = {
            solidity: "v0.8.27", // replace if necessary
            networks: {
                'Mainnet': {
                    url: 'https://xdcscan.io'
                },
            },
            XDC: {
                apiKey: {
                    'Mainnet': 'empty'
                },
            },
            customChains: [
                {
                    network: "Mainnet",
                    chainId: 50,
                    urls: {
                        apiURL: "https://rpc.xinfin.network",
                        browserURL: "https://xdcscan.io"
                    }
                }
            ]
        };
                    `}
                </pre>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const verificationData: any = {
        hash: params.address,
        license_type: formData.selectedLicense.toString(),
      };

      // Add method-specific data
      switch (formData.verificationMethod) {
        case "multi-part":
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.evm_version = formData.evmVersion;
          verificationData.is_optimization_enabled =
            formData.optimizationEnabled;
          verificationData.contract_libraries = formData.contractLibrary;
          verificationData.source_code = formData.sourceCode;
          break;

        case "vyper-multi-part":
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.evm_version = formData.evmVersion;
          verificationData.interfaces = formData.interfaces;
          break;

        case "vyper-standard-input":
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.standard_input = formData.standardInput;
          break;

        case "flattened-code":
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.evm_version = formData.evmVersion;
          verificationData.is_yul_contract = formData.isYulContract;
          verificationData.is_optimization_enabled =
            formData.optimizationEnabled;
          verificationData.contract_libraries = formData.contractLibrary;
          verificationData.source_code = formData.sourceCode;
          verificationData.try_fetch_args = formData.tryFetchArgs;
          break;

        case "standard-input":
          verificationData.contract_name = formData.contractName;
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.try_fetch_args = formData.tryFetchArgs;
          verificationData.standard_input = formData.standardInput;
          break;

        case "vyper-code":
          verificationData.contract_name = formData.contractName;
          verificationData.compiler_version = formData.compilerVersion;
          verificationData.evm_version = formData.evmVersion;
          verificationData.source_code = formData.sourceCode;
          break;
      }

      const response = await addressService.verifyContract(
        params.address,
        formData.verificationMethod.toLowerCase().replace(/ /g, "-"),
        verificationData
      );

      if (response.status === "success") {
        alert("Contract verification submitted successfully!");
      } else {
        setError(response.message || "Verification failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading configuration...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl font-chivo">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-blue">
              Verify & Publish Contract Source Code
            </h1>
            <div className="mt-2 flex items-center gap-2 text-gray-600">
              <InfoIcon className="w-4 h-4" />
              <span>Contract Address: {params.address}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Top Row - License and Verification Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Type*
                </label>
                <select
                  name="selectedLicense"
                  value={formData.selectedLicense}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue focus:border-blue"
                  required
                >
                  {config &&
                    Object.entries(config.license_types).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key.replace(/_/g, " ")}
                      </option>
                    ))}
                </select>
              </div>
              {/* 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Method*
                </label>
                <select
                  name="verificationMethod"
                  value={formData.verificationMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                  required
                >
                  <option value="">Select verification method</option>
                  {config.verification_options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Method*
                </label>
                <select
                  name="verificationMethod"
                  value={formData.verificationMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select verification method</option>
                  {/* Combine hardcoded methods with API methods */}
                  {[
                    "hardhat",
                    "foundry",
                    ...(config?.verification_options || []),
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.verificationMethod && (
              <div className="mt-6">{renderMethodSpecificFields()}</div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {formData.verificationMethod !== "foundry" &&
            formData.verificationMethod !== "hardhat" ? (
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.verificationMethod}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContractVerification;
