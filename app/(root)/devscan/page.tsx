
import SearchComponent from "@/components/SearchComponent";
import React from "react";
import Image from "next/image";
import waves from "@/public/waves-light.svg";

import LatestBlocks from "@/components/LatestBlocks";
import Navbar from "@/components/Devnav";
const Main = () => {
  return (
    <div>
      <Navbar />
      <div className="h-60 w-full bg-[#727ff2] relative mt-10">
        <Image
          src={waves}
          alt="Waves"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />

        <div className="absolute inset-0 flex items-center justify-center pl-20">
          <SearchComponent />
        </div>
      </div>

      <LatestBlocks />
    </div>
  );
};

export default Main;
