
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell } from 'recharts';
import { YearlyData, Month, Week, LeadingIndicator, LaggingIndicator, ControlIndicator, Contributor } from '../types';
import { getLeadingScore, calculateControlScore, getBgColorForScore, getColorForScore } from '../utils';
import { X, ExternalLink, AlertCircle, TrendingUp, Activity, User, UserCheck } from 'lucide-react';

interface LeadingTrendChartProps {
  yearData: YearlyData;
  selectedDepartment?: string;
  month: Month;
  currentWeek: Week;
  activeLaggingId: string;
  selectedPosition: string;
  selectedEmployee: string;
}

interface ChartDataPoint {
  name: string;
  score: number;
  leading: LeadingIndicator | null;
  fullDate: string;
  contributorName?: string;
}

const LeadingTrendChart: React.FC<LeadingTrendChartProps> = ({ 
    yearData, selectedDepartment, month, currentWeek, activeLaggingId, selectedPosition, selectedEmployee 
}) => {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(currentWeek);

  useEffect(() => {
    setSelectedWeekIdx(currentWeek);
  }, [currentWeek]);

  // Find metadata for the active lagging ID
  let laggingStructure: LaggingIndicator | undefined;
  if (yearData[month]?.[currentWeek]) {
      laggingStructure = yearData[month][currentWeek]!.indicators.find(l => l.id === activeLaggingId);
  }
  if (!laggingStructure) {
      for (let w = 1; w <= 5; w++) {
          const wd = yearData[month]?.[w as Week];
          if (wd) {
              const found = wd.indicators.find(l => l.id === activeLaggingId);
              if (found) { laggingStructure = found; break; }
          }
      }
  }

  if (!laggingStructure) {
      return (
        <div className="mt-8 flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-xl text-center">
            <AlertCircle className="w-8 h-8 text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Indicator Not Found</h3>
        </div>
      );
  }

  // --- FILTERING LOGIC ---
  const isFilteringEmployee = selectedEmployee !== 'All Employees';
  const isFilteringPosition = selectedPosition !== 'All Positions';

  // 1. Identify which Leading Indicators are relevant for the selected filter across history
  const relevantLeadingNames = new Set<string>();
  
  for (let w = 1; w <= currentWeek; w++) {
      const wd = yearData[month][w as Week];
      const lag = wd?.indicators.find(l => l.id === activeLaggingId);
      if (lag) {
          lag.leadings.forEach(l => {
              // Check if this leading has the contributor we want
              let hasContributor = true;
              if (isFilteringEmployee || isFilteringPosition) {
                   hasContributor = (l.contributors || []).some(c => {
                       const posMatch = !isFilteringPosition || c.position === selectedPosition;
                       const empMatch = !isFilteringEmployee || c.name === selectedEmployee;
                       return posMatch && empMatch;
                   });
              }
              if (hasContributor) {
                  relevantLeadingNames.add(l.name.toLowerCase().trim());
              }
          });
      }
  }

  const leadingsToList = Array.from(relevantLeadingNames);

  // Helper to calculate score for a specific Leading Indicator based on filters
  const calculateFilteredScore = (lead: LeadingIndicator): { score: number, actual: number } => {
       if (!lead.contributors || lead.contributors.length === 0) {
           // Fallback if no contributors list but filtered? return 0.
           // If no filter, return global actual.
           if (isFilteringEmployee || isFilteringPosition) return { score: 0, actual: 0 };
           const s = lead.target > 0 ? (lead.actual / lead.target) * 100 : 0;
           return { score: Math.min(s, 120), actual: lead.actual };
       }

       const matches = lead.contributors.filter(c => {
           const posMatch = !isFilteringPosition || c.position === selectedPosition;
           const empMatch = !isFilteringEmployee || c.name === selectedEmployee;
           return posMatch && empMatch;
       });

       if (matches.length === 0) return { score: 0, actual: 0 };

       const avgActual = matches.reduce((sum, c) => sum + c.actual, 0) / matches.length;
       const s = lead.target > 0 ? (avgActual / lead.target) * 100 : 0;
       return { score: Math.min(s, 120), actual: avgActual };
  };

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
        const w = parseInt(data.activeLabel.replace('W', ''));
        if (!isNaN(w)) setSelectedWeekIdx(w);
    }
  };

  if (leadingsToList.length === 0) {
      return (
        <div className="mt-8 flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-xl text-center">
            <UserCheck className="w-8 h-8 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No Data for this Employee</h3>
            <p className="text-sm text-slate-500 max-w-md mt-2">
                {selectedEmployee} does not have any recorded performance for {laggingStructure.name} in this period.
            </p>
        </div>
      );
  }

  return (
    <div className="mt-8 relative animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-blue-600 w-1.5 h-8 rounded-full"></span>
            Performance Control: {laggingStructure.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            Showing trends for: 
            <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {isFilteringEmployee ? selectedEmployee : (isFilteringPosition ? selectedPosition : 'All Employees')}
            </span>
            <span className="text-slate-600">|</span> 
            Selected Week: <span className="text-blue-400 font-bold">Week {selectedWeekIdx}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {leadingsToList.map((leadingKey) => {
          // Re-find the proper name casing for display
          let displayLeadingName = leadingKey.toUpperCase();
          
          const chartData: ChartDataPoint[] = [];
          let target = 0;
          let unit = '';
          let currentLeading: LeadingIndicator | null = null;
          let currentFilteredActual = 0; // For displaying in the header of the card

          // Build Historical Data
          for (let w = 1; w <= currentWeek; w++) {
            const weekData = yearData[month][w as Week];
            let score = 0;
            let actual = 0;
            let leading: LeadingIndicator | null = null;
            
            if (weekData) {
              const lag = weekData.indicators.find(l => l.id === activeLaggingId);
              const lead = lag?.leadings.find(l => l.name.toLowerCase().trim() === leadingKey);
              
              if (lead) {
                displayLeadingName = lead.name;
                const result = calculateFilteredScore(lead);
                score = parseFloat(result.score.toFixed(1));
                actual = parseFloat(result.actual.toFixed(2));
                
                leading = lead;
                if (lead.target) target = lead.target;
                if (lead.unit) unit = lead.unit;
                
                if (w === selectedWeekIdx) {
                    currentLeading = lead;
                    currentFilteredActual = actual;
                }
              }
            }
            
            chartData.push({ 
              name: `W${w}`, 
              score: score,
              leading: leading,
              fullDate: `Week ${w}`,
              contributorName: isFilteringEmployee ? selectedEmployee : undefined
            });
          }

          return (
            <div key={leadingKey} className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-colors">
              
              {/* CHART HEADER */}
              <div className="p-5 pb-0 flex items-center justify-between">
                 <div className="flex flex-col">
                    <h4 className="text-slate-200 font-bold text-sm uppercase tracking-wide flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                        {displayLeadingName}
                    </h4>
                    {isFilteringEmployee && (
                        <div className="flex items-center gap-1 mt-1 ml-6">
                            <span className="text-[10px] text-slate-500 uppercase">Individual Perf.</span>
                        </div>
                    )}
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-slate-500 block mb-0.5">Target: {target} {unit}</span>
                    {currentLeading && (
                        <span className={`text-xs font-bold ${getColorForScore(chartData[selectedWeekIdx-1]?.score || 0)}`}>
                            Act (W{selectedWeekIdx}): {currentFilteredActual}
                        </span>
                    )}
                 </div>
              </div>
              
              {/* CHART BODY */}
              <div className="h-[180px] w-full cursor-pointer p-5 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 115]} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#1e293b', opacity: 0.5 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const p = payload[0].payload;
                            return (
                                <div className="bg-slate-950 border border-slate-700 p-2 rounded shadow-xl text-xs">
                                    <p className="font-bold text-white mb-1">{p.fullDate}</p>
                                    <p className="text-blue-400 mb-1">Score: {payload[0].value}%</p>
                                    {p.contributorName && <p className="text-slate-500 italic mt-1">For: {p.contributorName}</p>}
                                </div>
                            );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40} animationDuration={800}>
                        {chartData.map((entry, index) => (
                            <React.Fragment key={`cell-${index}`}>
                                <LabelList dataKey="score" position="top" fill="#cbd5e1" fontSize={11} fontWeight="bold" formatter={(v: number) => v > 0 ? `${v}%` : ''} />
                                <text x={0} y={0} dy={0} fill="none" /> 
                            </React.Fragment>
                        ))}
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score >= 100 ? '#10b981' : entry.score >= 85 ? '#f59e0b' : '#f43f5e'} opacity={parseInt(entry.name.replace('W','')) === selectedWeekIdx ? 1 : 0.3} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* CONTROLS TABLE - STRICTLY FILTERED */}
              <div className="bg-slate-950/50 border-t border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Details (Week {selectedWeekIdx})
                      </h5>
                  </div>
                  
                  {(() => {
                      if (!currentLeading) return <div className="text-center py-3 text-xs text-slate-600 italic border border-dashed border-slate-800 rounded">No Data for Week {selectedWeekIdx}</div>;

                      // Filter controls based on Employee/Position
                      const filteredControls = currentLeading.controls.map(ctrl => {
                          const validContributors = (ctrl.contributors || []).filter(c => {
                               const posMatch = !isFilteringPosition || c.position === selectedPosition;
                               const empMatch = !isFilteringEmployee || c.name === selectedEmployee;
                               return posMatch && empMatch;
                          });

                          if (validContributors.length === 0) return null;

                          // Recalculate Average for this specific subset
                          const avgActual = validContributors.reduce((s, c) => s + c.actual, 0) / validContributors.length;
                          const score = ctrl.target > 0 ? (avgActual / ctrl.target) * 100 : 0;
                          
                          return {
                              ...ctrl,
                              actual: parseFloat(avgActual.toFixed(2)), // Override global actual with filtered actual
                              contributors: validContributors,
                              score: Math.min(score, 120)
                          };
                      }).filter(Boolean); // Remove nulls

                      if (filteredControls.length === 0) {
                          return <div className="text-center py-3 text-xs text-slate-600 italic border border-dashed border-slate-800 rounded">No relevant Control Indicators found for {selectedEmployee}.</div>;
                      }

                      return (
                          <div className="space-y-2">
                              {filteredControls.map((ctrl, cIdx) => (
                                  <div key={cIdx} className="flex items-center justify-between bg-slate-900 border border-slate-800/50 p-2.5 rounded hover:border-slate-700 transition-colors">
                                      <div className="flex-1 min-w-0 mr-4">
                                          <div className="flex items-center justify-between">
                                              <p className="text-sm text-slate-200 truncate font-medium">{ctrl!.name}</p>
                                              {/* Show name tag if filtered by employee */}
                                              {isFilteringEmployee && (
                                                  <div className="flex items-center text-[10px] text-blue-300 bg-blue-900/20 border border-blue-800/50 px-1.5 rounded ml-2 shrink-0">
                                                      <User className="w-2.5 h-2.5 mr-1" />
                                                      {selectedEmployee}
                                                  </div>
                                              )}
                                          </div>
                                          <div className="flex items-center gap-3 mt-1.5">
                                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                  <div className={`h-full ${getBgColorForScore(ctrl!.score)}`} style={{ width: `${Math.min(ctrl!.score, 100)}%` }}></div>
                                              </div>
                                              <div className="text-[10px] text-slate-400 flex gap-2 shrink-0">
                                                  <span>Act: <b className="text-slate-200">{ctrl!.actual}</b></span>
                                                  <span className="text-slate-600">/</span>
                                                  <span>Tgt: {ctrl!.target}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className={`text-sm font-bold ${getColorForScore(ctrl!.score)} w-10 text-right`}>
                                          {ctrl!.score.toFixed(0)}%
                                      </div>
                                  </div>
                              ))}
                          </div>
                      );
                  })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadingTrendChart;
