"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "../utils/apiroutes";

interface ReadProps {
  address: string;
}

const ReadContracts: React.FC<ReadProps> = ({ address }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchReadFunctions = async () => {
      try {
        const response = await addressService.verifiedAddresses(`/${address}/methods-read-proxy?is_custom_abi=false`);
        setContract(response); 
      } catch (err) {
        console.log(err);
      }
    };

    if (address) {
      fetchReadFunctions(); 
    }
  }, [address]); 

  return (
    <div>
      {contract ? (
        <pre>   {JSON.stringify(contract, null, 2)}</pre>
      ) : (
        <p>Loading contract data...</p>
      )}
    </div>
  );
};

export default ReadContracts;
