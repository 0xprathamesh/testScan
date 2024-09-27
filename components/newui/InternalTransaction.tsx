import { useState, useEffect } from 'react';
import transactionService from './utils/transactionservice'; // Adjust the path based on your project structure

interface InternalTransaction {
  blockNumber: string;
  from: string;
  to: string;
  value: string;
  gas: string;
}

const InternalTransactions = ({ transactionHash }: { transactionHash: string }) => {
  const [internalTransactions, setInternalTransactions] = useState<InternalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternalTransactions = async () => {
      try {
        const response = await transactionService.getInternalTransaction(transactionHash);
        console.log(response); // Inspect the response structure here

        // If the data is wrapped in another object, adjust accordingly
        if (Array.isArray(response.data)) {
          setInternalTransactions(response.data); // Make sure this matches the actual response
        } else {
          setInternalTransactions([]); // Handle the case where data is not as expected
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internal transactions:', err);
        setError('Failed to fetch internal transactions');
        setLoading(false);
      }
    };

    if (transactionHash) {
      fetchInternalTransactions();
    }
  }, [transactionHash]);

  if (loading) {
    return <div>Loading internal transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Internal Transactions</h2>
      {internalTransactions.length === 0 ? (
        <p>No internal transactions found for this transaction.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Block Number</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">Gas</th>
            </tr>
          </thead>
          <tbody>
            {internalTransactions.map((tx, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{tx.blockNumber}</td>
                <td className="border px-4 py-2">{tx.from}</td>
                <td className="border px-4 py-2">{tx.to}</td>
                <td className="border px-4 py-2">{tx.value}</td>
                <td className="border px-4 py-2">{tx.gas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InternalTransactions;
