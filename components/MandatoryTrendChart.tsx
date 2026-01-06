

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { YearlyData, Month, Week, MandatoryRecord } from '../types';
import { parseGoalValue } from '../utils';
import { X } from 'lucide-react';

interface MandatoryTrendChartProps {
  yearData: YearlyData;
  selectedDepartment: string;
  month: Month;
  currentWeek: Week;
  currentRecords: MandatoryRecord[];
}

interface ChartDataPoint {
  name: string; // W1, W2
  score: number; // Achievement %
  target: number;
  actual: number;
  unit: string;
  fullDate: string;
}

interface ModalData {
  itemName: string;
  weekName: string;
  score: number;
}

const MandatoryTrendChart: React.FC<MandatoryTrendChartProps> = ({ yearData, selectedDepartment, month, currentWeek, currentRecords }) => {
  const [selectedPoint, setSelectedPoint] = useState<ModalData | null>(null);

  // 1. Identify Unique Items
  const uniqueItems = Array.from(new Set(currentRecords.map(g => g.mandatory)));

  if (uniqueItems.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="bg-rose-500 w-1 h-6 rounded-full"></span>
          Mandatory Achievement Trends
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {uniqueItems.map((itemName: string) => {
          // Build History Data for this Item
          const chartData: ChartDataPoint[] = [];

          for (let w = 1; w <= currentWeek; w++) {
            let score = 0;
            let target = 0;
            let actual = 0;
            let unit = '';

            const wData = yearData[month]?.[w as Week];
            const rec = wData?.mandatoryRecords?.find(g => g.mandatory === itemName);
            if (rec) {
                target = parseGoalValue(rec.target);
                actual = parseGoalValue(rec.actual);
                unit = rec.unit || '';
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
            <div key={itemName} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
               <h4 className="text-slate-200 font-bold text-sm uppercase tracking-wide mb-4 flex items-center justify-between">
                  <span>{itemName}</span>
                  <span className="text-xs text-slate-500 font-normal">Compliance %</span>
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
                                            <p className="text-rose-400 font-bold mb-1">Achieved: {d.score}%</p>
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
                            fill="#f43f5e" 
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

export default MandatoryTrendChart;
