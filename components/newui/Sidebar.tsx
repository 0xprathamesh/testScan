"use client"
import Link from "next/link";
import React from "react";
import {  RxDashboard,  } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";

import { BiPulse } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineExplore } from "react-icons/md";
import { IoCubeOutline } from "react-icons/io5";

interface SidebarProps {
  children: React.ReactNode;
}
// <Image src="https://cdn.blocksscan.io/tokens/img/xdc.png" height={20} width={20} alt="logo" />

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/newui">
            <div className="bg-gray-900 text-white p-1 rounded-lg inline-block">
             <img src="https://cdn.blocksscan.io/tokens/img/xdc.png" height={32} width={32} alt="logo" />
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <Link href="/newui">
            <div
              className={`bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block ${
                isActive("/newui") ? "text-blue" : ""
              }`}
            >
              <RxDashboard size={20} />
            </div>
          </Link>
          <Link href="/newui/pulse">
            <div className={`bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block ${isActive("/newui/pulse") ? "text-blue" : ""}`}>
              <BiPulse size={20} />
            </div>
          </Link>
          <Link href="/newui/explore">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <MdOutlineExplore size={20} />
            </div>
          </Link>
          <Link href="/newui/txns">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <FiSettings size={20} />
            </div>
          </Link>
          <Link href="/newui/blocks">
            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
              <IoCubeOutline size={20} />
            </div>
          </Link>
        </div>
      </div>
      <main className="ml-20 w-full">{children}</main>
    </div>
  );
};

export default Sidebar;
