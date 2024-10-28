import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { xdcTestnet } from "./utils/CustomChain";



export const config = createConfig(
  getDefaultConfig({
    appName: "ConnectKit Next.js demo",
    chains: [xdcTestnet],

    transports: {
      [xdcTestnet.id]: http(
        `https://rpc.ankr.com/multichain/6944333ba8fa52fa3f28576862e5d2ea1b9568a72a3207c76956b6f335db4fc0`
      ),
    },

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);
const hey = "Prathamesh Here" // trial purpose variable only

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}



// import React, { useState, useEffect } from "react";
// import { InfoIcon } from "lucide-react";
// import { addressService } from "@/components/newui/utils/apiroutes";
// import Layout from "@/components/newui/Layout";

// interface ContractConfig {
//   verification_options: string[];
//   solidity_compiler_versions: string[];
//   vyper_compiler_versions: string[];
//   solidity_evm_versions: string[];
//   license_types: Record<string, number>;
// }

// interface ContractLibrary {
//   name: string;
//   address: string;
// }

// interface PageProps {
//   params: {
//     address: string;
//   };
// }

// const ContractVerification: React.FC<PageProps> = ({ params }) => {
//   const [config, setConfig] = useState<ContractConfig | null>(null);
//   const [verificationMethod, setVerificationMethod] = useState<string>("");
//   const [compilerVersion, setCompilerVersion] = useState<string>("");
//   const [evmVersion, setEvmVersion] = useState<string>("default");
//   const [isYulContract, setIsYulContract] = useState<boolean>(false);
//   const [optimizationEnabled, setOptimizationEnabled] = useState<boolean>(false);
//   const [sourceCode, setSourceCode] = useState<string>("");
//   const [contractName, setContractName] = useState<string>("");
//   const [standardJsonInput, setStandardJsonInput] = useState<string>("");
//   const [libraries, setLibraries] = useState<ContractLibrary[]>([]);
//   const [tryFetchArgs, setTryFetchArgs] = useState<boolean>(false);
//   const [mainInterface, setMainInterface] = useState<File | null>(null);
//   const [sourceFiles, setSourceFiles] = useState<File[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [submitData, setSubmitData] = useState<any | null>(null)

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await addressService.getContractConfig();
//       setConfig(response as ContractConfig);
//       if (response.solidity_compiler_versions?.length > 0) {
//         setCompilerVersion(response.solidity_compiler_versions[0]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch configuration");
//     }
//   };

//   const addLibrary = () => {
//     setLibraries([...libraries, { name: "", address: "" }]);
//   };

//   const updateLibrary = (index: number, field: 'name' | 'address', value: string) => {
//     const newLibraries = [...libraries];
//     newLibraries[index][field] = value;
//     setLibraries(newLibraries);
//   };

//   const removeLibrary = (index: number) => {
//     setLibraries(libraries.filter((_, i) => i !== index));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isMainInterface: boolean = false) => {
//     if (isMainInterface) {
//       setMainInterface(e.target.files?.[0] || null);
//     } else {
//       setSourceFiles(Array.from(e.target.files || []));
//     }
//   };

//   const renderVerificationFields = () => {
//     switch (verificationMethod) {
//       case "flattened-code":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compiler Version
//                 </label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_compiler_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   EVM Version
//                 </label>
//                 <select
//                   value={evmVersion}
//                   onChange={(e) => setEvmVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_evm_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-center space-x-6">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={isYulContract}
//                   onChange={() => setIsYulContract(!isYulContract)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="text-sm text-gray-700">Is Yul Contract</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={optimizationEnabled}
//                   onChange={() => setOptimizationEnabled(!optimizationEnabled)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="text-sm text-gray-700">Optimization Enabled</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={tryFetchArgs}
//                   onChange={() => setTryFetchArgs(!tryFetchArgs)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="text-sm text-gray-700">Try To Fetch Arguments</span>
//               </label>
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Contract Libraries
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addLibrary}
//                   className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
//                 >
//                   Add Library
//                 </button>
//               </div>
//               {libraries.map((lib, index) => (
//                 <div key={index} className="grid grid-cols-2 gap-4 mb-2">
//                   <input
//                     type="text"
//                     value={lib.name}
//                     onChange={(e) => updateLibrary(index, 'name', e.target.value)}
//                     placeholder="Library Name"
//                     className="px-3 py-2 border border-gray-300 rounded-md"
//                   />
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={lib.address}
//                       onChange={(e) => updateLibrary(index, 'address', e.target.value)}
//                       placeholder="Library Address"
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeLibrary(index)}
//                       className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Source Code
//               </label>
//               <textarea
//                 value={sourceCode}
//                 onChange={(e) => setSourceCode(e.target.value)}
//                 rows={12}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
//                 placeholder="Enter the contract source code here..."
//               />
//             </div>
//           </div>
//         );

