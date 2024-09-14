"use client"
import Link from "next/link";
import React from "react";
import { RxSketchLogo, RxDashboard, RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaEthereum } from "react-icons/fa";
import { BiPulse } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineExplore } from "react-icons/md";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/manta">
            <div className="bg-gray-900 text-white p-3 rounded-lg inline-block">
              <FaEthereum size={20} />
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <Link href="/manta">
            <div
              className={`bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block ${
                isActive("/manta") ? "text-blue" : ""
              }`}
            >
              <RxDashboard size={20} />
            </div>
          </Link>
          <Link href="/manta/pulse">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <BiPulse size={20} />
            </div>
          </Link>
          <Link href="/manta/explore">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <MdOutlineExplore size={20} />
            </div>
          </Link>
          <Link href="/manta/api">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <FiSettings size={20} />
            </div>
          </Link>
        </div>
      </div>
      <main className="ml-20 w-full">{children}</main>
    </div>
  );
};

export default Sidebar;
