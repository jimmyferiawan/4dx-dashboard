

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { YearlyData, Month, Week, GoalRecord } from '../types';
import { parseGoalValue } from '../utils';
import { X } from 'lucide-react';

interface GoalsTrendChartProps {
  yearData: YearlyData;
  selectedDepartment: string;
  month: Month;
  currentWeek: Week;
  currentGoals: GoalRecord[];
}

interface GoalChartDataPoint {
  name: string; // W1, W2
  score: number; // Achievement %
  target: number;
  actual: number;
  unit: string;
  fullDate: string;
}

interface ModalData {
  goalName: string;
  weekName: string;
  score: number;
}

const GoalsTrendChart: React.FC<GoalsTrendChartProps> = ({ yearData, selectedDepartment, month, currentWeek, currentGoals }) => {
  const [selectedPoint, setSelectedPoint] = useState<ModalData | null>(null);

  const uniqueGoals = Array.from(new Set(currentGoals.map(g => g.goals)));

  if (uniqueGoals.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="bg-emerald-500 w-1 h-6 rounded-full"></span>
          Goal Achievement Trends
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {uniqueGoals.map((goalName: string) => {
          const chartData: GoalChartDataPoint[] = [];

          for (let w = 1; w <= currentWeek; w++) {
            let score = 0;
            let target = 0;
            let actual = 0;
            let unit = '';

            const wData = yearData[month]?.[w as Week];
            const goalRec = wData?.goals?.find(g => g.goals === goalName);
            if (goalRec) {
                target = parseGoalValue(goalRec.target);
                actual = parseGoalValue(goalRec.actual);
                unit = goalRec.unit || '';
                score = target > 0 ? parseFloat(((actual / target) * 100).toFixed(1)) : 0;
            }

            chartData.push({
                name: `W${w}`,
                score,
                target,
                actual,
                unit,
                fullDate: `Week ${w}`,
            });
          }

          return (
            <div key={goalName} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
               <h4 className="text-slate-200 font-bold text-sm uppercase tracking-wide mb-4 flex items-center justify-between">
                  <span>{goalName}</span>
                  <span className="text-xs text-slate-500 font-normal">Achievement %</span>
               </h4>
               
               <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                        <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{ fill: '#1e293b', opacity: 0.5 }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    return (
                                        <div className="bg-slate-950 border border-slate-700 p-2 rounded shadow-xl text-xs">
                                            <p className="font-bold text-white mb-1">{d.fullDate}</p>
                                            <p className="text-emerald-400 font-bold mb-1">Achieved: {d.score}%</p>
                                            <p className="text-slate-400">Actual: {d.actual} / {d.target}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" />
                        <Bar 
                            dataKey="score" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        >
                            <LabelList dataKey="score" position="top" fill="#cbd5e1" fontSize={11} fontWeight="bold" formatter={(val: number) => `${val}%`} />
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsTrendChart;
