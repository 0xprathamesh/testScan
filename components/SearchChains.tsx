"use client";
import React, { useState, ChangeEvent } from "react";

interface SearchChainsProps {
  handleSearch: (query: string) => void;
}

const SearchChains: React.FC<SearchChainsProps> = ({ handleSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="text-center my-8">
      <input
        className="px-4 py-2 border rounded-lg w-96"
        type="text"
        placeholder="Ex. Ethereum"
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchChains;
