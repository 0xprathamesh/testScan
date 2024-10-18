import React from 'react';

interface SkeletonProps {
  width: string;
  height: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, className }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ width, height }}
    ></div>
  );
};
