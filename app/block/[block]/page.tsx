// pages/block/[blocknumber]/index.tsx

"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Navbar from "@/components/Devnav";

interface PageProps {
  params: {
    block: string;
  };
}

const BlockPage: React.FC<PageProps> = ({ params }) => {
  const [blockData, setBlockData] = useState<ethers.providers.Block | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (params.block) {
      const blockNumber = parseInt(params.block, 10);
      if (isNaN(blockNumber)) {
        setError("Invalid block number");
      } else {
        fetchBlockData(blockNumber);
      }
    } else {
      setError("No Block Number Provided");
    }
  }, [params.block]);

  const fetchBlockData = async (blockNumber: number) => {
    try {
      const rpcUrl: string | null = localStorage.getItem("rpcUrl");
      if (!rpcUrl) {
        setError("No RPC URL found in local storage");
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlock(blockNumber);

      if (!block) {
        setError("No block information found");
        return;
      }

      const baseFeeInGwei = block.baseFeePerGas
        ? ethers.utils.formatUnits(block.baseFeePerGas, "gwei")
        : "N/A";

      setBlockData({
        ...block,
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString(),
        difficulty: block.difficulty.toString(),
        baseFeePerGas: baseFeeInGwei,
        miner: block.miner,
        transactions: block.transactions,
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching block data");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!blockData) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <section className="mt-16">
        <div className=" px-10 py-4 mt-8 text-md font-chivo text-gray-900 w-full bg-[#f9f8fa] border-b">
          Blockchain &gt; Block &gt;
          <span className="text-gray-500 text-md ml-1">
            #{blockData.number}
          </span>
        </div>
        <div className="px-10 py-4  w-full border-b text-gray-500">
          <nav className="flex items-center justify-start gap-8">
            <Link href={`/block/${params.block}`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm">
                Overview
              </p>
            </Link>
            <Link href={`/block/${params.block}/transactions`} passHref>
              <p className="font-medium hover:text-blue cursor-pointer text-sm ">
                Transactions
              </p>
            </Link>
          </nav>
        </div>

        <div className="bg-white px-8 py-4 rounded-lg divide-y">
          {/* Overview content */}
          <div className="flex">
            <div className="w-1/2 divide-y">
              <TitleComponent title="Block Height" />
              <TitleComponent title="Status" />
              <TitleComponent title="Timestamp" />
              <TitleComponent title="Transactions" />
              <TitleComponent title="Size" />
              <TitleComponent title="Gas Used" />
              <TitleComponent title="Gas Limit" />
              <TitleComponent title="Base Fee Per Gas" />
              <TitleComponent title="Burnt Fees" />
              <TitleComponent title="More Details" />
              {/* Conditionally render the TitleComponents for Hash and Parent Hash */}
              {showMore && (
                <>
                  <TitleComponent title="Hash" />
                  <TitleComponent title="Parent Hash" />
                </>
              )}
            </div>
            <div className="divide-y w-full text-sm">
              <p className="py-3">{blockData.number}</p>
              <p className="py-3">{"Unknown"}</p>
              <p className="py-3">
                {new Date(blockData.timestamp * 1000).toLocaleString()}
              </p>
              <div className="py-3 text-center">
                <p className="bg-gray-100 w-32">
                  {blockData.transactions.length} transactions
                </p>
              </div>
              <p className="py-3">{blockData.size || "N/A"} bytes</p>
              <p className="py-3">
                {blockData.gasUsed} (
                {(
                  (Number(blockData.gasUsed) / Number(blockData.gasLimit)) *
                  100
                ).toFixed(2)}
                %)
              </p>
              <p className="py-3">{blockData.gasLimit}</p>
              <p className="py-3">{blockData.baseFeePerGas} Gwei</p>
              <p className="py-3">
                🔥 {ethers.utils.formatEther(blockData.burntFees || "0")} ETH
              </p>
              <p
                className="py-3 text-[#357BAD] cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                Click to show more
              </p>
              {/* Conditionally render the hash and parent hash values */}
              {showMore && (
                <>
                  <p className="py-3">{blockData.hash}</p>
                  <p className="py-3 text-[#357BAD]">
                    <Link href={`/block/${blockData.parentHash}`}>
                      {blockData.parentHash}
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
const TitleComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center">
    <AiOutlineQuestionCircle />
    <p className="ml-2 py-3 text-sm font-inter ">{title}</p>
  </div>
);

export default BlockPage;

// "use client";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import Link from "next/link";
// import { AiOutlineQuestionCircle } from "react-icons/ai";
// import Navbar from "@/components/Devnav";

// interface PageProps {
//   params: {
//     block: string;
//   };
// }

// const BlockPage: React.FC<PageProps> = ({ params }) => {
//   const [blockData, setBlockData] = useState<ethers.providers.Block | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [showMore, setShowMore] = useState(false);

//   useEffect(() => {
//     if (params.block) {
//       const blockNumber = parseInt(params.block, 10);
//       if (isNaN(blockNumber)) {
//         setError("Invalid block number");
//       } else {
//         fetchBlockData(blockNumber);
//       }
//     } else {
//       setError("No Block Number Provided");
//     }
//   }, [params.block]);

//   const fetchBlockData = async (blockNumber: number) => {
//     try {
//       const rpcUrl: string | null = localStorage.getItem("rpcUrl");
//       if (!rpcUrl) {
//         setError("No RPC URL found in local storage");
//         return;
//       }

//       const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
//       const block = await provider.getBlock(blockNumber);

//       if (!block) {
//         setError("No block information found");
//         return;
//       }

//       const baseFeeInGwei = block.baseFeePerGas
//         ? ethers.utils.formatUnits(block.baseFeePerGas, "gwei")
//         : "N/A";

//       setBlockData({
//         ...block,
//         gasUsed: block.gasUsed.toString(),
//         gasLimit: block.gasLimit.toString(),
//         difficulty: block.difficulty.toString(),
//         baseFeePerGas: baseFeeInGwei,
//         miner: block.miner,
//         transactions: block.transactions,
//       });
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while fetching block data");
//     }
//   };

//   if (error) return <div className="text-red-500">{error}</div>;
//   if (!blockData) return <div>Loading...</div>;

//   return (
//     <>
//       <Navbar />
//       <section className="mt-16">
//         <div className=" px-10 py-4 mt-8 text-md font-chivo text-gray-900 w-full bg-[#f9f8fa] border-b">
//           Blockchain &gt; Block &gt;
//           <span className="text-gray-500 text-md ml-1">
//             #{blockData.number}
//           </span>
//         </div>
//         <div className="px-10 py-4 w-full border-b text-gray-500">
//           <nav className="flex items-center justify-start gap-8">
//             <Link href={`/block/${params.block}`} passHref>
//               <p className="font-medium hover:text-blue cursor-pointer text-sm">
//                 Overview
//               </p>
//             </Link>
//             <Link href={`/block/${params.block}/transactions`} passHref>
//               <p className="font-medium hover:text-blue cursor-pointer text-sm ">
//                 Transactions
//               </p>
//             </Link>
//           </nav>
//         </div>

//         <div className="bg-white px-8 py-4 rounded-lg divide-y">

//         </div>
//       </section>
//     </>
//   );
// };

// export default BlockPage;
