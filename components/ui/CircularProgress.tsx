
import React from 'react';

interface CircularProgressProps {
  score: number;
  size?: 'small' | 'large';
}

const CircularProgress: React.FC<CircularProgressProps> = ({ score, size = 'small' }) => {
  const isLarge = size === 'large';
  const radius = isLarge ? 80 : 40;
  const strokeWidth = isLarge ? 12 : 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score < 25 ? 'text-red-500' : score < 75 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className={`relative inline-flex items-center justify-center ${isLarge ? 'h-44 w-44' : 'h-24 w-24'}`}>
      <svg
        className="absolute top-0 left-0"
        height={isLarge ? 176 : 96}
        width={isLarge ? 176 : 96}
      >
        <circle
          className="text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`${scoreColor.replace('text-','stroke-')} transition-all duration-1000 ease-in-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <span className={`font-orbitron font-bold ${isLarge ? 'text-5xl' : 'text-3xl'} ${scoreColor}`}>
        {score}
      </span>
    </div>
  );
};

export default CircularProgress;