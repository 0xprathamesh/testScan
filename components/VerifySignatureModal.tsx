"use client";

import { FC, useState } from "react";

interface VerifySignatureModalProps {
  onClose: () => void;
  onSignMessage: () => Promise<void>;
  signature: string | null;
  verificationResult: boolean | null;
}

const VerifySignatureModal: FC<VerifySignatureModalProps> = ({
  onClose,
  onSignMessage,
  signature,
  verificationResult,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onSignMessage();
    } catch (err) {
      setError("Failed to sign message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Verify Your Wallet</h2>
        <p className="mb-4">
          To complete the connection, please sign the message to verify your wallet ownership.
        </p>
        {!signature ? (
          <button
            onClick={handleSignMessage}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white bg-blue p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing...' : 'Sign Message'}
          </button>
        ) : (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <p className="mb-2"><strong>Signature:</strong> {signature.slice(0, 20)}...</p>
            <p>
              <strong>Verification:</strong>{' '}
              {verificationResult === null
                ? 'Pending...'
                : verificationResult
                ? 'Valid signature'
                : 'Invalid signature'}
            </p>
          </div>
        )}
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VerifySignatureModal;