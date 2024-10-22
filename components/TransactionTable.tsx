import React, { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { Copy } from "lucide-react";
import { FaLongArrowAltRight } from "react-icons/fa";
import PaginationComponent from "./Pagination";

interface Transaction {
  hash: string;
  from: string;
  to?: string;
  value: ethers.BigNumber;
}

interface TransactionTableProps {
  transactions: Transaction[];
  itemsPerPage?: number;
}
const currency = process.env.NEXT_PUBLIC_VALUE_SYMBOL;
const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  itemsPerPage = 11,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="">
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
                <td className="px-3 py-4 text-[#8A98AD] font-chivo text-sm font-light leading-2 flex items-center">
                  {tx.from.slice(0, 10)}...{tx.from.slice(-4)}{" "}
                  <Copy
                    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                    onClick={() => navigator.clipboard.writeText(tx.hash)}
                  />
                  <p className="bg-green-100 rounded-full h-4 w-4 flex items-center justify-center ml-4">
                    <FaLongArrowAltRight className="h-3 w-3" />
                  </p>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-gray-500 leading-2 font-chivo text-sm font-light">
                  {tx.to
                    ? `${tx.to.slice(0, 10)}...${tx.to.slice(-4)}`
                    : "Contract Creation"}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parseFloat(ethers.utils.formatEther(tx.value)).toFixed(1)}{" "}
                  {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-around items-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      </div>
    </div>
  );
};

export default TransactionTable;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import Link from "next/link";
// import { Copy } from "lucide-react";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import PaginationComponent from "./Pagination";
// import { blockService } from "./newui/utils/apiroutes";

// interface Transaction {
//   hash: string;
//   from: string;
//   to?: string;
//   value: ethers.BigNumber;
// }

// interface TransactionTableProps {
//   blockNumber: number;
//   itemsPerPage?: number;
// }

// const TransactionTable: React.FC<TransactionTableProps> = ({
//   blockNumber,
//   itemsPerPage = 11,
// }) => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(transactions.length / itemsPerPage);

//   const currentTransactions = transactions.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const fetchTransactions = async () => {
//     if (process.env.NEXT_PUBLIC_FETCH_DATA_API === "true") {
//       try {
//         const response = await blockService.getBlockTransaction(blockNumber, `?limit=${itemsPerPage}&page=${currentPage}`);
//         setTransactions(response.data.items.map((tx: any) => ({
//           hash: tx.hash,
//           from: tx.from.hash,
//           to: tx.to ? tx.to.hash : null,
//           value: ethers.BigNumber.from(tx.value),
//         })));
//       } catch (error) {
//         console.error("Error fetching transactions from API:", error);
//       }
//     } else {
//       try {
//         const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
//         const block = await provider.getBlockWithTransactions(blockNumber);
//         setTransactions(block.transactions);
//       } catch (error) {
//         console.error("Error fetching transactions from provider:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [blockNumber, currentPage]);

//   const parseAddress = (address: string) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   return (
//     <div className="">
//       <div className="bg-white rounded-3xl shadow overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Transaction ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 From
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 To
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Value
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentTransactions.map((tx) => (
//               <tr key={tx.hash}>
//                 <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-500 ">
//                   <Link
//                     href={`/newui/tx/${tx.hash}`}
//                     className="text-blue font-chivo text-sm font-light leading flex items-center"
//                   >
//                     {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
//                     <Copy
//                       className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
//                       onClick={() => navigator.clipboard.writeText(tx.hash)}
//                     />
//                   </Link>
//                 </td>
//                 <td className="px-3 py-4 text-[#8A98AD] font-chivo text-sm font-light leading-2 flex items-center">
//                   {parseAddress(tx.from)}
//                   <Copy
//                     className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
//                     onClick={() => navigator.clipboard.writeText(tx.from)}
//                   />
//                   <p className="bg-green-100 rounded-full h-4 w-4 flex items-center justify-center ml-4">
//                     <FaLongArrowAltRight className="h-3 w-3" />
//                   </p>
//                 </td>
//                 <td className="px-3 py-4 whitespace-nowrap text-gray-500 leading-2 font-chivo text-sm font-light">
//                   {tx.to ? parseAddress(tx.to) : "Contract Creation"}
//                 </td>
//                 <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {parseFloat(ethers.utils.formatEther(tx.value)).toFixed(1)} ETH
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-4 flex justify-around items-center">
//         <PaginationComponent
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePreviousPage={handlePreviousPage}
//           handleNextPage={handleNextPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;
