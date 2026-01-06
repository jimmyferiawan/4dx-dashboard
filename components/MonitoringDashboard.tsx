
import React from 'react';
import { GlobalData, Month, Week } from '../types';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface MonitoringDashboardProps {
  globalData: GlobalData;
  month: Month;
  week: Week;
  lastSyncTime: Record<string, string>;
  departments: string[];
  selectedJobsite: string;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ globalData, month, week, lastSyncTime, departments, selectedJobsite }) => {
  const activeDepartments = departments.filter(d => d !== 'Corporate' && d !== 'All Departments');

  const getStatus = (dept: string) => {
    const dataKey = `${selectedJobsite} - ${dept}`;
    const data = globalData[dataKey]?.[month]?.[week];
    
    // STRICT CHECK:
    // Hanya dianggap 'Active' jika objek data ADA dan memiliki isi (Leading Indicators > 0).
    // Jika data terupload tapi isinya kosong (misal header CSV salah), maka tetap dianggap 'Empty'.
    const hasPerformance = data ? data.indicators.some(lag => lag.leadings.length > 0) : false;

    // Cek spesifik untuk modul lain (List based)
    const hasPica = data ? (data.picaRecords && data.picaRecords.length > 0) : false;
    const hasGoals = data ? (data.goals && data.goals.length > 0) : false;
    const hasMandatory = data ? (data.mandatoryRecords && data.mandatoryRecords.length > 0) : false;
    const hasActivity = data ? (data.activityPlans && data.activityPlans.length > 0) : false;

    // Hitung Achievement Bar
    const total = 5;
    const current = (hasPerformance ? 1 : 0) + (hasPica ? 1 : 0) + (hasGoals ? 1 : 0) + (hasActivity ? 1 : 0) + (hasMandatory ? 1 : 0);
    const achievement = (current / total) * 100;

    return { hasPerformance, hasPica, hasGoals, hasMandatory, hasActivity, achievement };
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-purple-400" />
          Sync Monitoring: {selectedJobsite}
        </h2>
        <p className="text-slate-400 text-sm">
            Status data untuk <span className="text-white font-bold">M{month} - W{week}</span>. 
            Indikator hijau menandakan data <strong className="text-emerald-400">valid dan berisi</strong>.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 uppercase font-bold text-slate-500 border-b border-slate-800 text-xs">
                <tr>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Data Completeness</th>
                <th className="px-6 py-4 text-center">Performance</th>
                <th className="px-6 py-4 text-center">PICA</th>
                <th className="px-6 py-4 text-center">Goals</th>
                <th className="px-6 py-4 text-center">Mandatory</th>
                <th className="px-6 py-4 text-center">Activity</th>
                <th className="px-6 py-4 text-right">Last Sync</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {activeDepartments.map((dept) => {
                const status = getStatus(dept);
                const dataKey = `${selectedJobsite} - ${dept}`;
                const lastSync = lastSyncTime[dataKey];

                const Badge = ({ active, label = "Imported" }: { active: boolean, label?: string }) => (
                    <div className="flex justify-center">
                        {active ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/50 shadow-sm shadow-emerald-900/20">
                            <CheckCircle className="w-3.5 h-3.5" /> {label}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 opacity-60">
                            <XCircle className="w-3.5 h-3.5" /> Empty
                            </span>
                        )}
                    </div>
                );

                return (
                    <tr key={dept} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">{dept}</td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                            <div 
                                className={`h-full transition-all duration-1000 ${status.achievement === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : status.achievement >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                style={{ width: `${status.achievement}%` }} 
                            />
                        </div>
                        <span className={`text-xs font-bold w-8 text-right ${status.achievement === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {status.achievement.toFixed(0)}%
                        </span>
                        </div>
                    </td>
                    <td className="px-6 py-4"><Badge active={status.hasPerformance} label="Active" /></td>
                    <td className="px-6 py-4"><Badge active={status.hasPica} /></td>
                    <td className="px-6 py-4"><Badge active={status.hasGoals} /></td>
                    <td className="px-6 py-4"><Badge active={status.hasMandatory} /></td>
                    <td className="px-6 py-4"><Badge active={status.hasActivity} /></td>
                    <td className="px-6 py-4 text-right">
                        {lastSync ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/30 px-1.5 rounded border border-emerald-900/30">{lastSync.split(',')[1]}</span>
                                <span className="text-[9px] text-slate-600 mt-0.5">{lastSync.split(',')[0]}</span>
                            </div>
                        ) : (
                            <span className="text-slate-600 font-mono text-[10px] italic">Not Synced</span>
                        )}
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

export default MonitoringDashboard;
