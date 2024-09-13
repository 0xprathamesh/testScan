import Link from "next/link";
import React from "react";
import ParentComponent from "./elements/ModalButton";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 z-50">
      <nav className=" mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center  h-16">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex-shrink-0">
              <p className="text-lg"> / Devnet Explorer</p>
            </Link>
            {/* Navigation Menu */}
            {/* <div className="hidden md:flex md:ml-10">
              <div className="relative group">
                <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-700 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">
                  Blockchain
                </button>
                <div className="absolute left-0 hidden mt-2 origin-top-left rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 group-hover:block">
                  <div className="py-1">
                    <a
                      href="/transactions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Transactions & Blocks
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative ml-4 group">
                <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-700 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">
                  Tokens
                </button>
                <div className="absolute left-0 hidden mt-2 origin-top-left rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 group-hover:block">
                  <div className="py-1">
                    <a
                      href="/tokens"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tokens Data
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative ml-4 group">
                <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-700 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">
                  Data
                </button>
                <div className="absolute left-0 hidden mt-2 origin-top-left rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 group-hover:block">
                  <div className="py-1">
                    <a
                      href="/tokens-data"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tokens Data
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            
          </div>
          <ParentComponent />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
