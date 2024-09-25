"use client";
import React, { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

const DidYouKnow = () => {

  const insights = [
    "Mantas native token, i.e., $MANTA, has seen a ~200% increase in value since its launch in 2022.",
    "$MANTA is a privacy-focused token, ensuring secure and anonymous transactions.",
    "The Manta Network is built to provide scalable private DeFi solutions.",
    "Manta Network leverages zk-SNARK technology to enhance privacy on-chain.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % insights.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? insights.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white border-gray-300 border-[0.5px] text-white p-6 rounded-3xl col-span-1 md:col-span-2">
      <h3 className="text-sm text-gray-400 mb-2 flex items-center justify-between ">
        Did You Know ?
        <div className="flex items-center justify-between gap-2">
          <button onClick={handlePrev} className="border rounded-full p-1">
            <MdKeyboardArrowLeft className="h-6 w-6" />
          </button>

          <button onClick={handleNext} className="border rounded-full p-1">
            <MdKeyboardArrowRight className="h-6 w-6" />
          </button>
        </div>
      </h3>

      <p className="mt-4 flex items-center text-[#4a4a4a] text-sm font-chivo font-light">
        <span className="mr-2 text-xl">💡</span>

        {insights[currentIndex]}
      </p>
    </div>
  );
};

export default DidYouKnow;
