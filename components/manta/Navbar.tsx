import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/utils/client";

const Navbar: React.FC = () => {
  return (
    <div className="fixed top-0 left-20 right-0  border-b border-gray-200 z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <p className="font-semibold font-inter text-lg ">
            Manta Pacific Explorer
          </p>
          <div className="bg-gray-800 px-3 py-1 rounded-md">
            <p className="text-sm text-white font-inter">Mainnet</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <ConnectButton client={client} theme={"light"} />
          </div>

          <div className="flex items-center space-x-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
