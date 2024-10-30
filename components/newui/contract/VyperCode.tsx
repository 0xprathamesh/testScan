"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "../utils/apiroutes";

interface ContractConfig {
  verification_options: string[];
  solidity_compiler_versions: string[];
  vyper_compiler_versions: string[];
  solidity_evm_versions: string[];
  vyper_evm_versions: string[];
  license_types: Record<string, number>;
}
interface PageProps {
  address: string;
  licenseType: string;
}

const VyperCode: React.FC<PageProps> = ({ address, licenseType }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [payload, setPayload] = useState({
    compiler_version: "",
    evm_version: "",
    source_code: "",
    contract_name: "",
    constructor_args: "",
    license_type: licenseType,
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

    try {
      const response = await addressService.verifyContract(
        address,
        "vyper-code",
        payload // Pass payload directly here
      );
      console.log(response);
      if (response.message === "Smart-contract verification started") {
        setSuccess("Contract verification submitted successfully.");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //     setError(null);
  //     setSuccess(null);
  //     if (!payload.compiler_version) {
  //       setError("Compiler version is required.");
  //       setIsSubmitting(false);
  //       return;
  //     }
  //     const formData = new FormData();
  //     formData.append("license_type", licenseType);
  //     formData.append("compiler_version", payload.compiler_version.toString());
  //     formData.append("source_code", payload.source_code);
  //     formData.append("evmVersion", payload.evm_version);
  //     formData.append("contract_name", payload.contract_name);
  //     formData.append("constructor_args", payload.constructor_args);
  //     try {
  //       const response = await addressService.verifyContract(
  //         address,
  //         "vyper-code",
  //         formData
  //       );
  //       console.log(response);
  //       setSuccess("Contract verification submitted successfully.");
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Verification failed");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chivo">
              Contract Name
            </label>
            <input
              type="text"
              name="contract_name"
              value={payload.contract_name}
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
              name="compiler_version"
              value={payload.compiler_version}
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
              name="evm_version"
              value={payload.evm_version}
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
          className="btn bg-blue text-white rounded p-2 mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Verify Contract"}
        </button>
      </form>
    </div>
  );
};

export default VyperCode;