//       case "standard-input":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Contract Name
//                 </label>
//                 <input
//                   type="text"
//                   value={contractName}
//                   onChange={(e) => setContractName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compiler Version
//                 </label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_compiler_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="flex items-center space-x-2 mb-4">
//                 <input
//                   type="checkbox"
//                   checked={tryFetchArgs}
//                   onChange={() => setTryFetchArgs(!tryFetchArgs)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="text-sm text-gray-700">Try To Fetch Arguments</span>
//               </label>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Standard JSON Input
//               </label>
//               <textarea
//                 value={standardJsonInput}
//                 onChange={(e) => setStandardJsonInput(e.target.value)}
//                 rows={12}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
//                 placeholder="Enter the standard JSON input here..."
//               />
//             </div>
//           </div>
//         );

//       case "vyper-code":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Contract Name
//                 </label>
//                 <input
//                   type="text"
//                   value={contractName}
//                   onChange={(e) => setContractName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compiler Version
//                 </label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.vyper_compiler_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   EVM Version
//                 </label>
//                 <select
//                   value={evmVersion}
//                   onChange={(e) => setEvmVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_evm_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Source Code
//               </label>
//               <textarea
//                 value={sourceCode}
//                 onChange={(e) => setSourceCode(e.target.value)}
//                 rows={12}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
//                 placeholder="Enter the Vyper source code here..."
//               />
//             </div>
//           </div>
//         );

//       case "vyper-standard-input":
//         return (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Compiler Version
//               </label>
//               <select
//                 value={compilerVersion}
//                 onChange={(e) => setCompilerVersion(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 {config?.vyper_compiler_versions.map((version) => (
//                   <option key={version} value={version}>{version}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Standard JSON Input
//               </label>
//               <textarea
//                 value={standardJsonInput}
//                 onChange={(e) => setStandardJsonInput(e.target.value)}
//                 rows={12}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
//                 placeholder="Enter the Vyper standard JSON input here..."
//               />
//             </div>
//           </div>
//         );

//       case "vyper-multi-part":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compiler Version
//                 </label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.vyper_compiler_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   EVM Version
//                 </label>
//                 <select
//                   value={evmVersion}
//                   onChange={(e) => setEvmVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_evm_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Main Interface (.vy or .json)
//               </label>
//               <input
//                 type="file"
//                 accept=".vy,.json"
//                 onChange={(e) => handleFileChange(e, true)}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         );
    

//       case "multi-part":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Compiler Version
//                 </label>
//                 <select
//                   value={compilerVersion}
//                   onChange={(e) => setCompilerVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_compiler_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   EVM Version
//                 </label>
//                 <select
//                   value={evmVersion}
//                   onChange={(e) => setEvmVersion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   {config?.solidity_evm_versions.map((version) => (
//                     <option key={version} value={version}>{version}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-center space-x-6">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={optimizationEnabled}
//                   onChange={() => setOptimizationEnabled(!optimizationEnabled)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="text-sm text-gray-700">Optimization Enabled</span>
//               </label>
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Contract Libraries
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addLibrary}
//                   className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
//                 >
//                   Add Library
//                 </button>
//               </div>
//               {libraries.map((lib, index) => (
//                 <div key={index} className="grid grid-cols-2 gap-4 mb-2">
//                   <input
//                     type="text"
//                     value={lib.name}
//                     onChange={(e) => updateLibrary(index, 'name', e.target.value)}
//                     placeholder="Library Name"
//                     className="px-3 py-2 border border-gray-300 rounded-md"
//                   />
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={lib.address}
//                       onChange={(e) => updateLibrary(index, 'address', e.target.value)}
//                       placeholder="Library Address"
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeLibrary(index)}
//                       className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Source Files (.sol or .yul)
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 accept=".sol,.yul"
//                 onChange={handleFileChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };
//   const handleSubmit = async () => {
//     // Validate required fields before submitting
//     if (!compilerVersion || !params.address) {
//       setError("Missing required fields: compiler version or address");
//       return;
//     }
  
//     setIsSubmitting(true);
//     setError(null);
  
//     try {
//       const formData = new FormData();
//       formData.append('hash', params.address);
//       formData.append('verification_method', verificationMethod);
//       formData.append('compiler_version', compilerVersion); 

