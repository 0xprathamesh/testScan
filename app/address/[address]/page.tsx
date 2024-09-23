"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/Devnav";
import Copyable from "@/components/elements/Copyable";
import Spinner from "@/components/elements/Spinner";
import Loading from "@/components/elements/Loading";

interface AddressDetailsProps {
  params: {
    address: string;
  };
}

interface ExternalTransaction {
  hash: string;
  blockNum: string;
  metadata: {
    blockTimestamp: string;
  };
  from: string;
  to: string;
  value: string;
  asset: string;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ params }) => {
  const { address } = params;
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [externalTxs, setExternalTxs] = useState<ExternalTransaction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rpcUrl = localStorage.getItem("rpcUrl") || "";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        // Fetch the balance
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance).toString());

        // Fetch the transaction history
        // const history = await provider.getHistory(address);
        // const externalTransfers = history.filter(
        //   (tx) => tx.to && tx.to.toLowerCase() === address.toLowerCase()
        // );

        // Fetch metadata for each transaction
        // const transfersWithMetadata = await Promise.all(
        //   externalTransfers.map(async (tx) => {
        //     const block = await provider.getBlock(tx.blockNumber);
        //     const gasPrice = await provider.getGasPrice();
        //     const txnFee = ethers.utils.formatEther(tx.gasLimit.mul(gasPrice));
        //     return {
        //       hash: tx.hash,
        //       blockNum: tx.blockNumber.toString(),
        //       metadata: {
        //         blockTimestamp: new Date(block.timestamp * 1000).toISOString(),
        //       },
        //       from: tx.from,
        //       to: tx.to!,
        //       value: ethers.utils.formatEther(tx.value),
        //       txnFee,
        //       asset: "ETH",
        //     };
        //   })
        // );

        // setExternalTxs(transfersWithMetadata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, [address]);

  return loading ? (
    <div className="h-40 m-auto text-blue"><Loading /></div>
  ) : (
    <div>
      <Navbar />
      <div className="bg-[#f9f8fa]">
        <div className="px-10 py-4 text-sm font-chivo text-gray-900 w-full bg-[#f9f8fa] mt-16 flex items-center">
          <Account /> Address &gt;
          <span className="text-gray-500 text-md ml-1 font-chivo text-sm font-light hover:bg-orange-200 p-1 px-2 rounded-md hover:border border-dashed border-orange-500">
            #{address}
          </span>
          <span>
            <Copyable text="" copyText={address} />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 px-10 mt-4 pb-6 border-b">
          <div className="w-full border rounded-lg bg-white overflow-y-auto min-h-60">
            <h3 className="text-sm font-inter leading-5 font-normal mb-4 border-b pb-3 p-4">
              Overview
            </h3>
            <ul>
              <li className="flex items-center px-4 text-sm font-light py-2 border-b">
                Balance: <span className="ml-32">{balance} ETH</span>
              </li>
            </ul>
          </div>
          <div className="w-full border rounded-lg bg-white overflow-y-auto">
            <h3 className="text-sm font-inter leading-5 font-normal mb-4 border-b pb-3 p-4">
              More Info
            </h3>
            <ul>
              <li className="flex items-center px-4 text-sm font-light py-2 border-b">
                Balance: <span className="ml-32">{balance} ETH</span>
              </li>
              <li className="flex items-center px-4 text-sm font-light py-2 border-b">
                Token Tracker:
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="px-10 border-b">
        <p className="text-blue font-chivo text-md py-3">Transactions</p>
      </div>
      <div className="px-10 py-4 text-sm font-chivo text-gray-900 w-full bg-[#f9f8fa] flex items-center">
        <Account /> Address &gt;
        <span className="text-gray-500 text-md ml-1 font-chivo text-sm font-light p-1 px-2">
          #{address}
        </span>
      </div>
      <div className="px-20 bg-[#f0f9fe]">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                Txn Hash
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                Block
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                From
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                To
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                Value
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                Txn Fee
              </th>
              <th className="px-4 py-2 text-left text-sm font-normal font-inter text-gray-500">
                Age
              </th>
            </tr>
          </thead>


        </table>
      </div>
    </div>
  );
};

export default AddressDetails;

const Account = () => (
  <span className="inline-block ml-1 mr-1 transform">
    <div className="rounded-full inline-block m-0 overflow-hidden p-0 bg-[#15aff2] h-[14px] w-[14px] paper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        height="14"
        width="14"
      >
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(0.02227782413858366 -0.382432633897185) rotate(374.7 7 7)"
          fill="#fc5e00"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(5.888844613104138 3.5816215834288365) rotate(173.4 7 7)"
          fill="#f3ab00"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(6.119885684259595 11.45752949450421) rotate(203.5 7 7)"
          fill="#f18702"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(6.082454212343236 10.81626461805428) rotate(55.1 7 7)"
          fill="#d95201"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(5.723070092826195 4.186876771242999) rotate(141.1 7 7)"
          fill="#dfdd03"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(5.637633357520848 2.9733377038745783) rotate(125.9 7 7)"
          fill="#f09b00"
        ></rect>
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          height="14"
          width="14"
          transform="translate(5.203322087836667 11.646041946233787) rotate(311.9 7 7)"
          fill="#ea7d01"
        ></rect>
      </svg>
    </div>
  </span>
);