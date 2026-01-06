import React from 'react';
import { ControlIndicator } from '../types';
import { calculateControlScore, getBgColorForScore } from '../utils';

interface ControlInputProps {
  control: ControlIndicator;
}

const ControlInput: React.FC<ControlInputProps> = ({ control }) => {
  const score = calculateControlScore(control);
  
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors px-2 rounded">
      <div className="col-span-5">
        <p className="text-sm font-medium text-slate-300">{control.name}</p>
        <p className="text-xs text-slate-500">Weight: {control.weight}% | Target: {control.target}</p>
      </div>
      
      <div className="col-span-3 flex items-center space-x-2">
        {/* Read-only display for Actual Value */}
        <div className="w-full bg-slate-900/50 border border-slate-800 text-slate-300 text-sm rounded px-2 py-1 text-right cursor-default">
          {control.actual}
        </div>
        <span className="text-xs text-slate-500">{control.unit}</span>
      </div>

      <div className="col-span-4 flex items-center space-x-3">
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBgColorForScore(score)} transition-all duration-500`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <span className={`text-xs font-bold w-12 text-right ${score < 85 ? 'text-rose-400' : 'text-slate-300'}`}>
          {score.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default ControlInput;