//       switch (verificationMethod) {
//         case "flattened-code":
//           formData.append('is_yul_contract', String(isYulContract));
//           formData.append('evm_version', evmVersion);
//           formData.append('is_optimization_enabled', String(optimizationEnabled));
//           formData.append('constructor_arguments', String(tryFetchArgs));
//           formData.append('source_code', sourceCode);
//           libraries.forEach((lib, index) => {
//             formData.append(`libraries[${index}][name]`, lib.name);
//             formData.append(`libraries[${index}][address]`, lib.address);
//           });
//           break;
  
//         case "standard-input":
//           formData.append('contract_name', contractName);
//           formData.append('try_fetch_args', String(tryFetchArgs));
//           formData.append('standard_json_input', standardJsonInput);
//           break;
  
//         case "vyper-code":
//           formData.append('contract_name', contractName);
//           formData.append('evm_version', evmVersion);
//           formData.append('source_code', sourceCode);
//           break;
  
//         case "vyper-standard-input":
//           formData.append('standard_json_input', standardJsonInput);
//           break;
  
//         case "vyper-multi-part":
//           formData.append('evm_version', evmVersion);
//           if (mainInterface) {
//             formData.append('main_interface', mainInterface);
//           }
//           break;
  
//         case "multi-part":
//           formData.append('evm_version', evmVersion);
//           formData.append('optimization_enabled', String(optimizationEnabled));
//           libraries.forEach((lib, index) => {
//             formData.append(`libraries[${index}][name]`, lib.name);
//             formData.append(`libraries[${index}][address]`, lib.address);
//           });
//           Array.from(sourceFiles).forEach((file, index) => {
//             formData.append(`source_files[${index}]`, file);
//           });
//           break;
//       }
  
//       const response = await addressService.verifyContract(params.address, verificationMethod, formData);
//       setSubmitData(JSON.stringify(response));
//       console.log(response);
//       alert('Contract verification initiated successfully');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Verification failed");
//       console.error("Verification failed:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   // const handleSubmit = async () => {
//   //   setIsSubmitting(true);
//   //   setError(null);

//   //   try {
//   //     const formData = new FormData();
      
 
//   //     formData.append('address', params.address);
//   //     formData.append('verification_method', verificationMethod);
//   //     formData.append('compiler_version', compilerVersion);

//   //     // Method-specific fields
//   //     switch (verificationMethod) {
//   //       case "flattened-code":
//   //         formData.append('is_yul_contract', String(isYulContract));
//   //         formData.append('compiler_version',compilerVersion)
//   //         formData.append('evm_version', evmVersion);
//   //         formData.append('optimization_enabled', String(optimizationEnabled));
//   //         formData.append('try_fetch_args', String(tryFetchArgs));
//   //         formData.append('source_code', sourceCode);
//   //         libraries.forEach((lib, index) => {
//   //           formData.append(`libraries[${index}][name]`, lib.name);
//   //           formData.append(`libraries[${index}][address]`, lib.address);
//   //         });
//   //         break;

//   //       case "standard-input":
//   //         formData.append('contract_name', contractName);
//   //         formData.append('try_fetch_args', String(tryFetchArgs));
//   //         formData.append('standard_json_input', standardJsonInput);
//   //         break;

//   //       case "vyper-code":
//   //         formData.append('contract_name', contractName);
//   //         formData.append('evm_version', evmVersion);
//   //         formData.append('source_code', sourceCode);
//   //         break;

//   //       case "vyper-standard-input":
//   //         formData.append('standard_json_input', standardJsonInput);
//   //         break;

//   //       case "vyper-multi-part":
//   //         formData.append('evm_version', evmVersion);
//   //         if (mainInterface) {
//   //           formData.append('main_interface', mainInterface);
//   //         }
//   //         break;

//   //       case "multi-part":
//   //         formData.append('evm_version', evmVersion);
//   //         formData.append('optimization_enabled', String(optimizationEnabled));
//   //         libraries.forEach((lib, index) => {
//   //           formData.append(`libraries[${index}][name]`, lib.name);
//   //           formData.append(`libraries[${index}][address]`, lib.address);
//   //         });
//   //         Array.from(sourceFiles).forEach((file, index) => {
//   //           formData.append(`source_files[${index}]`, file);
//   //         });
//   //         break;
//   //     }

