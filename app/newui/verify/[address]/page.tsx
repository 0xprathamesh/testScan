
"use client";
import { addressService } from "@/components/newui/utils/apiroutes";
import Layout from "@/components/newui/Layout";
import React, { useEffect, useState } from "react";

interface PageProps {
  params: {
    address: string;
  };
}

const VerifyContract: React.FC<PageProps> = ({ params }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    formData.append("license_type", payload.license_type);
    formData.append("contract_name", payload.contract_name);
    formData.append("autodetect_constructor_args", String(payload.autodetect_constructor_args));
    formData.append("constructor_args", constructorArgs);
    payload.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      await addressService.verifyContract(params.address, "standard-input", formData);
      setSuccess("Contract verification submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-96">
        <h1>Verify Contract Using Standard Input</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Compiler Version</label>
            <input
              type="text"
              name="compiler_version"
              value={payload.compiler_version}
              onChange={handleChange}
              className="input"
              placeholder="v0.8.28+commit.7893614a"
              required
            />
          </div>
          <div>
            <label>License Type</label>
            <input
              type="text"
              name="license_type"
              value={payload.license_type}
              onChange={handleChange}
              className="input"
              placeholder="unlicense"
              required
            />
          </div>
          <div>
            <label>Contract Name</label>
            <input
              type="text"
              name="contract_name"
              value={payload.contract_name}
              onChange={handleChange}
              className="input"
              placeholder="HelloWorld"
              required
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="autodetect_constructor_args"
                checked={payload.autodetect_constructor_args}
                onChange={handleChange}
              />
              Autodetect Constructor Arguments
            </label>
          </div>
          <div>
            <label>Constructor Arguments</label>
            <textarea
              name="constructor_args"
              value={constructorArgs}
              onChange={(e) => setConstructorArgs(e.target.value)}
              className="input"
              placeholder="Enter constructor arguments if any"
            />
          </div>
          <div>
            <label>Upload Files</label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="input"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Verify Contract"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default VerifyContract;
