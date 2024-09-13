"use client";

import { useState } from 'react';

interface SetRPCModalProps {
  onClose: () => void;
}

const SetRPCModal: React.FC<SetRPCModalProps> = ({ onClose }) => {
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const [coinGeckoApiUrl, setCoinGeckoApiUrl] = useState<string>('');

  const handleSave = () => {
    if (rpcUrl.trim() !== '' && coinGeckoApiUrl.trim() !== '') {
      localStorage.setItem('rpcUrl', rpcUrl.trim());
      localStorage.setItem('coinGeckoApiUrl', coinGeckoApiUrl.trim());
      onClose();
    } else {
      alert('Please enter both a valid RPC URL and CoinGecko API URL');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-inter mb-4">Enter RPC URL and CoinGecko API URL</h2>

        {/* Input for RPC URL */}
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          placeholder="https://your-rpc-url.com"
          className="w-full p-2 border border-gray-300 rounded placeholder:font-chivo placeholder:text-sm placeholder:leading-3 mb-4"
        />

        {/* Input for CoinGecko API URL */}
        <input
          type="text"
          value={coinGeckoApiUrl}
          onChange={(e) => setCoinGeckoApiUrl(e.target.value)}
          placeholder="https://api.coingecko.com/api/v3/coins/[coin_id]"
          className="w-full p-2 border border-gray-300 rounded placeholder:font-chivo placeholder:text-sm placeholder:leading-3"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetRPCModal;
