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
  const SolidityStandard: React.FC<PageProps> = ({ address, licenseType }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
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
  const [payload, setPayload] = useState({
    compiler_version: "",
    license_type: "",
    contract_name: "",
    autodetect_constructor_args: true,
    files: [] as File[],
  });
  const [constructorArgs, setConstructorArgs] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setPayload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPayload((prev) => ({
        ...prev,
        files: Array.from(files),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("compiler_version", payload.compiler_version);
    formData.append("license_type", licenseType);
    formData.append("contract_name", payload.contract_name);
    formData.append(
      "autodetect_constructor_args",
      String(payload.autodetect_constructor_args)
    );
    formData.append("constructor_args", constructorArgs);
    payload.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      await addressService.verifyContract(address, "standard-input", formData);
      setSuccess("Contract verification submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
      <div className="">
           <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Contract Name
            </label>
            <input
              type="text"
              name="contract_name"
              value={payload.contract_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter contract name"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compiler Version
            </label>
            <select
              name="compiler_version"
              value={payload.compiler_version}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue focus:border-blue"
              required
            >
              <option value="">Select Compiler Version</option>
              {config &&
                Object.entries(config.solidity_compiler_versions).map(
                  ([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  )
                )}
            </select>
          </div>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="autodetect_constructor_args"
            checked={payload.autodetect_constructor_args}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Autodetect Constructor Arguments
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Constructor Arguments
          </label>
          <textarea
            name="constructor_args"
            value={constructorArgs}
            onChange={(e) => setConstructorArgs(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter constructor arguments if any"
          />
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
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            multiple
          />
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
      </div>
    </form>
      </div>
   
  );
};

export default SolidityStandard;
