"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "../utils/apiroutes";

interface ContractConfig {
  verification_options: string[];
  solidity_compiler_versions: string[];
  vyper_compiler_versions: string[];
  solidity_evm_versions: string[];
  license_types: Record<string, number>;
}

interface PageProps {
  address: string;
  licenseType: string;
}

const SoliditySourceCode: React.FC<PageProps> = ({ address, licenseType }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [payload, setPayload] = useState({
    hash: address,
    compiler_version: "",
    source_code: "",
    is_optimization_enabled: false,
    is_yul_contract: false,
    optimization_runs: "",
    autodetect_constructor_arguments: false,
    constructor_arguments: "",
    license_type: "",
    evmVersion: "",
    contractLibrary: "",
    tryFetchArgs: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setPayload((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!payload.compiler_version) {
      setError("Compiler version is required.");
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append("license_type", licenseType);
    formData.append("compiler_version", payload.compiler_version);
    formData.append("source_code", payload.source_code);
    formData.append("evmVersion", payload.evmVersion);

    try {
      const response = await addressService.verifyContract(
        address,
        "flattened-code",
        formData
      );
      console.log(response);
      setSuccess("Contract verification submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-chivo">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Compiler Version
          </label>
          <select
            name="compiler_version"
            value={payload.compiler_version}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            <option value="" disabled>
              Select Compiler Version
            </option>
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
            value={payload.evmVersion}
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
            checked={payload.is_yul_contract}
            onChange={handleInputChange}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Is Yul Contract</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="tryFetchArgs"
            checked={payload.tryFetchArgs}
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
            name="is_optimization_enabled"
            checked={payload.is_optimization_enabled}
            onChange={handleInputChange}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Optimization Enabled</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contract Library
          </label>
          <input
            type="text"
            name="contractLibrary"
            value={payload.contractLibrary}
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
            name="source_code"
            value={payload.source_code}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 h-32 font-mono"
            placeholder="Enter source code"
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        className="btn bg-blue text-white rounded p-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Verify Contract"}
      </button>
    </form>
  );
};

export default SoliditySourceCode;
