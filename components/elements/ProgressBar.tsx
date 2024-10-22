import React from "react";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full h-4 bg-gray-700 rounded-md">
      <div
        className="h-full bg-green-500 rounded-md"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
