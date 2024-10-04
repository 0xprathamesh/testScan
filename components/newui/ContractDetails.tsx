"use client";
import React, { useEffect, useState } from "react";
import { addressService } from "./utils/apiroutes"; 
import { ChevronUp, ChevronDown } from "lucide-react"; 
import { FiCopy } from "react-icons/fi";

interface PageProps {
  address: string;
}

interface Contract {
  creationcode: string;
  deployedcode: string;
}

const ContractDetails: React.FC<PageProps> = ({ address }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isDeployedOpen, setIsDeployedOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await addressService.getContract(address); 
        

        const contractData: Contract = {
          creationcode: response.creation_bytecode || "No creation code available",
          deployedcode: response.deployed_bytecode || "No deployed bytecode available",
        };

        setContract(contractData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Error fetching contract details");
        setLoading(false);
      }
    };

    fetchContractDetails(); 
  }, [address]);

  const renderSkeleton = () => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-200 w-8 h-8"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-36 h-4 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 w-[869px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Activity</h2>
          <ChevronUp className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">

      <h2 className="text-lg font-semibold mb-4">Contract Details</h2>


      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsCreationOpen(!isCreationOpen)}
        >
          <h2 className="text-md font-medium">Creation Code</h2>
          {isCreationOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {isCreationOpen && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md overflow-x-auto max-h-60">
            <pre className="text-sm text-gray-800">
              {contract?.creationcode}
            </pre>
            <FiCopy
              className="w-4 h-4 text-gray-500 cursor-pointer mt-2"
              onClick={() =>
                navigator.clipboard.writeText(contract?.creationcode || "")
              }
            />
          </div>
        )}
      </div>


      <div className="bg-white rounded-lg shadow p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsDeployedOpen(!isDeployedOpen)}
        >
          <h2 className="text-md font-medium">Deployed Bytecode</h2>
          {isDeployedOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
        {isDeployedOpen && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md overflow-auto">
            <pre className="text-sm text-gray-800 text-wrap">
              {contract?.deployedcode}
            </pre>
            <FiCopy
              className="w-4 h-4 text-gray-500 cursor-pointer mt-2"
              onClick={() =>
                navigator.clipboard.writeText(contract?.deployedcode || "")
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
