import React from 'react';
import { getBgColorForScore, getColorForScore } from '../utils';

interface RadialProgressProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, label, size = 'md' }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  let width = 120;
  let strokeWidth = 8;
  let textSize = 'text-2xl';

  if (size === 'sm') {
    width = 80;
    strokeWidth = 6;
    textSize = 'text-lg';
  } else if (size === 'lg') {
    width = 180;
    strokeWidth = 10;
    textSize = 'text-4xl';
  }

  const colorClass = getColorForScore(score);
  const strokeColor = score >= 95 ? '#34d399' : score >= 85 ? '#fbbf24' : '#fb7185';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width, height: width }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSize} ${colorClass}`}>
            {score.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-slate-400 text-sm font-medium text-center uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default RadialProgress;