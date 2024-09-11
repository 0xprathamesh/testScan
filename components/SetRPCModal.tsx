"use client";
// components/SetRPCModal.tsx
import { useState, useEffect } from 'react';

interface SetRPCModalProps {
  onClose: () => void;
}

const SetRPCModal: React.FC<SetRPCModalProps> = ({ onClose }) => {
  const [rpcUrl, setRpcUrl] = useState<string>('');

  const handleSave = () => {
    if (rpcUrl.trim() !== '') {
      localStorage.setItem('rpcUrl', rpcUrl.trim());
      onClose();
    } else {
      alert('Please enter a valid RPC URL');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Enter RPC URL</h2>
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          placeholder="https://your-rpc-url.com"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue bg-blue"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetRPCModal;
