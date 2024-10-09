"use client";
import React, { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { insights } from "./utils/data";
const DidYouKnow = () => {
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
    <div className="bg-white   text-white p-6 rounded-3xl col-span-1 md:col-span-2">
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
