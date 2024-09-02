// components/RPCModal.tsx
import React, { useState } from 'react';

const RPCModal: React.FC<{ onSetRPC: (rpc: string) => void }> = ({ onSetRPC }) => {
  const [rpcUrl, setRpcUrl] = useState<string>('');

  const handleSubmit = () => {
    if (rpcUrl) {
      localStorage.setItem('userRPC', rpcUrl);
      onSetRPC(rpcUrl);
    }
  };

  return (
    <div className="modal">
      <h2>Enter RPC URL</h2>
      <input
        type="text"
        value={rpcUrl}
        onChange={(e) => setRpcUrl(e.target.value)}
        placeholder="https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
      />
      <button onClick={handleSubmit}>Set RPC</button>
    </div>
  );
};

export default RPCModal;
