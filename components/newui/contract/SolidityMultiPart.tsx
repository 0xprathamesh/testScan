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

const SolidityMultiPart: React.FC<PageProps> = ({ address, licenseType }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [payload, setPayload] = useState({
    files: [] as File[],

    license_type: "",
    compiler_version: "",
    evm_version: "",
    is_optimization_enabled: false,
    libraries: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("license_type", licenseType);
    formData.append("evm_version", payload.evm_version);

    try {
      
      const librariesJson = JSON.parse(payload.libraries);
      formData.append("libraries", JSON.stringify(librariesJson));
    } catch (err) {
      setError("Libraries must be a valid JSON map.");
      setIsSubmitting(false);
      return;
    }

    payload.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      await addressService.verifyContract(address, "multi-part", formData);
      setSuccess("Contract verification submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Contract Library
        </label>
        <input
          type="text"
          name="libraries"
          value={payload.libraries}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder='{"libraryName": "0xLibraryAddress"}'
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Standard JSON Input
        </label>
        <input
          type="file"
          name="files"
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

export default SolidityMultiPart;
