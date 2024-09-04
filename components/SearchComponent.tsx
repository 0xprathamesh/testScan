"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
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
    // Check if input is an Ethereum address (42 characters, starts with '0x')
    else if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setSuggestions([`Address: ${value}`]);
    }
    // Check if input is a transaction hash (66 characters, starts with '0x')
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
      <form className="max-w-xl mx-auto">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <GoSearch className="w-5 h-5 mb-2 text-gray-500" />
      </div>
          <input
            type="search"
            id="default-search"
            value={input}
            onChange={handleChange}
            className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-[#e3e3fa] mb-2 outline-none placeholder:font-chivo"
            placeholder="Search transactions/blocks/address/tokens"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-[#e3e3fa] border border-gray-300 rounded shadow-md font-chivo">
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
      </form>
    </div>
  );
};

export default SearchComponent;
