//// app/devscan/page.tsx
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";
import waves from "@/public/waves-light.svg";
import LatestBlocks from "@/components/LatestBlocks";
import SearchComponent from "@/components/SearchComponent";

const Devscan = () => {
  return (
    <div>
      <Navbar />
      <div className="h-60 w-full bg-[#727ff2] relative">
        <Image
          src={waves}
          alt="Waves"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <p className="text-white pl-20 text-2xl pt-10">
          Devscan Explorer
        </p>
        <div className="absolute inset-0 flex items-center justify-center pl-20">
          <SearchComponent />
        </div>
      </div>
      <LatestBlocks />
    </div>
  );
};

export default Devscan;
