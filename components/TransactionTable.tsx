import React, { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { Copy } from "lucide-react";
import { FaLongArrowAltRight } from "react-icons/fa";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
}

interface TransactionTableProps {
  transactions: Transaction[];
  itemsPerPage?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Get current transactions to display based on page
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((tx) => (
              <tr key={tx.hash}>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-500 ">
                  <Link
                    href={`/newui/tx/${tx.hash}`}
                    className="text-blue font-chivo text-sm font-light leading flex items-center"
                  >
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                    <Copy
                      className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    />
                  </Link>
                </td>
                <td className="px-3 py-4 text-[#8A98AD] font-chivo text-sm font-light leading flex items-center">
                  {tx.from.slice(0, 10)}...{tx.from.slice(-4)}{" "}
                  <Copy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.hash)}
                  />
                  <p className="bg-green-100 rounded-full h-4 w-4 flex items-center justify-center ml-4">
                    <FaLongArrowAltRight className="h-3 w-3" />
                  </p>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.to
                    ? `${tx.to.slice(0, 10)}...${tx.to.slice(-4)}`
                    : "Contract Creation"}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parseFloat(ethers.utils.formatEther(tx.value)).toFixed(1)}{" "}
                  ETH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-100"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
