"use client";

import Layout from "@/components/newui/Layout";
import React, { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";
import { addressService } from "@/components/newui/utils/apiroutes";

interface ContractConfig {
  verification_options: string[];
  solidity_compiler_versions: string[];
  vyper_compiler_versions: string[];
  solidity_evm_versions: string[];
  license_types: Record<string, number>;
}

interface VerificationData {
  hash: string;
  compiler_version: string;
  source_code: string;
  is_optimization_enabled: boolean;
  is_yul_contract: boolean;
  evm_version: string;
  license_type: string;
  constructor_arguments?: string;
}

interface VerificationResponse {
  status: string;
  message: string;
  result?: any;
}

interface PageProps {
  params: {
    address: string;
  };
}

const ContractVerification: React.FC<PageProps> = ({ params }) => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<string>("");
  const [compilerType, setCompilerType] = useState<"solidity" | "vyper">(
    "solidity"
  );
  const [selectedLicense, setSelectedLicense] = useState<number>(0);
  const [compilerVersion, setCompilerVersion] = useState<string>("");
  const [evmVersion, setEvmVersion] = useState<string>("default");
  const [isYulContract, setIsYulContract] = useState<boolean>(false);
  const [optimizationEnabled, setOptimizationEnabled] =
    useState<boolean>(false);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [constructorArgs, setConstructorArgs] = useState<string>("");
  const [hasConstructorArgs, setHasConstructorArgs] = useState<boolean>(false);
  const [verificationData, setVerificationData] =
    useState<VerificationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await addressService.getContractConfig();
      setConfig(response as ContractConfig);
      if (response.solidity_compiler_versions?.length > 0) {
        setCompilerVersion(response.solidity_compiler_versions[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch configuration"
      );
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (config) {
      if (
        compilerType === "solidity" &&
        config.solidity_compiler_versions.length > 0
      ) {
        setCompilerVersion(config.solidity_compiler_versions[0]);
      } else if (
        compilerType === "vyper" &&
        config.vyper_compiler_versions.length > 0
      ) {
        setCompilerVersion(config.vyper_compiler_versions[0]);
      }
    }
  }, [config, compilerType]);

  const handleSubmit = async (): Promise<void> => {
    if (!compilerVersion || !params.address) {
      setError("Missing required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const method = verificationMethod.toLowerCase().replace(/ /g, "-");

    const data: VerificationData = {
      hash: params.address,
      compiler_version: compilerVersion,
      source_code: sourceCode,
      is_optimization_enabled: optimizationEnabled,
      is_yul_contract: isYulContract,
      evm_version: evmVersion,
      license_type: selectedLicense.toString(),
    };

    if (hasConstructorArgs && constructorArgs) {
      data.constructor_arguments = constructorArgs;
    }

    try {
      const response = await addressService.verifyContract(
        params.address,
        method,
        data
      );
      setVerificationData(response as VerificationResponse);
      alert(`Contract Verification Started`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      console.error("Verification failed:", err);
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
          <div className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Verification Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Method*
                </label>
                <select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                >
                  <option value="">Select verification method</option>
                  {config.verification_options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Compiler Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compiler Type*
                  </label>
                  <select
                    value={compilerType}
                    onChange={(e) =>
                      setCompilerType(e.target.value as "solidity" | "vyper")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                  >
                    <option value="solidity">Solidity</option>
                    <option value="vyper">Vyper</option>
                  </select>
                </div>

                {/* Compiler Version */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compiler Version*
                  </label>
                  <select
                    value={compilerVersion}
                    onChange={(e) => setCompilerVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                  >
                    {(compilerType === "solidity"
                      ? config.solidity_compiler_versions
                      : config.vyper_compiler_versions
                    ).map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                </div>

                {/* License Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Type*
                  </label>
                  <select
                    value={selectedLicense}
                    onChange={(e) => setSelectedLicense(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                  >
                    {Object.entries(config.license_types).map(
                      ([key, value]) => (
                        <option key={key} value={value}>
                          {key.replace(/_/g, " ")}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* EVM Version */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    EVM Version*
                  </label>
                  <select
                    value={evmVersion}
                    onChange={(e) => setEvmVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                  >
                    {config.solidity_evm_versions.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optimization and Yul Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optimizationEnabled}
                      onChange={() =>
                        setOptimizationEnabled(!optimizationEnabled)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Optimization
                    </span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Enable optimization for contract compilation
                  </p>
                </div>

                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isYulContract}
                      onChange={() => setIsYulContract(!isYulContract)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Yul Contract
                    </span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Is this a Yul contract?
                  </p>
                </div>
              </div>

              {/* Source Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Code*
                </label>
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue font-mono"
                  placeholder="Enter the contract source code here..."
                />
              </div>

              {/* Constructor Arguments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Constructor Arguments
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasConstructorArgs}
                      onChange={() =>
                        setHasConstructorArgs(!hasConstructorArgs)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {hasConstructorArgs && (
                  <input
                    type="text"
                    value={constructorArgs}
                    onChange={(e) => setConstructorArgs(e.target.value)}
                    placeholder="Enter ABI-encoded constructor arguments"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue font-mono"
                  />
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
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
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </button>
                {error && (
                  <div className="mt-4 text-red-600 text-sm">{error}</div>
                )}
                {verificationData && (
                  <div className="mt-4 text-green-600 text-sm">
                    {verificationData.status}: {verificationData.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContractVerification;

// import Layout from "@/components/newui/Layout";
// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { addressService } from "@/components/newui/utils/apiroutes";

// interface PageProps {
//   params: {
//     address: string;
//   };
// }

// const Verification: React.FC<PageProps> = ({ params }) => {
//   const [config, setConfig] = useState<any>(null);
//   const [verificationMethod, setVerificationMethod] = useState<string>("");
//   const [compilerType, setCompilerType] = useState<string>("solidity");
//   const [selectedLicense, setSelectedLicense] = useState<number>(0);
//   const [compilerVersion, setCompilerVersion] = useState<string>("");
//   const [evmVersion, setEvmVersion] = useState<string>("default");
//   const [isYulContract, setIsYulContract] = useState<boolean>(false);
//   const [optimizationEnabled, setOptimizationEnabled] = useState<boolean>(false);
//   const [sourceCode, setSourceCode] = useState<string>("");
//   const [constructorArgs, setConstructorArgs] = useState<string>("");
//   const [hasConstructorArgs, setHasConstructorArgs] = useState<boolean>(false); // New state
//   const [verificationData, setVerificationData] = useState<any>(null);

//   // Fetch config data
//   const fetchData = async () => {
//     try {
//       const response = await addressService.getContractConfig();
//       setConfig(response);
//       if (response.solidity_compiler_versions?.length > 0) {
//         setCompilerVersion(response.solidity_compiler_versions[0]);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Update compiler version when compiler type changes
//   useEffect(() => {
//     if (config) {
//       if (compilerType === "solidity" && config.solidity_compiler_versions.length > 0) {
//         setCompilerVersion(config.solidity_compiler_versions[0]);
//       } else if (compilerType === "vyper" && config.vyper_compiler_versions.length > 0) {
//         setCompilerVersion(config.vyper_compiler_versions[0]);
//       }
//     }
//   }, [config, compilerType]);

//   // Handle verification submission
//   const handleSubmit = async () => {
//     if (!compilerVersion) {
//       console.error("Please select a compiler version.");
//       return;
//     }

//     if (!params.address) {
//       console.error("Contract address is undefined");
//       return;
//     }

//     const method = verificationMethod.toLowerCase().replace(/ /g, "-");

//     const data: any = {
//       hash: params.address,
//       compiler_version: compilerVersion,
//       source_code: sourceCode,
//       is_optimization_enabled: optimizationEnabled,
//       is_yul_contract: isYulContract,
//       evm_version: evmVersion,
//       license_type: selectedLicense.toString(),
//     };

//     // Only include constructor_arguments if hasConstructorArgs is true and arguments are provided
//     if (hasConstructorArgs && constructorArgs) {
//       data.constructor_arguments = constructorArgs;
//     }

//     try {
//       const response = await addressService.verifyContract(params.address, method, data);
//       setVerificationData(response);
//     } catch (err) {
//       console.error("Verification failed:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Layout>
//       <h1>Verify Smart Contract</h1>
//       {config && (
//         <div>
//           <h2>Contract Configuration</h2>
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div>
//               <label>License Type</label>
//               <select
//                 value={selectedLicense}
//                 onChange={(e) => setSelectedLicense(Number(e.target.value))}
//               >
//                 {Object.entries(config.license_types).map(([key, value]) => (
//                   <option key={key} value={value as number}>
//                     {key.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Verification Method</label>
//               <select
//                 value={verificationMethod}
//                 onChange={(e) => setVerificationMethod(e.target.value)}
//               >
//                 {config.verification_options.map((option: string) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {verificationMethod && (
//               <div>
//                 <label>Compiler Type</label>
//                 <select
//                   value={compilerType}
//                   onChange={(e) => setCompilerType(e.target.value)}
//                 >
//                   <option value="solidity">Solidity</option>
//                   <option value="vyper">Vyper</option>
//                 </select>
//               </div>
//             )}
//             {compilerType === "solidity" && (
//               <div>
//                 <label>Compiler Version</label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                 >
//                   {config.solidity_compiler_versions.map((version: string) => (
//                     <option key={version} value={version}>
//                       {version}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             {compilerType === "vyper" && (
//               <div>
//                 <label>Compiler Version</label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                 >
//                   {config.vyper_compiler_versions.map((version: string) => (
//                     <option key={version} value={version}>
//                       {version}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             <div>
//               <label>EVM Version</label>
//               <select
//                 value={evmVersion}
//                 onChange={(e) => setEvmVersion(e.target.value)}
//               >
//                 {config.solidity_evm_versions.map((version: string) => (
//                   <option key={version} value={version}>
//                     {version}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Is Yul Contract</label>
//               <input
//                 type="checkbox"
//                 checked={isYulContract}
//                 onChange={() => setIsYulContract(!isYulContract)}
//               />
//             </div>
//             <div>
//               <label>Optimization Enabled</label>
//               <input
//                 type="checkbox"
//                 checked={optimizationEnabled}
//                 onChange={() => setOptimizationEnabled(!optimizationEnabled)}
//               />
//             </div>
//             <div>
//               <label>Source Code</label>
//               <textarea
//                 value={sourceCode}
//                 onChange={(e) => setSourceCode(e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Constructor Arguments Provided</label>
//               <select
//                 value={hasConstructorArgs ? "Yes" : "No"}
//                 onChange={(e) => setHasConstructorArgs(e.target.value === "Yes")}
//               >
//                 <option value="No">No</option>
//                 <option value="Yes">Yes</option>
//               </select>
//             </div>
//             {hasConstructorArgs && (
//               <div>
//                 <label>Enter Constructor Arguments</label>
//                 <input
//                   type="text"
//                   value={constructorArgs}
//                   onChange={(e) => setConstructorArgs(e.target.value)}
//                 />
//               </div>
//             )}
//             <button type="button" onClick={handleSubmit}>
//               Verify Contract
//             </button>
//           </form>
//         </div>
//       )}
//       {verificationData && (
//         <div>
//           <h2>Verification Result</h2>
//           <pre>{JSON.stringify(verificationData, null, 2)}</pre>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default Verification;
