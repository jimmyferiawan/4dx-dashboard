
import React from 'react';
import { ActivityPlanRecord } from '../types';
import { Calculator, Calendar, ListChecks, Target, User, Clock } from 'lucide-react';
import { getColorForScore, parseGoalValue, getBgColorForScore } from '../utils';

interface ActivitySummaryChartProps {
  data: ActivityPlanRecord[];
  isCorporate: boolean;
}

const ActivitySummaryChart: React.FC<ActivitySummaryChartProps> = ({ data, isCorporate }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 italic">
        <Calculator className="w-12 h-12 mb-4 opacity-20" />
        <p>No activity plan records found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
           <div className="bg-amber-900/30 p-2.5 rounded-lg border border-amber-800/50">
              <ListChecks className="w-5 h-5 text-amber-400" />
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Initiatives</p>
              <p className="text-2xl font-bold text-white">{data.length}</p>
           </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
           <div className="bg-blue-900/30 p-2.5 rounded-lg border border-blue-800/50">
              <Target className="w-5 h-5 text-blue-400" />
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">AP Corporate Links</p>
              <p className="text-2xl font-bold text-white">{new Set(data.map(d => d.apCorporate)).size}</p>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
           <div className="bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/50">
              <Clock className="w-5 h-5 text-emerald-400" />
           </div>
           <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Employees</p>
              <p className="text-2xl font-bold text-white">{new Set(data.map(d => d.employeeName)).size}</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 uppercase font-bold text-slate-500 border-b border-slate-800 text-xs">
              <tr>
                <th className="px-4 py-4 w-[15%]">AP Corporate</th>
                <th className="px-4 py-4 w-[20%]">Key Result</th>
                <th className="px-4 py-4 w-[25%]">To Do List</th>
                <th className="px-4 py-4 text-center">Due Date</th>
                <th className="px-4 py-4 text-center">Achievement</th>
                <th className="px-4 py-4">PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((item, idx) => {
                const target = parseGoalValue(item.target);
                const actual = parseGoalValue(item.actual);
                const score = target > 0 ? (actual / target) * 100 : 0;
                
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 py-4 align-top">
                      <div className="text-xs font-bold text-blue-400 bg-blue-950/30 border border-blue-900/50 px-2 py-1 rounded inline-block">
                        {item.apCorporate || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{item.keyResult}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-slate-400 text-xs leading-relaxed italic">{item.todoList || 'No tasks listed'}</p>
                    </td>
                    <td className="px-4 py-4 text-center align-top">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Deadline</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {item.dueDate || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center align-top">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-black ${getColorForScore(score)}`}>{score.toFixed(0)}%</span>
                        <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${getBgColorForScore(score)}`} style={{ width: `${Math.min(score, 100)}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1">{item.actual}/{item.target}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 text-xs flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          {item.employeeName}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.position}</span>
                        {item.department && <span className="text-[9px] text-blue-500 font-bold uppercase mt-0.5">{item.department}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummaryChart;