//   //     const response = await addressService.verifyContract(params.address, verificationMethod, formData);
//   //     setSubmitData(JSON.stringify(response))
//   //     console.log(response)
//   //     alert('Contract verification initiated successfully');
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err.message : "Verification failed");
//   //     console.error("Verification failed:", err);
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   if (!config) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-pulse">Loading configuration...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8 max-w-4xl font-chivo">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="border-b border-gray-200 p-6">
//             <h1 className="text-2xl font-bold text-blue-600">
//               Verify & Publish Contract Source Code
//             </h1>
//             <div className="mt-2 flex items-center gap-2 text-gray-600">
//               <InfoIcon className="w-4 h-4" />
//               <span>Contract Address: {params.address}</span>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="p-6">
//             <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//               {/* Verification Method */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Verification Method*
//                 </label>
//                 <select
//                   value={verificationMethod}
//                   onChange={(e) => setVerificationMethod(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
//                 >
//                   <option value="">Select verification method</option>
//                   {config.verification_options.map((option) => (
//                     <option key={option} value={option}>
//                       {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Dynamic Fields based on Verification Method */}
//               {renderVerificationFields()}

//               {/* Error Message */}
//               {error && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                   <div className="flex items-center">
      
//                     <div className="ml-3">
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Submit Button */}
//               {verificationMethod && (
//                 <div className="mt-6">
//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit for Verification"}
//                   </button>
//                 </div>
//               )}
//               {submitData}
//             </form>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ContractVerification;



// import Layout from "@/components/newui/Layout";
// import React, { useState, useEffect } from "react";
// import { InfoIcon } from "lucide-react";
// import { addressService } from "@/components/newui/utils/apiroutes";

// interface ContractConfig {
//   verification_options: string[];
//   solidity_compiler_versions: string[];
//   vyper_compiler_versions: string[];
//   solidity_evm_versions: string[];
//   license_types: Record<string, number>;
// }

// interface VerificationData {
//   hash: string;
//   compiler_version: string;
//   source_code: string;
//   is_optimization_enabled: boolean;
//   is_yul_contract: boolean;
//   evm_version: string;
//   license_type: string;
//   constructor_arguments?: string;
// }

// interface VerificationResponse {
//   status: string;
//   message: string;
//   result?: any;
// }

// interface PageProps {
//   params: {
//     address: string;
//   };
// }

