
import React, { useMemo, useState } from 'react';
import { GlobalData, Month, Week, ControlIndicator } from '../types';
import { calculateMTDData, calculateGamificationScore, getProjectScore, getGoalsScore, getMandatoryScore, getLeadingScore, parseGoalValue, getColorForScore, getBgColorForScore, calculateControlScore } from '../utils';
import { Trophy, Star, ChevronRight, AlertCircle, CalendarRange, X, BarChart3, ArrowLeft, Target, ShieldCheck, PieChart, ExternalLink, Activity, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface GamificationBoardProps {
  globalData: GlobalData;
  month: Month;
  week: Week;
  isMTD: boolean;
  onSelectDepartment: (dept: string) => void;
  departments: string[];
  selectedJobsite: string;
}

const RANK_CONFIG = [
  { label: 'EXCELLENT', color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500', glow: 'bg-emerald-500', shadow: 'shadow-emerald-900/40' },
  { label: 'VERY GOOD', color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500', glow: 'bg-blue-500', shadow: 'shadow-blue-900/40' },
  { label: 'GOOD', color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500', glow: 'bg-cyan-500', shadow: 'shadow-cyan-900/40' },
  { label: 'FAIR', color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500', glow: 'bg-yellow-500', shadow: 'shadow-yellow-900/40' },
  { label: 'POOR', color: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500', glow: 'bg-orange-500', shadow: 'shadow-orange-900/40' },
  { label: 'CRITICAL', color: 'text-rose-500', border: 'border-rose-600', bg: 'bg-rose-600', glow: 'bg-rose-600', shadow: 'shadow-rose-900/40' }
];

const COMPONENT_COLORS = {
  'KPI Strategic': '#3b82f6', // Blue
  'Goals Project': '#10b981', // Emerald
  'Mandatory': '#f43f5e', // Rose
};

// Configuration for Lagging Indicator distinctions
const LAGGING_THEMES: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  'PRODUCTIVITY': { color: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500', icon: Activity },
  'CYCLE TIME': { color: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500', icon: Clock },
  'AVAILABILITY': { color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500', icon: Zap },
};

const GamificationBoard: React.FC<GamificationBoardProps> = ({ globalData, month, week, isMTD, onSelectDepartment, departments, selectedJobsite }) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  
  // Drill Down State
  const [drillDownCategory, setDrillDownCategory] = useState<string | null>(null); // Level 1 -> 2
  const [selectedLeadingItem, setSelectedLeadingItem] = useState<{ name: string; controls: ControlIndicator[]; parentLag: string } | null>(null); // Level 2 -> 3

  // Calculate rankings for Departments (Exclude Corporate/All Depts)
  const rankings = useMemo(() => {
    // Filter out Corporate or All Departments from ranking list if present
    const activeDepts = departments.filter(d => d !== 'Corporate' && d !== 'All Departments');
    
    const scores = activeDepts.map(dept => {
      const dataKey = `${selectedJobsite} - ${dept}`;
      let data;
      if (isMTD) {
        data = calculateMTDData(globalData[dataKey], month, week);
      } else {
        data = globalData[dataKey]?.[month]?.[week];
      }
      const score = calculateGamificationScore(data);
      return { dept, score, hasData: !!data, rawData: data };
    });
    return scores.sort((a, b) => b.score - a.score);
  }, [globalData, month, week, isMTD, departments, selectedJobsite]);

  // Selected Department Data for Modal
  const activeDeptData = useMemo(() => {
    if (!selectedDept) return null;
    const item = rankings.find(r => r.dept === selectedDept);
    if (!item || !item.rawData) return null;
    return item.rawData;
  }, [selectedDept, rankings]);

  // Level 1 Chart Data (Summary)
  const summaryChartData = useMemo(() => {
    if (!activeDeptData) return [];
    return [
      { name: 'KPI Strategic', score: parseFloat(getProjectScore(activeDeptData.indicators).toFixed(1)), fill: COMPONENT_COLORS['KPI Strategic'], icon: PieChart },
      { name: 'Goals Project', score: parseFloat(getGoalsScore(activeDeptData.goals).toFixed(1)), fill: COMPONENT_COLORS['Goals Project'], icon: Target },
      { name: 'Mandatory', score: parseFloat(getMandatoryScore(activeDeptData.mandatoryRecords).toFixed(1)), fill: COMPONENT_COLORS['Mandatory'], icon: ShieldCheck },
    ];
  }, [activeDeptData]);

  // Level 2 Drill Down Data
  const drillDownDetails = useMemo(() => {
    if (!activeDeptData || !drillDownCategory) return [];

    if (drillDownCategory === 'KPI Strategic') {
      const details: { name: string; score: number; parentLag: string; controls: ControlIndicator[] }[] = [];
      activeDeptData.indicators.forEach(lag => {
        lag.leadings.forEach(lead => {
          details.push({
            name: lead.name,
            score: getLeadingScore(lead),
            parentLag: lag.name,
            controls: lead.controls
          });
        });
      });
      return details;
    }

    if (drillDownCategory === 'Goals Project') {
      return activeDeptData.goals.map(g => {
        const t = parseGoalValue(g.target);
        const a = parseGoalValue(g.actual);
        const s = t > 0 ? Math.min((a/t)*100, 120) : 0;
        return {
          name: g.goals,
          score: s,
          subtitle: `Actual: ${g.actual} / Target: ${g.target}`
        };
      });
    }

    if (drillDownCategory === 'Mandatory') {
      return activeDeptData.mandatoryRecords.map(m => {
        const t = parseGoalValue(m.target);
        const a = parseGoalValue(m.actual);
        const s = t > 0 ? Math.min((a/t)*100, 120) : 0;
        return {
          name: m.mandatory,
          score: s,
          subtitle: `Compliance: ${m.actual} / ${m.target}`
        };
      });
    }

    return [];
  }, [activeDeptData, drillDownCategory]);


  const handleCardClick = (dept: string) => {
    setSelectedDept(dept);
    setDrillDownCategory(null);
    setSelectedLeadingItem(null);
  };

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      setDrillDownCategory(data.name);
      setSelectedLeadingItem(null);
    }
  };

  const handleLevel2ItemClick = (item: any) => {
    if (drillDownCategory === 'KPI Strategic' && item.controls) {
      setSelectedLeadingItem({
        name: item.name,
        controls: item.controls,
        parentLag: item.parentLag
      });
    }
  };

  const handleBack = () => {
    if (selectedLeadingItem) {
      setSelectedLeadingItem(null);
    } else if (drillDownCategory) {
      setDrillDownCategory(null);
    } else {
      setSelectedDept(null);
    }
  };

  const closeModal = () => {
    setSelectedDept(null);
    setDrillDownCategory(null);
    setSelectedLeadingItem(null);
  };

  const handleGoToDashboard = () => {
    if (selectedDept) {
      onSelectDepartment(selectedDept);
      closeModal();
    }
  };

  // Helper UI functions
  const getRankBadge = (index: number) => {
    const config = RANK_CONFIG[index] || RANK_CONFIG[5]; 
    if (index <= 2) {
      return (
        <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border-2 ${config.border} shadow-lg ${config.color}`}>
           <Trophy className="w-6 h-6" />
           <div className={`absolute -top-2 -right-2 w-6 h-6 ${config.bg} rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-900`}>#{index + 1}</div>
        </div>
      );
    }
    return <div className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm border ${config.border} ${config.color}`}>#{index + 1}</div>;
  };

  const getStarRating = (score: number) => {
    const stars = score >= 98 ? 5 : score >= 90 ? 4 : score >= 80 ? 3 : score >= 70 ? 2 : 1;
    return (
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => ( <Star key={i} className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} /> ))}
      </div>
    );
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" />Department Leaderboard</h2>
           <p className="text-slate-400 text-sm">Rankings based on Score: <strong>KPI Strategic</strong> x <strong>Goals</strong> x <strong>Mandatory</strong></p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
           <CalendarRange className="w-3.5 h-3.5 text-blue-400" />
           <span className="text-slate-300">Period: <span className="text-white">M{month}-W{week}</span> ({isMTD ? 'Month-to-Date' : 'Weekly'})</span>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {rankings.slice(0, 3).map((item, idx) => {
          const config = RANK_CONFIG[idx] || RANK_CONFIG[5];
          return (
            <div key={item.dept} onClick={() => handleCardClick(item.dept)} className={`relative bg-slate-900 border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden ${config.border} ${config.shadow}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-20 transform translate-x-10 -translate-y-10 ${config.glow}`}></div>
              <div className="relative z-10 flex items-start justify-between">
                 {getRankBadge(idx)}
                 <div className="text-right"><p className="text-3xl font-bold text-white">{item.hasData ? item.score.toFixed(1) : '---'}%</p>{getStarRating(item.score)}</div>
              </div>
              <div className="relative z-10 mt-4">
                 <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.dept}</h3>
                 <div className="flex items-center justify-between mt-1"><p className="text-xs text-slate-500 uppercase tracking-wider">Total Score</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.bg} text-white uppercase`}>{config.label}</span></div>
                 <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${config.bg}`} style={{ width: `${Math.min(item.score, 100)}%` }}></div></div>
                 <div className="mt-4 flex items-center text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Breakdown <BarChart3 className="w-3 h-3 ml-1" /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remaining List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between"><h3 className="font-bold text-slate-300">All Departments</h3><span className="text-xs text-slate-500">{rankings.length} Depts</span></div>
         <div className="divide-y divide-slate-800">
            {rankings.slice(3).map((item, idx) => {
                const rankIdx = idx + 3; const config = RANK_CONFIG[rankIdx] || RANK_CONFIG[5];
                return (
                  <div key={item.dept} onClick={() => handleCardClick(item.dept)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 cursor-pointer transition-colors group">
                      <div className="flex items-center space-x-4">{getRankBadge(rankIdx)}<div><h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.dept}</h4>{!item.hasData && <span className="text-[10px] text-rose-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> No Data Uploaded</span>}</div></div>
                      <div className="flex items-center space-x-6"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${config.border} ${config.color} bg-slate-900 hidden sm:block uppercase`}>{config.label}</span><div className="text-right hidden sm:block">{getStarRating(item.score)}</div><div className="w-20 text-right"><span className={`text-lg font-bold ${item.hasData ? (item.score >= 90 ? 'text-emerald-400' : 'text-slate-200') : 'text-slate-600'}`}>{item.hasData ? `${item.score.toFixed(1)}%` : '---'}</span></div><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" /></div>
                  </div>
                );
            })}
         </div>
      </div>

      {/* DRILL DOWN MODAL */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                     {drillDownCategory && (
                       <button onClick={handleBack} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                       </button>
                     )}
                     <div>
                        <h2 className="text-xl font-bold text-white">{selectedDept}</h2>
                        <div className="flex items-center text-xs text-slate-400 mt-0.5 space-x-1">
                           <span className={!drillDownCategory ? 'text-blue-400 font-bold' : ''}>Performance</span>
                           {drillDownCategory && (
                              <>
                                <ChevronRight className="w-3 h-3" />
                                <span className={!selectedLeadingItem ? 'text-blue-400 font-bold' : ''}>{drillDownCategory}</span>
                              </>
                           )}
                           {selectedLeadingItem && (
                              <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-blue-400 font-bold">{selectedLeadingItem.name}</span>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={handleGoToDashboard} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                     >
                        <ExternalLink className="w-3.5 h-3.5" /> Open Dashboard
                     </button>
                     <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                 {!activeDeptData ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                       <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                       <p>No data available for this period.</p>
                    </div>
                 ) : (
                    <>
                      {/* LEVEL 1: SUMMARY BAR CHART */}
                      {!drillDownCategory && (
                        <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
                           <div className="mb-4 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-blue-400" />
                              <span>Click on any bar below to view detailed breakdown.</span>
                           </div>
                           <div className="h-[300px] w-full mt-4">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={summaryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                                    <XAxis type="number" domain={[0, 120]} hide />
                                    <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} tick={{ fontSize: 12, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                      cursor={{ fill: '#1e293b', opacity: 0.5 }}
                                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                      itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={40} cursor="pointer" onClick={handleBarClick}>
                                       {summaryChartData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                       ))}
                                       <LabelList dataKey="score" position="right" fill="#cbd5e1" fontSize={12} fontWeight="bold" formatter={(val: number) => `${val}%`} />
                                    </Bar>
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                      )}

                      {/* LEVEL 2: DRILL DOWN LIST */}
                      {drillDownCategory && !selectedLeadingItem && (
                         <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                            {drillDownDetails.length > 0 ? (
                               drillDownDetails.map((item, idx) => {
                                  const lagTheme = (item as any).parentLag && LAGGING_THEMES[(item as any).parentLag] 
                                    ? LAGGING_THEMES[(item as any).parentLag] 
                                    : null;
                                  
                                  const isClickable = drillDownCategory === 'KPI Strategic';

                                  return (
                                    <div 
                                      key={idx} 
                                      onClick={() => handleLevel2ItemClick(item)}
                                      className={`bg-slate-950 border border-slate-800 rounded-lg p-4 relative overflow-hidden transition-all ${isClickable ? 'cursor-pointer hover:bg-slate-900 hover:border-slate-700' : ''}`}
                                    >
                                       {lagTheme && <div className={`absolute left-0 top-0 bottom-0 w-1 ${lagTheme.bg}`}></div>}

                                       <div className="flex justify-between items-start mb-2 pl-2">
                                          <div>
                                             <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                {item.name}
                                                {isClickable && <ChevronRight className="w-4 h-4 text-slate-600" />}
                                             </h4>
                                             {(item as any).parentLag ? (
                                                <div className="flex items-center gap-1 mt-1">
                                                  {lagTheme && <lagTheme.icon className={`w-3 h-3 ${lagTheme.color}`} />}
                                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-opacity-10 ${lagTheme?.color} ${lagTheme?.border} ${lagTheme?.bg?.replace('bg-', 'bg-opacity-10 ')}`}>
                                                      {(item as any).parentLag}
                                                  </span>
                                                </div>
                                             ) : (
                                                <p className="text-xs text-slate-500 mt-1">{(item as any).subtitle}</p>
                                             )}
                                          </div>
                                          <span className={`text-sm font-bold ${getColorForScore(item.score)}`}>{item.score.toFixed(1)}%</span>
                                       </div>
                                       <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden ml-2">
                                          <div 
                                             className={`h-full ${getBgColorForScore(item.score)} transition-all duration-1000`} 
                                             style={{ width: `${Math.min(item.score, 100)}%` }}
                                          />
                                       </div>
                                    </div>
                                  );
                               })
                            ) : (
                               <div className="text-center py-8 text-slate-500">No parameters found for this category.</div>
                            )}
                         </div>
                      )}

                      {/* LEVEL 3: CONTROL INDICATORS */}
                      {selectedLeadingItem && (
                         <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 p-2 rounded border border-slate-800">
                               <Activity className="w-4 h-4" />
                               <span>Breakdown of <strong>{selectedLeadingItem.name}</strong></span>
                            </div>
                            
                            {selectedLeadingItem.controls.map((ctrl) => {
                               const ctrlScore = calculateControlScore(ctrl);
                               return (
                                  <div key={ctrl.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-200">{ctrl.name}</span>
                                        <div className="text-right">
                                           <div className="flex items-center justify-end gap-2 text-sm">
                                              <span className="text-slate-400">Target: <span className="text-white">{ctrl.target}</span></span>
                                              <span className="text-slate-600">|</span>
                                              <span className="text-emerald-400 font-bold">Actual: {ctrl.actual}</span>
                                           </div>
                                           <span className="text-[10px] text-slate-500">{ctrl.unit}</span>
                                        </div>
                                     </div>
                                     <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                           className={`absolute top-0 left-0 h-full ${getBgColorForScore(ctrlScore)}`} 
                                           style={{ width: `${Math.min(ctrlScore, 100)}%` }}
                                        />
                                     </div>
                                     <div className="flex justify-end mt-1">
                                        <span className={`text-xs font-bold ${getColorForScore(ctrlScore)}`}>
                                           Score: {ctrlScore.toFixed(0)}%
                                        </span>
                                     </div>
                                  </div>
                               );
                            })}
                         </div>
                      )}
                    </>
                 )}
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default GamificationBoard;
