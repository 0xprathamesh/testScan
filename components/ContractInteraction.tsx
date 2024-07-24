import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { useAccount } from "wagmi";
import { fetchAbi } from "@/services/fetchAbi";
import AbiTab from "./AbiTab";
import ReadContractTab from "./ReadContractTab";
import WriteContractTab from "./WriteContractTab";
import { useActiveAccount,useActiveWalletConnectionStatus } from "thirdweb/react";

const ContractInteraction = () => {
  const account = useActiveAccount();
  const isConnected = useActiveWalletConnectionStatus();
  console.log(isConnected);
  
  const address = account?.address;
  const [contractAddress, setContractAddress] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [readFunctions, setReadFunctions] = useState<any[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<any[]>([]);

  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("ABI");
  const [inputs, setInputs] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const fetchSigner = async () => {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
      };
      fetchSigner();
    } else {
      console.error("Please Install MetaMask!");
    }
  }, []);

  const handleFetchAbi = async () => {
    try {
      const abi = await fetchAbi(contractAddress);
      setAbi(abi);
  
      const readFns = abi.filter(
        (fn: any) => fn.type === "function" && fn.stateMutability === "view"
      );
      setReadFunctions(readFns);
  
      const writeFns = abi.filter(
        (fn: any) => fn.type === "function" && fn.stateMutability !== "view"
      );
      setWriteFunctions(writeFns);
    } catch (error) {
      console.error("Error fetching ABI:", error);
    }
  };
  

  const handleInputChange = (fnName: string, idx: number, value: string) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      if (!newInputs[fnName]) {
        newInputs[fnName] = [];
      }
      newInputs[fnName][idx] = value;
      return newInputs;
    });
  };

  const handleReadFunctions = async (fn: any) => {
    if (isConnected !== "connected") {
      console.error("No Wallet Connected");
      return;
      
    }
    if (!signer) {
      console.error("No signer available");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const params = inputs[fn.name] || [];
      console.log(`Calling function ${fn.name} with params:`, params);

      const result = await contract[fn.name](...params);
      console.log(`Result from ${fn.name}:`, result);

      setResults((prevResults) => ({
        ...prevResults,
        [fn.name]: result,
      }));
    } catch (error: any) {
      console.error(`Error reading function ${fn.name}:`, error);
    }
  };

  const handleWriteFunctions = async (fn: any) => {
    // if (!account.isConnected) {
    //   console.error("No wallet Connected");
    //   return;
    // }
    if (isConnected !== "connected") {
      console.error("No Wallet Connected");
      return;
      
    }
    if (!signer) {
      console.error("No signer available");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const params = inputs[fn.name] || [];

      const result = await contract[fn.name](...params);
      setResults((prevResults) => ({
        ...prevResults,
        [fn.name]: result,
      }));
      console.log(JSON.stringify(results[fn.name], null, 2))
console.log("hello");

    } catch (error: any) {
      console.error(`Error writing function ${fn.name}:`, error);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-8 mt-10">
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address"
          className="text-md p-2 w-80 rounded-md border"
        />
        <button
          onClick={handleFetchAbi}
          className="bg-green-400 p-2 text-lg rounded-lg w-30"
        >
          Fetch ABI
        </button>
      </div>
      <div className="mt-8 border-2">
        <div className="px-18 flex items-center justify-center gap-8 border-b-2">
          <button
            className={`px-4 py-2 ${
              activeTab === "ABI" ? "bg-gray-200 rounded-md my-1" : ""
            }`}
            onClick={() => setActiveTab("ABI")}
          >
            ABI
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Read Contract" ? "bg-gray-200 rounded-md my-1" : ""
            }`}
            onClick={() => setActiveTab("Read Contract")}
          >
            Read Contract
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Write Contract"
                ? "bg-gray-200 rounded-md my-1"
                : ""
            }`}
            onClick={() => setActiveTab("Write Contract")}
          >
            Write Contract
          </button>

        </div>
        <div className="my-8 mx-4">
          {activeTab === "ABI" && <AbiTab abi={abi} />}
          {activeTab === "Read Contract" && (
            <ReadContractTab
              readFunctions={readFunctions}
              inputs={inputs}
              handleInputChange={handleInputChange}
              handleReadFunctions={handleReadFunctions}
              results={results}
            />
          )}
          {activeTab === "Write Contract" && (
            <WriteContractTab
              writeFunctions={writeFunctions}
              inputs={inputs}
              handleInputChange={handleInputChange}
              handleWriteFunctions={handleWriteFunctions}
              results={results}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default ContractInteraction;
