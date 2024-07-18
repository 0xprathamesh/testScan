"use client";
import ContractInteraction from "@/components/ContractInteraction";
import Navbar from "@/components/Navbar";
import { fetchAbi } from "@/services/fetchAbi";
import { ConnectKitButton } from "connectkit";
import { log } from "console";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Home = () => {
  const account = useAccount();

  console.log(account.address);
  const [contractAddress, setContractAddress] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [readFunctions, setReadFunctions] = useState<any[]>([]);
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
      console.log(abi);
      setAbi(abi);
      const readFns = abi.filter(
        (fn: any) => fn.type === "function" && fn.stateMutability === "view"
      );
      setReadFunctions(readFns);
    } catch (error) {
      console.error("Error fetching ABI:", error);
    }
  };
  const handleReadFunctions = async (fn: any) => {
    if (!account.isConnected) {
      console.error("No wallet Connected");
      return;
    }
    if (!signer) {
      console.error("No signer available");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const params = inputs[fn.name] || [];

      console.log(`Calling function ${fn.name}`);
      const result = await contract[fn.name](...params);
      console.log(`Result from function ${fn.name}:`, result);
      setResults((prevResults) => ({
        ...prevResults,
        [fn.name]: result,
      }));
    } catch (error: any) {
      console.error(`Error reading function ${fn.name}:`, error);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      if (error.data) {
        console.error("Error data:", error.data);
      }
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

  return (
    <div className="">
      <Navbar />
      <section className="w-full px-32 py-8">
        {/* <h1 className="text-center text-lg text-gray-700">
          Interact w/ Contract Functions
        </h1>
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
          <div className="px-18 flex items-center justify-center gap-8 border-b-2  ">
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
                activeTab === "Read Contract"
                  ? "bg-gray-200 rounded-md my-1"
                  : ""
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
            {activeTab === "ABI" && (
              <div>
                <h2>ABI</h2>
                <pre>{JSON.stringify(abi, null, 2)}</pre>
              </div>
            )}

 {activeTab === 'Read Contract' && (
              <div className="results">
                {readFunctions.map((fn, index) => (
                  <div key={index} className="read-function">
                    <h2>{fn.name}</h2>
                    {fn.inputs && fn.inputs.length > 0 && (
                      <div className="inputs mb-4">
                        {fn.inputs.map((input: any, idx: number) => (
                          <div key={idx} className="mb-2">
                            <label>
                              {input.name || `Input ${idx + 1}`}:
                            </label>
                            <input
                              type="text"
                              placeholder={input.type}
                              className="ml-2 p-1 border rounded-md"
                              onChange={(e) =>
                                handleInputChange(fn.name, idx, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleReadFunctions(fn)}
                      className="bg-green-400 text-white px-4 py-2 rounded-md"
                    >
                      Call {fn.name}
                    </button>
                    {results[fn.name] && (
                      <p>Result: {JSON.stringify(results[fn.name])}</p>
                    )}
                  </div>
                ))}
              </div>
            )}


            {activeTab === "Write Contract" && (
              <div>
                <h2>Write Contract</h2>
               
              </div>
            )}
          </div>
        </div> */}
        <h1 className="text-center text-lg text-gray-700">
          Interact w/ Contract Functions
        </h1>
        <ContractInteraction />

      </section>
    </div>
  );
};
export default Home;
