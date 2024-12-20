import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { addressService } from "../utils/apiroutes";

interface ReadProps {
  address: string;
  abi?: JSON;
}

interface Input {
  internalType: string;
  name: string;
  type: string;
}

interface Output {
  internalType: string;
  name: string;
  type: string;
}

interface Method {
  inputs: Input[];
  method_id: string;
  name: string;
  outputs: Output[];
  stateMutability: string;
  type: string;
}

const ReadContract: React.FC<ReadProps> = ({ address }) => {
  const account = useActiveAccount();
  const isConnected = useActiveWalletConnectionStatus();

  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [contractAbi, setContractAbi] = useState<any[] | null>(null);
  const [contract, setContract] = useState<Method[] | null>(null);
  const [inputs, setInputs] = useState<Record<string, Record<number, string>>>({});
  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadFunctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await addressService.verifiedAddresses(
          `/${address}/methods-read?is_custom_abi=false`
        );
        setContractAbi(response);
        const functions = response.filter(
          (method: Method) =>
            method.type === "function" &&
            method.name &&
            method.stateMutability === "view"
        );
        setContract(functions);
      } catch (err) {
        console.error("Error fetching contract methods:", err);
        setError("Failed to fetch contract methods");
        setContract([]);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchReadFunctions();
    }
  }, [address]);

  useEffect(() => {
    const web3 = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      } else {
        console.error("Please Install MetaMask!");
      }
    };
    web3();
  }, []);

  const handleInputChange = (method: string, index: number, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [index]: value,
      },
    }));
  };

  const handleReadFunction = async (method: Method) => {
    if (!contractAbi || !signer) {
      console.error("Contract ABI or signer not available");
      alert("Please connect your wallet to execute this transaction.");
      return;
    }

    const inputData = inputs[method.name] || {};
    const params = Object.values(inputData);

    const contractInstance = new ethers.Contract(address, contractAbi, signer);

    try {
      const result = await contractInstance[method.name](...params);
      setResults((prev) => ({
        ...prev,
        [method.name]: result,
      }));
      console.log(`Result for ${method.name}:`, result);
    } catch (err) {
      console.error(`Error executing method ${method.name}:`, err);
    }
  };

  const toggleMethod = (methodName: string) => {
    setExpandedMethods((prev) => ({
      ...prev,
      [methodName]: !prev[methodName],
    }));
  };

  const renderInputs = (method: Method) => {
    if (!expandedMethods[method.name]) return null;

    return (
      <div className="mt-4 space-y-4">
        {method.inputs.map((input, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              {input.name}
              <span className="text-gray-400">
                ({input.type})
                {input.internalType !== input.type && (
                  <span className="text-xs ml-1">
                    internal type: {input.internalType}
                  </span>
                )}
              </span>
            </label>
            <input
              type="text"
              onChange={(e) =>
                handleInputChange(method.name, index, e.target.value)
              }
              placeholder={`Enter ${input.type}`}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderResult = (method: Method) => {
    if (!results[method.name]) return null;

    return (
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <h4 className="font-medium">Result:</h4>
        <p>{JSON.stringify(results[method.name], null, 2)}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center text-red-600">
          <AlertCircle className="mr-2" size={20} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Read Contract</h2>
      </div>

      {!contract || contract.length === 0 ? (
        <div className="p-4 flex items-center text-amber-600">
          <AlertCircle className="mr-2" size={20} />
          <p>No read functions found for this contract.</p>
        </div>
      ) : (
        <div className="divide-y">
          {contract.map((method, index) => (
            <div key={index} className="p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleMethod(method.name)}
              >
                <div>
                  <h3 className="font-medium text-blue">{method.name}</h3>
                  <p className="text-xs text-gray-500">
                    Method ID: {method.method_id}
                  </p>
                </div>
                {expandedMethods[method.name] ? (
                  <ChevronUp className="text-gray-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500" size={20} />
                )}
              </div>

              {renderInputs(method)}

              {expandedMethods[method.name] && (
                <div className="mt-4">
                  <button
                    onClick={() => handleReadFunction(method)}
                    className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-dark transition-colors"
                  >
                    Read
                  </button>
                  {renderResult(method)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadContract;


// import React, { useState, useEffect } from "react";
// import { addressService } from "../utils/apiroutes";
// import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
// import { ethers } from "ethers";
// import {
//   useActiveAccount,
//   useActiveWalletConnectionStatus,
// } from "thirdweb/react";
// interface ReadProps {
//   address: string;
//   abi?: JSON;
// }

// interface Input {
//   internalType: string;
//   name: string;
//   type: string;
// }

// interface Output {
//   internalType: string;
//   name: string;
//   type: string;
// }

// interface Method {
//   inputs: Input[];
//   method_id: string;
//   name: string;
//   outputs: Output[];
//   stateMutability: string;
//   type: string;
// }

// const ReadContract: React.FC<ReadProps> = ({ address }) => {
//   const account = useActiveAccount();
//   const isConnected = useActiveWalletConnectionStatus();

//   const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
//   const [contractAbi, setContractAbi] = useState<any[] | null>(null);
//   const [contract, setContract] = useState<Method[] | null>(null);
//   const [inputs, setInputs] = useState<Record<string, Record<number, string>>>({});
//   const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});
//   const [results, setResults] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchReadFunctions = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await addressService.verifiedAddresses(
//           `/${address}/methods-read?is_custom_abi=false`
//         );
//         setContractAbi(response);
       
//         const functions = response.filter((method: Method) => 
//           method.type === 'function' && method.name && method.stateMutability === 'view'
//         );
//         setContract(functions);
//       } catch (err) {
//         console.error("Error fetching contract methods:", err);
//         setError("Failed to fetch contract methods");
//         setContract([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (address) {
//       fetchReadFunctions();
//     }
//   }, [address]);

//   const handleInputChange = (method: string, index: number, value: string) => {
//     setInputs((prev) => ({
//       ...prev,
//       [method]: {
//         ...prev[method],
//         [index]: value,
//       },
//     }));
//   };

//   const toggleMethod = (methodName: string) => {
//     setExpandedMethods((prev) => ({
//       ...prev,
//       [methodName]: !prev[methodName],
//     }));
//   };

//   const renderInputs = (method: Method) => {
//     if (!expandedMethods[method.name]) return null;

//     return (
//       <div className="mt-4 space-y-4">
//         {method.inputs.map((input, index) => (
//           <div key={index} className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">
//               {input.name} 
//               <span className="text-gray-400">
//                 ({input.type})
//                 {input.internalType !== input.type && 
//                   <span className="text-xs ml-1">internal type: {input.internalType}</span>
//                 }
//               </span>
//             </label>
//             <input
//               type="text"
//               onChange={(e) => handleInputChange(method.name, index, e.target.value)}
//               placeholder={`Enter ${input.type}`}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const handleReadFunction = async (method: Method) => {
//     const inputData = inputs[method.name] || {};
//     console.log(`Calling method ${method.name} with inputs:`, inputData);
//     setResults(prev => ({
//       ...prev,
//       [method.name]: `Mock result for ${method.name}`
//     }));
//   };

//   const renderResult = (method: Method) => {
//     if (!results[method.name]) return null;

//     return (
//       <div className="mt-4 p-2 bg-gray-100 rounded">
//         <h4 className="font-medium">Result:</h4>
//         <pre className="text-sm overflow-x-auto">{JSON.stringify(results[method.name], null, 2)}</pre>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-48">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 flex items-center text-red-600">
//           <AlertCircle className="mr-2" size={20} />
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-semibold">Read Contract</h2>
//       </div>
      
//       {!contract || contract.length === 0 ? (
//         <div className="p-4 flex items-center text-amber-600">
//           <AlertCircle className="mr-2" size={20} />
//           <p>No read functions found for this contract.</p>
//         </div>
//       ) : (
//         <div className="divide-y">
//           {contract.map((method, index) => (
//             <div key={index} className="p-4">
//               <div 
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleMethod(method.name)}
//               >
//                 <div>
//                   <h3 className="font-medium text-green-600">{method.name}</h3>
//                   <p className="text-xs text-gray-500">Method ID: {method.method_id}</p>
//                 </div>
//                 {expandedMethods[method.name] ? (
//                   <ChevronUp className="text-gray-500" size={20} />
//                 ) : (
//                   <ChevronDown className="text-gray-500" size={20} />
//                 )}
//               </div>
              
//               {renderInputs(method)}
              
//               {expandedMethods[method.name] && (
//                 <div className="mt-4">
//                   <button
//                     onClick={() => handleReadFunction(method)}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
//                   >
//                     Read
//                   </button>
//                 </div>
//               )}

//               {renderResult(method)}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReadContract;

