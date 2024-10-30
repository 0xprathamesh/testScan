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

const VyperMultiParts: React.FC<PageProps> = ({ address, licenseType }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [payload, setPayload] = useState({
    files: [] as File[],
    compiler_version: "",
    evm_version: "",
    license_type: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPayload((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(files)],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setPayload((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

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

    const formData = new FormData();
    formData.append("license_type", licenseType);
    formData.append("compiler_version", payload.compiler_version);
    formData.append("evm_version", payload.evm_version);
    payload.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      const response = await addressService.verifyContract(
        address,
        "vyper-multi-part",
        formData
      );
      setSuccess("Contract verification submitted successfully.");
      console.log(response)
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
            value={payload.evm_version}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {config?.vyper_evm_versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Standard JSON Input
        </label>
        <input
          type="file"
          name="standardInput"
          onChange={handleFileChange}
          accept=".json"
          multiple
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        {payload.files.length > 0 && (
          <ul className="space-y-2">
            {payload.files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
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

export default VyperMultiParts;