// const ContractVerification: React.FC<PageProps> = ({ params }) => {
//   const [config, setConfig] = useState<ContractConfig | null>(null);
//   const [verificationMethod, setVerificationMethod] = useState<string>("");
//   const [compilerType, setCompilerType] = useState<"solidity" | "vyper">(
//     "solidity"
//   );
//   const [selectedLicense, setSelectedLicense] = useState<number>(0);
//   const [compilerVersion, setCompilerVersion] = useState<string>("");
//   const [evmVersion, setEvmVersion] = useState<string>("default");
//   const [isYulContract, setIsYulContract] = useState<boolean>(false);
//   const [optimizationEnabled, setOptimizationEnabled] =
//     useState<boolean>(false);
//   const [sourceCode, setSourceCode] = useState<string>("");
//   const [constructorArgs, setConstructorArgs] = useState<string>("");
//   const [hasConstructorArgs, setHasConstructorArgs] = useState<boolean>(false);
//   const [verificationData, setVerificationData] =
//     useState<VerificationResponse | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async (): Promise<void> => {
//     try {
//       const response = await addressService.getContractConfig();
//       setConfig(response as ContractConfig);
//       if (response.solidity_compiler_versions?.length > 0) {
//         setCompilerVersion(response.solidity_compiler_versions[0]);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch configuration"
//       );
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (config) {
//       if (
//         compilerType === "solidity" &&
//         config.solidity_compiler_versions.length > 0
//       ) {
//         setCompilerVersion(config.solidity_compiler_versions[0]);
//       } else if (
//         compilerType === "vyper" &&
//         config.vyper_compiler_versions.length > 0
//       ) {
//         setCompilerVersion(config.vyper_compiler_versions[0]);
//       }
//     }
//   }, [config, compilerType]);

//   const handleSubmit = async (): Promise<void> => {
//     if (!compilerVersion || !params.address) {
//       setError("Missing required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     const method = verificationMethod.toLowerCase().replace(/ /g, "-");

//     const data: VerificationData = {
//       hash: params.address,
//       compiler_version: compilerVersion,
//       source_code: sourceCode,
//       is_optimization_enabled: optimizationEnabled,
//       is_yul_contract: isYulContract,
//       evm_version: evmVersion,
//       license_type: selectedLicense.toString(),
//     };

//     if (hasConstructorArgs && constructorArgs) {
//       data.constructor_arguments = constructorArgs;
//     }

//     try {
//       const response = await addressService.verifyContract(
//         params.address,
//         method,
//         data
//       );
//       setVerificationData(response as VerificationResponse);
//       alert(`Contract Verification Started`);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Verification failed");
//       console.error("Verification failed:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!config) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-pulse">Loading configuration...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8 max-w-4xl font-chivo">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="border-b border-gray-200 p-6">
//             <h1 className="text-2xl font-bold text-blue">
//               Verify & Publish Contract Source Code
//             </h1>
//             <div className="mt-2 flex items-center gap-2 text-gray-600">
//               <InfoIcon className="w-4 h-4" />
//               <span>Contract Address: {params.address}</span>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="p-6">
//             <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//               {/* Verification Method */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Verification Method*
//                 </label>
//                 <select
//                   value={verificationMethod}
//                   onChange={(e) => setVerificationMethod(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
//                 >
//                   <option value="">Select verification method</option>
//                   {config.verification_options.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Two Column Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Compiler Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Compiler Type*
//                   </label>
//                   <select
//                     value={compilerType}
//                     onChange={(e) =>
//                       setCompilerType(e.target.value as "solidity" | "vyper")
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
//                   >
//                     <option value="solidity">Solidity</option>
//                     <option value="vyper">Vyper</option>
//                   </select>
//                 </div>

//                 {/* Compiler Version */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Compiler Version*
//                   </label>
//                   <select
//                     value={compilerVersion}
//                     onChange={(e) => setCompilerVersion(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
//                   >
//                     {(compilerType === "solidity"
//                       ? config.solidity_compiler_versions
//                       : config.vyper_compiler_versions
//                     ).map((version) => (
//                       <option key={version} value={version}>
//                         {version}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* License Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     License Type*
//                   </label>
//                   <select
//                     value={selectedLicense}
//                     onChange={(e) => setSelectedLicense(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
//                   >
//                     {Object.entries(config.license_types).map(
//                       ([key, value]) => (
//                         <option key={key} value={value}>
//                           {key.replace(/_/g, " ")}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </div>

//                 {/* EVM Version */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     EVM Version*
//                   </label>
//                   <select
//                     value={evmVersion}
//                     onChange={(e) => setEvmVersion(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
//                   >
//                     {config.solidity_evm_versions.map((version) => (
//                       <option key={version} value={version}>
//                         {version}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Optimization and Yul Toggles */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={optimizationEnabled}
//                       onChange={() =>
//                         setOptimizationEnabled(!optimizationEnabled)
//                       }
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     <span className="ml-3 text-sm font-medium text-gray-700">
//                       Optimization
//                     </span>
//                   </label>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Enable optimization for contract compilation
//                   </p>
//                 </div>

//                 <div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={isYulContract}
//                       onChange={() => setIsYulContract(!isYulContract)}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     <span className="ml-3 text-sm font-medium text-gray-700">
//                       Yul Contract
//                     </span>
//                   </label>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Is this a Yul contract?
//                   </p>
//                 </div>
//               </div>

//               {/* Source Code */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Source Code*
//                 </label>
//                 <textarea
//                   value={sourceCode}
//                   onChange={(e) => setSourceCode(e.target.value)}
//                   rows={12}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue font-mono"
//                   placeholder="Enter the contract source code here..."
//                 />
//               </div>

//               {/* Constructor Arguments */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Constructor Arguments
//                   </label>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={hasConstructorArgs}
//                       onChange={() =>
//                         setHasConstructorArgs(!hasConstructorArgs)
//                       }
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//                 {hasConstructorArgs && (
//                   <input
//                     type="text"
//                     value={constructorArgs}
//                     onChange={(e) => setConstructorArgs(e.target.value)}
//                     placeholder="Enter ABI-encoded constructor arguments"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue font-mono"
//                   />
//                 )}
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <svg
//                         className="h-5 w-5 text-red-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* Submit Button */}
//               <div className="mt-6">
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit for Verification"}
//                 </button>
//                 {error && (
//                   <div className="mt-4 text-red-600 text-sm">{error}</div>
//                 )}
//                 {verificationData && (
//                   <div className="mt-4 text-green-600 text-sm">
//                     {verificationData.status}: {verificationData.message}
//                   </div>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ContractVerification;
// //    interface VerificationData = {
// //       hash: string,
// //       compiler_version: string,
// //       source_code: string,
// //       is_optimization_enabled: boolean
// //       is_yul_contract: boolean,
// // constructor_arguments:string
// //       evm_version: string,
// //       license_type: string,
// //     };
