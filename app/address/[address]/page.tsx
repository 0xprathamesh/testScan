"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface PageProps {
  params: {
    address: string; // Changed to accept an address parameter
  };
}

const AddressDetails: React.FC<PageProps> = ({ params }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.address) {
      fetchAddressData(params.address);
    } else {
      setError("No Address Provided");
    }
  }, [params.address]);

  const fetchAddressData = async (address: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/0075eaf8836d41cda4346faf5dd87efe`
      );

      // Fetch the balance
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance)); // Convert from Wei to Ether

      // Fetch the transaction count (nonce)
      const transactionCount = await provider.getTransactionCount(address);
      setTransactionCount(transactionCount);

      // Fetch the code (if it's a contract)
      const code = await provider.getCode(address);
      setCode(code !== "0x" ? code : null);

      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError("An Error Occurred while fetching address data");
    }
  };

  return (
    <div>
      <h1>Address Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {balance !== null && transactionCount !== null && (
        <div>
          <p>
            <strong>Balance:</strong> {balance} ETH
          </p>
          <p>
            <strong>Transaction Count:</strong> {transactionCount}
          </p>
          {code && (
            <p>
              <strong>Contract Code:</strong> {code}
            </p>
          )}
          {!code && (
            <p>
              <strong>Address Type:</strong> Externally Owned Account (EOA)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressDetails;
