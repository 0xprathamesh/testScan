"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchComponent: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInput(value);

    if (/^\d+$/.test(value)) {
      setSuggestions([`Block Number: ${value}`]);
    }

    else if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setSuggestions([`Address: ${value}`]);
    }

    else if (/^0x([A-Fa-f0-9]{64})$/.test(value)) {
      setSuggestions([`Transaction Hash: ${value}`]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const [type, value] = suggestion.split(": ").map((str) => str.trim());
    
    switch (type) {
      case "Block Number":
        router.push(`/block/${value}`);
        break;
      case "Address":
        router.push(`/address/${value}`);
        break;
      case "Transaction Hash":
        router.push(`/tx/${value}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Enter address, block number, or transaction hash"
        className="min-w-[50%] p-2 border border-gray-300 rounded mb-2 mx-auto "
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded shadow-md w-[50%] ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
