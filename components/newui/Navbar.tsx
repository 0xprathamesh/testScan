"use client";
import React, { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/utils/client";
import { IoIosArrowForward } from "react-icons/io";
import SearchBar from "../elements/Search";
import { usePathname } from "next/navigation";
const Navbar: React.FC = () => {
  const [network, setNetwork] = useState("Mainnet");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const name = process.env.NEXT_PUBLIC_PROJECT_NAME;
  const pathname = usePathname();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNetworkChange = (selectedNetwork: string) => {
    setNetwork(selectedNetwork);
    setDropdownOpen(false);
  };

  // Check if the current route starts with '/newui'
  // if (pathname.startsWith("/newui")) {
  //   return null;
  // }
  const explorername = process.env.NEXT_PUBLIC_EXPLORER_NAME;
  return (
    <div className="bg-white fixed top-0 left-20 right-0 border-b border-gray-200 z-10 backdrop-blur-md">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <p className="font-semibold font-inter text-lg">{explorername}</p>
          <div className="relative">
            
            <button
              onClick={toggleDropdown}
              className="bg-gray-800 px-3 py-1 rounded-md text-sm flex items-center text-white space-x-2 font-inter"
            >
              {network} <IoIosArrowForward />
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 w-32 bg-white shadow-lg rounded-md py-1 z-20">
                <button
                  onClick={() => handleNetworkChange("Mainnet")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mainnet
                </button>
                <button
                  onClick={() => handleNetworkChange("Testnet")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Testnet
                </button>
              </div>
            )}
          </div>
        </div>
        {pathname !== "/newui" ? <SearchBar /> : null}

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
