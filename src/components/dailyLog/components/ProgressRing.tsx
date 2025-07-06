
import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
}

const ProgressRing = ({ percentage, size = 16 }: ProgressRingProps) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`relative w-${size} h-${size}`}>
      <svg className={`w-${size} h-${size} transform -rotate-90`} viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage / 100)}
          className="accent-green transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-primary">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressRing;
