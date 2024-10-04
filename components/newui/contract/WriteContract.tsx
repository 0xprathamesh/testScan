"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "../utils/apiroutes";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface WriteProps {
  address: string;
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

const WriteContract: React.FC<WriteProps> = ({ address }) => {
  const [contract, setContract] = useState<Method[] | null>(null);
  const [inputs, setInputs] = useState<Record<string, Record<number, string>>>({});
  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWriteFunctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await addressService.verifiedAddresses(
          `/${address}/methods-write?is_custom_abi=false`
        );
        // Filter out non-function types and fallback/receive functions
        const functions = response.filter((method: Method) => 
          method.type === 'function' && method.name
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
      fetchWriteFunctions();
    }
  }, [address]);

  const handleInputChange = (method: string, index: number, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [index]: value,
      },
    }));
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
                {input.internalType !== input.type && 
                  <span className="text-xs ml-1">internal type: {input.internalType}</span>
                }
              </span>
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange(method.name, index, e.target.value)}
              placeholder={`Enter ${input.type}`}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    );
  };

  const handleWriteFunction = async (method: Method) => {
    const inputData = inputs[method.name] || {};
    console.log(`Calling method ${method.name} with inputs:`, inputData);
    // Implement actual contract interaction here
    alert("Please connect your wallet to execute this transaction.");
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
        <h2 className="text-xl font-semibold">Write Contract</h2>
      </div>
      
      {!contract || contract.length === 0 ? (
        <div className="p-4 flex items-center text-amber-600">
          <AlertCircle className="mr-2" size={20} />
          <p>No write functions found for this contract.</p>
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
                  <h3 className="font-medium text-blue-600">{method.name}</h3>
                  <p className="text-xs text-gray-500">Method ID: {method.method_id}</p>
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
                    onClick={() => handleWriteFunction(method)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Write
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    {method.stateMutability === "payable" && (
                      <span className="text-orange-500 mr-2">[Payable]</span>
                    )}
                    <span className="text-gray-400">
                      {method.stateMutability}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WriteContract;
