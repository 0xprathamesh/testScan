"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchCode } from 'lucide-react';
import { IoIosSearch } from "react-icons/io";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query) return;

    // Determine the type of query and perform the redirection
    let path = '';
    if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
      // It's an Ethereum address
      path = `/newui/address/${query}`;
    } else if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
      // It's a transaction hash
      path = `/newui/tx/${query}`;
    } else if (/^\d+$/.test(query)) {
      // It's a block number
      path = `/newui/block/${query}`;
    } else {
      alert('Invalid search query. Please enter a valid address, txhash, or block number.');
      return;
    }

    // Redirect to the respective page without clearing the input immediately
    await router.push(path);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center mx-auto w-96">
      <label htmlFor="simple-search" className="sr-only">Search</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
            />
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search address, txhash, or block number..."
          required
        />
      </div>
      <button
        type="submit"
        className="p-2 ms-2 font-medium text-black rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
      >

<IoIosSearch className='w-6 h-6' />
      </button>
    </form>
  );
};

export default SearchBar;
