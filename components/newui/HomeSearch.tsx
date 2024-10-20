"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoSearch } from 'react-icons/go';
import Copyable from "@/components/elements/Copyable";

interface SearchComponentProps {
  onSearch?: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInput(value);

    if (/^\d+$/.test(value)) {
      setSuggestions([`Block Number: ${value}`]);
    } else if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setSuggestions([`Address: ${value}`]);
    } else if (/^0x([A-Fa-f0-9]{64})$/.test(value)) {
      setSuggestions([`Transaction Hash: ${value}`]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const [type, value] = suggestion.split(': ').map(str => str.trim());

    setRecentSearches(prev => {
      const updatedSearches = [suggestion, ...prev.filter(item => item !== suggestion)].slice(0, 3);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      return updatedSearches;
    });

    // Navigate based on the search type
    switch (type) {
      case 'Block Number':
        router.push(`/newui/block/${value}`);
        break;
      case 'Address':
        router.push(`/newui/address/${value}`);
        break;
      case 'Transaction Hash':
        router.push(`/newui/tx/${value}`);
        break;
      default:
        break;
    }

    if (onSearch) {
      onSearch(suggestion);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-mplus">What are you looking for?</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <GoSearch className="w-5 h-5 mb-2 text-gray-500" />
          </div>
          <input
            type="search"
            id="default-search"
            value={input}
            onChange={handleChange}
            className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md mb-2 outline-none placeholder:font-chivo"
            placeholder="Search transactions/blocks/address/tokens"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md font-chivo">
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

      <div className="mt-4">
        <h2 className="text-lg font-normal font-inter mb-2">Recent searches:</h2>
        <div className="">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <span
                key={index}
                className="text-md text-gray-600 bg-purple-100 px-2 py-1 rounded-xl leading flex w-48 text-center items-center mb-2"
              >
                <Copyable text={search} copyText={search} className="" />
              </span>
            ))
          ) : (
            <p className="text-gray-500">No recent searches</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;