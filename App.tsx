
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_DATA, INFLUENCING_FACTORS, DEPARTMENTS_LIST, HEAD_OFFICE_DEPARTMENTS, JOBSITE_DEPARTMENTS, PREDEFINED_SHEET_URLS, JOBSITE_LIST } from './constants';
import { DashboardData, Month, Week, GlobalData, DepartmentYearlyData, MultiUploadPayload, Contributor, LaggingIndicator } from './types';
import { getLaggingScore, getProjectScore, calculateMTDData, createEmptyDashboardData, getBgColorForScore, getColorForScore, downloadAIReportPDF, checkIsDueSoon, processRawCSV, transformSheetUrl, getGoalsScore, getMandatoryScore, parseGoalValue, calculateGamificationScore } from './utils';
import LeadingTrendChart from './components/LeadingTrendChart';
import GoalsTrendChart from './components/GoalsTrendChart';
import MandatoryTrendChart from './components/MandatoryTrendChart';
import ActivitySummaryChart from './components/ActivitySummaryChart';
import UploadModal from './components/UploadModal';
import GamificationBoard from './components/GamificationBoard';
import MonitoringDashboard from './components/MonitoringDashboard';
import { Pickaxe, ChevronRight, BarChart3, Calendar, Upload, RefreshCw, ClipboardList, Loader2, Target, Calculator, ShieldCheck, Eye, MapPin, Building2, Briefcase, User, CalendarRange, Clock, Trophy, Users, Award, FileSpreadsheet, Link as LinkIcon, Settings, Layers, Database, CheckCircle2, Lock, ShieldAlert, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell } from 'recharts';

const getDataKey = (jobsite: string, department: string) => `${jobsite} - ${department}`;

const createEmptyYearlyData = (): DepartmentYearlyData => {
  const data: Partial<DepartmentYearlyData> = {};
  for (let m = 1; m <= 12; m++) {
    data[m as Month] = { 1: null, 2: null, 3: null, 4: null, 5: null };
  }
  return data as DepartmentYearlyData;
};

const initializeGlobalData = (): GlobalData => {
  const globalData: GlobalData = {};
  HEAD_OFFICE_DEPARTMENTS.forEach(dept => { globalData[getDataKey('HEAD OFFICE', dept)] = createEmptyYearlyData(); });
  JOBSITE_LIST.filter(j => j !== 'HEAD OFFICE').forEach(jobsite => {
      JOBSITE_DEPARTMENTS.forEach(dept => { globalData[getDataKey(jobsite, dept)] = createEmptyYearlyData(); });
  });
  return globalData;
};

const normalizeDepartmentName = (inputName: string): string => {
    if (!inputName) return "Unknown Department";
    const normalizedInput = inputName.trim().toLowerCase();
    const match = DEPARTMENTS_LIST.find(d => d.toLowerCase() === normalizedInput);
    if (match) return match;
    if (normalizedInput.includes('supply')) return 'Supply Management';
    if (normalizedInput.includes('finance')) return 'Finance & Accounting';
    if (normalizedInput.includes('hr') || normalizedInput.includes('human resource')) return 'Organizational Development';
    return inputName.trim();
};

const REQUIRED_INDICATORS = ['Productivity', 'Cycle Time', 'Availability'];

const App: React.FC = () => {
  const [globalData, setGlobalData] = useState<GlobalData>(initializeGlobalData());
  const [selectedJobsite, setSelectedJobsite] = useState<string>('HEAD OFFICE');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Corporate');
  const [selectedMonth, setSelectedMonth] = useState<Month>(1);
  const [selectedWeek, setSelectedWeek] = useState<Week>(1); 
  const [isMTD, setIsMTD] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('All Positions');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('All Employees');
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'GOALS' | 'MANDATORY' | 'ACTIVITY' | 'MONITORING' | 'EMPLOYEES'>('DASHBOARD');
  const [selectedLagId, setSelectedLagId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Record<string, string>>({});
  const [savedMasterUrl, setSavedMasterUrl] = useState<string | null>(null);

  const hasHardcodedUrls = useMemo(() => {
     const config = PREDEFINED_SHEET_URLS[selectedJobsite];
     if (!config) return false;
     return Object.values(config).some(deptConfig => deptConfig.performance.length > 5 || deptConfig.pica.length > 5);
  }, [selectedJobsite]);

  useEffect(() => {
     if (hasHardcodedUrls) {
        setSavedMasterUrl(null);
     } else {
        const url = localStorage.getItem(`url_${selectedJobsite}_MASTER`);
        setSavedMasterUrl(url);
     }
  }, [selectedJobsite, isUploadModalOpen, hasHardcodedUrls]);

  const availableDepartments = useMemo(() => {
    const defaultDepts = selectedJobsite === 'HEAD OFFICE' ? HEAD_OFFICE_DEPARTMENTS : ['All Departments', ...JOBSITE_DEPARTMENTS];
    const uploadedDepts = Object.keys(globalData).filter(key => key.startsWith(`${selectedJobsite} - `)).map(key => key.replace(`${selectedJobsite} - `, ''));
    return Array.from(new Set([...defaultDepts, ...uploadedDepts])).sort();
  }, [selectedJobsite, globalData]);

  useEffect(() => {
    if (!availableDepartments.includes(selectedDepartment)) {
        if (selectedJobsite === 'HEAD OFFICE') setSelectedDepartment('Corporate');
        else if (availableDepartments.length > 0) setSelectedDepartment(availableDepartments[0]);
    }
    setSelectedPosition('All Positions');
    setSelectedEmployee('All Employees');
  }, [selectedJobsite, availableDepartments, selectedDepartment]);

  useEffect(() => {
      setSelectedEmployee('All Employees');
  }, [selectedPosition]);

  const currentData = useMemo(() => {
    if (!selectedDepartment || selectedDepartment === 'Corporate' || selectedDepartment === 'All Departments') return null;
    const dataKey = getDataKey(selectedJobsite, selectedDepartment);
    const yearly = globalData[dataKey];
    if (isMTD) return calculateMTDData(yearly, selectedMonth, selectedWeek);
    return yearly?.[selectedMonth]?.[selectedWeek] || null;
  }, [globalData, selectedJobsite, selectedDepartment, selectedMonth, selectedWeek, isMTD]);
  
  useEffect(() => {
      if (currentData && currentData.indicators.length > 0) {
          if (!selectedLagId || !currentData.indicators.find(i => i.id === selectedLagId)) {
              setSelectedLagId(currentData.indicators[0].id);
          }
      } else {
          if (!selectedLagId) setSelectedLagId('lag-productivity');
      }
  }, [currentData, selectedLagId]);

  const filterOptions = useMemo(() => {
    if (!currentData) return { positions: [], employees: [] };
    const pos = new Set<string>();
    const emp = new Set<string>();
    const processItem = (name?: string, position?: string) => {
        if (!name || !position) return;
        pos.add(position);
        const isPositionMatch = selectedPosition === 'All Positions' || position === selectedPosition;
        if (isPositionMatch) emp.add(name);
    };
    currentData.picaRecords.forEach(r => processItem(r.employeeName, r.position));
    currentData.goals.forEach(r => processItem(r.employeeName, r.position));
    currentData.mandatoryRecords.forEach(r => processItem(r.employeeName, r.position));
    currentData.activityPlans.forEach(r => processItem(r.employeeName, r.position));
    currentData.indicators.forEach(lag => {
        lag.leadings.forEach(lead => {
            lead.contributors?.forEach(c => processItem(c.name, c.position));
            lead.controls.forEach(ctrl => {
                ctrl.contributors?.forEach(c => processItem(c.name, c.position));
            });
        });
    });
    return { positions: Array.from(pos).sort(), employees: Array.from(emp).sort() };
  }, [currentData, selectedPosition]);

  const employeePerformanceList = useMemo(() => {
      if (!currentData) return [];
      const stats: Record<string, { name: string, position: string, totalScore: number, count: number, tasks: string[], sources: Set<string> }> = {};
      const process = (name: string, position: string, score: number, taskName: string, sourceLabel: string) => {
          if (!name || name === 'Unknown' || name === '' || name === '-') return;
          const cleanName = name.trim();
          const lower = cleanName.toLowerCase();
          if (lower.includes('nama karyawan') || lower.includes('name') || lower.includes('jabatan') || lower.includes('position')) return;
          if (!stats[cleanName]) stats[cleanName] = { name: cleanName, position: position || '-', totalScore: 0, count: 0, tasks: [], sources: new Set() };
          if (!isNaN(score)) { stats[cleanName].totalScore += score; stats[cleanName].count += 1; }
          if (!stats[cleanName].tasks.includes(taskName)) stats[cleanName].tasks.push(taskName);
          stats[cleanName].sources.add(sourceLabel);
      };
      currentData.indicators.forEach(lag => {
          lag.leadings.forEach(lead => {
              lead.contributors?.forEach(c => {
                  const s = lead.target > 0 ? (c.actual / lead.target) * 100 : 0;
                  process(c.name, c.position, Math.min(s, 120), `KPI: ${lead.name}`, 'KPI (Perf)');
              });
              lead.controls.forEach(ctrl => {
                  ctrl.contributors?.forEach(c => {
                      const s = ctrl.target > 0 ? (c.actual / ctrl.target) * 100 : 0;
                      process(c.name, c.position, Math.min(s, 120), `Control: ${ctrl.name}`, 'KPI (Control)');
                  });
              });
          });
      });
      currentData.goals.forEach(g => {
          const t = parseGoalValue(g.target); const a = parseGoalValue(g.actual);
          const s = t > 0 ? (a/t)*100 : 0;
          process(g.employeeName || '', g.position || '', Math.min(s, 120), `Goal: ${g.goals}`, 'Project Goals');
      });
      currentData.mandatoryRecords.forEach(m => {
          const t = parseGoalValue(m.target); const a = parseGoalValue(m.actual);
          const s = t > 0 ? (a/t)*100 : 0;
          process(m.employeeName || '', m.position || '', Math.min(s, 120), `Mandatory: ${m.mandatory}`, 'Mandatory');
      });
      return Object.values(stats).map(s => ({ ...s, avgScore: s.count > 0 ? s.totalScore / s.count : 0 })).sort((a,b) => b.avgScore - a.avgScore);
  }, [currentData]);

  const effectiveData = useMemo(() => {
      if (!currentData) return null;
      if (selectedEmployee === 'All Employees' && selectedPosition === 'All Positions') return currentData;
      const filtered = JSON.parse(JSON.stringify(currentData)) as DashboardData;
      const match = (n?: string, p?: string) => {
          const posMatch = selectedPosition === 'All Positions' || p === selectedPosition;
          const empMatch = selectedEmployee === 'All Employees' || n === selectedEmployee;
          return posMatch && empMatch;
      };
      filtered.picaRecords = filtered.picaRecords.filter(r => match(r.employeeName, r.position));
      filtered.goals = filtered.goals.filter(r => match(r.employeeName, r.position));
      filtered.mandatoryRecords = filtered.mandatoryRecords.filter(r => match(r.employeeName, r.position));
      filtered.activityPlans = filtered.activityPlans.filter(r => match(r.employeeName, r.position));
      filtered.indicators.forEach(lag => {
          lag.leadings.forEach(lead => {
              if (lead.contributors && lead.contributors.length > 0) {
                  const rel = lead.contributors.filter(c => match(c.name, c.position));
                  lead.actual = rel.length > 0 ? rel.reduce((a, c) => a + c.actual, 0) / rel.length : 0;
              }
              lead.controls.forEach(ctrl => {
                   if (ctrl.contributors && ctrl.contributors.length > 0) {
                        const rel = ctrl.contributors.filter(c => match(c.name, c.position));
                        ctrl.actual = rel.length > 0 ? rel.reduce((a, c) => a + c.actual, 0) / rel.length : 0;
                   }
              });
          });
      });
      return filtered;
  }, [currentData, selectedEmployee, selectedPosition]);

  const chartYearData = useMemo(() => {
    const dataKey = getDataKey(selectedJobsite, selectedDepartment);
    return globalData[dataKey] || createEmptyYearlyData();
  }, [globalData, selectedJobsite, selectedDepartment]);

  const activeLagging = useMemo(() => {
    if (!effectiveData) return null;
    return effectiveData.indicators.find(ind => ind.id === selectedLagId) || null;
  }, [selectedLagId, effectiveData]);

  const handleUpload = (payloads: MultiUploadPayload, isBatchSync: boolean = false) => {
    setGlobalData(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as GlobalData;
      const processedWeeks = new Set<string>();
      payloads.forEach(payload => {
        let targetDept = normalizeDepartmentName(payload.department);
        if (selectedJobsite !== 'HEAD OFFICE' && targetDept === 'Finance & Accounting') targetDept = 'Finance';
        const dKey = getDataKey(selectedJobsite, targetDept);
        if (!next[dKey]) next[dKey] = createEmptyYearlyData();
        if (!next[dKey][payload.month]) next[dKey][payload.month] = { 1: null, 2: null, 3: null, 4: null, 5: null };
        const weekKey = `${dKey}-${payload.month}-${payload.week}`;
        let targetData = next[dKey][payload.month][payload.week];
        if (!processedWeeks.has(weekKey)) {
             if (isBatchSync) targetData = { indicators: [], picaRecords: [], goals: [], mandatoryRecords: [], activityPlans: [] };
             else if (!targetData) targetData = createEmptyDashboardData();
             processedWeeks.add(weekKey);
        }
        if (!targetData) targetData = createEmptyDashboardData();
        payload.leadings?.forEach(uploadItem => {
            let lagIndex = targetData!.indicators.findIndex(l => l.id === uploadItem.laggingId);
            if (lagIndex === -1) {
                targetData!.indicators.push({ id: uploadItem.laggingId, name: uploadItem.laggingName || "Unknown Lagging", weight: 10, target: 100, leadings: [] });
                lagIndex = targetData!.indicators.length - 1;
            }
            const lag = targetData!.indicators[lagIndex];
            const existingLeadIndex = lag.leadings.findIndex(l => l.name.toLowerCase() === uploadItem.leadingName.toLowerCase());
            const newContributor: Contributor = { name: uploadItem.employeeName || 'Unknown', position: uploadItem.position || 'Unknown', actual: uploadItem.actual };
            if (existingLeadIndex !== -1) {
                const existingLead = lag.leadings[existingLeadIndex];
                const mCont = [...(existingLead.contributors || [])];
                const cIdx = mCont.findIndex(c => c.name === newContributor.name && c.position === newContributor.position);
                if (cIdx >= 0) mCont[cIdx] = newContributor; else mCont.push(newContributor);
                lag.leadings[existingLeadIndex] = { ...existingLead, contributors: mCont, actual: mCont.length > 0 ? mCont.reduce((a, c) => a + c.actual, 0) / mCont.length : 0, target: uploadItem.target !== undefined ? uploadItem.target : existingLead.target };
            } else {
                lag.leadings.push({ id: `lead-dyn-${Date.now()}`, name: uploadItem.leadingName, weight: 10, target: uploadItem.target || 100, actual: uploadItem.actual, unit: uploadItem.unit || '%', controls: [], contributors: [newContributor] });
            }
        });
        payload.controls?.forEach(ctrlItem => {
             const lag = targetData!.indicators.find(l => l.id === ctrlItem.laggingId);
             if (lag) {
                 const lead = lag.leadings.find(l => l.name.toLowerCase() === ctrlItem.leadingName.toLowerCase());
                 if (lead) {
                     const existingCtrlIndex = lead.controls.findIndex(c => c.name.toLowerCase() === ctrlItem.controlName.toLowerCase());
                     const newCtrlContributor: Contributor = { name: ctrlItem.employeeName || 'Unknown', position: ctrlItem.position || 'Unknown', actual: ctrlItem.actual };
                     if (existingCtrlIndex !== -1) {
                         const existingCtrl = lead.controls[existingCtrlIndex];
                         const mCont = [...(existingCtrl.contributors || [])];
                         const cIdx = mCont.findIndex(c => c.name === newCtrlContributor.name && c.position === newCtrlContributor.position);
                         if (cIdx >= 0) mCont[cIdx] = newCtrlContributor; else mCont.push(newCtrlContributor);
                         lead.controls[existingCtrlIndex] = { ...existingCtrl, contributors: mCont, actual: mCont.length > 0 ? mCont.reduce((a, c) => a + c.actual, 0) / mCont.length : 0, target: ctrlItem.target !== undefined ? ctrlItem.target : existingCtrl.target };
                     } else {
                         lead.controls.push({ id: `ctrl-dyn-${Date.now()}`, name: ctrlItem.controlName, weight: 10, target: ctrlItem.target || 100, actual: ctrlItem.actual, unit: ctrlItem.unit || '%', contributors: [newCtrlContributor] });
                     }
                 }
             }
        });
        if (payload.picaRecords?.length) targetData.picaRecords = [...targetData.picaRecords, ...payload.picaRecords.map(r => ({...r, department: targetDept}))];
        if (payload.goals?.length) targetData.goals = [...targetData.goals, ...payload.goals.map(r => ({...r, department: targetDept}))];
        if (payload.mandatoryRecords?.length) targetData.mandatoryRecords = [...targetData.mandatoryRecords, ...payload.mandatoryRecords.map(r => ({...r, department: targetDept}))];
        if (payload.activityPlans?.length) targetData.activityPlans = [...targetData.activityPlans, ...payload.activityPlans.map(r => ({...r, department: targetDept}))];
        next[dKey][payload.month][payload.week] = targetData;
      });
      return next;
    });
  };
  
  const hasCustomUrl = useMemo(() => {
      if (savedMasterUrl && !hasHardcodedUrls) return true;
      if (!selectedDepartment || selectedDepartment === 'Corporate' || selectedDepartment === 'All Departments') return false;
      return !!localStorage.getItem(`url_${selectedJobsite}_${selectedDepartment}`);
  }, [selectedJobsite, selectedDepartment, savedMasterUrl, hasHardcodedUrls]);

  const handleQuickSync = async () => {
    if (!hasHardcodedUrls && !savedMasterUrl && selectedDepartment !== 'Corporate' && selectedDepartment !== 'All Departments' && !hasCustomUrl) {
        setIsUploadModalOpen(true);
        return;
    }
    setIsSyncing(true);
    try {
        const siteConfig = PREDEFINED_SHEET_URLS[selectedJobsite];
        let combined: MultiUploadPayload = [];
        const newTimes = { ...lastSyncTime };
        const useHardcoded = hasHardcodedUrls;
        const masterUrl = useHardcoded ? null : (savedMasterUrl || localStorage.getItem(`url_${selectedJobsite}_MASTER`));
        if (masterUrl) {
            const cleanUrl = transformSheetUrl(masterUrl);
            const res = await fetch(`${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}t=${Date.now()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const rawPayloads = processRawCSV(text, 'Corporate', selectedMonth, selectedWeek, false);
            if (rawPayloads.length > 0) {
                 combined = rawPayloads;
                 rawPayloads.forEach(p => { newTimes[getDataKey(selectedJobsite, p.department)] = new Date().toLocaleString(); });
            }
        } else {
            const deptsToSync = (selectedDepartment !== 'Corporate' && selectedDepartment !== 'All Departments') ? [selectedDepartment] : Object.keys(siteConfig || {}); 
            if (!deptsToSync.length && selectedDepartment) deptsToSync.push(selectedDepartment);
            await Promise.all(deptsToSync.map(async (dName) => {
                let urlsToFetch: string[] = [];
                const config = siteConfig?.[dName];
                if (useHardcoded) { if (config) urlsToFetch = [config.performance, config.pica, config.goals, config.mandatory, config.activity].filter(u => u && u.trim() !== ''); }
                else { const customUrl = localStorage.getItem(`url_${selectedJobsite}_${dName}`); if (customUrl) urlsToFetch = [customUrl]; else if (config) urlsToFetch = [config.performance, config.pica, config.goals, config.mandatory, config.activity].filter(u => u && u.trim() !== ''); }
                await Promise.all(urlsToFetch.map(async (url) => {
                    try {
                        const cleanUrl = transformSheetUrl(url);
                        const res = await fetch(`${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}t=${Date.now()}`);
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const text = await res.text();
                        const rawPayloads = processRawCSV(text, dName, selectedMonth, selectedWeek, true);
                        if (rawPayloads.length > 0) { combined = combined.concat(rawPayloads); newTimes[getDataKey(selectedJobsite, dName)] = new Date().toLocaleString(); }
                    } catch (e) { console.warn(`Failed to fetch ${url} for ${dName}`, e); }
                }));
            }));
        }
        if (combined.length > 0) { handleUpload(combined, true); setLastSyncTime(newTimes); }
        else { alert("Sync finished but no data found."); }
    } catch (err: any) { alert(`Sync failed: ${err.message}`); } finally { setIsSyncing(false); }
  };

  const renderSidebarIndicators = () => {
      const loaded = effectiveData?.indicators || [];
      const menuItems: { id: string, name: string }[] = [];
      REQUIRED_INDICATORS.forEach(req => {
          const match = loaded.find(l => l.name.trim().toLowerCase() === req.toLowerCase());
          if (match) menuItems.push({ id: match.id, name: match.name });
          else menuItems.push({ id: `lag-${req.toLowerCase().replace(/\s+/g, '-')}`, name: req });
      });
      loaded.forEach(ind => { if (!REQUIRED_INDICATORS.some(req => req.toLowerCase() === ind.name.trim().toLowerCase())) menuItems.push({ id: ind.id, name: ind.name }); });
      return menuItems.map(item => (
          <button key={item.id} onClick={() => { setSelectedLagId(item.id); setCurrentView('DASHBOARD'); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${currentView === 'DASHBOARD' && selectedLagId === item.id && selectedDepartment !== 'Corporate' && selectedDepartment !== 'All Departments' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'text-slate-400 hover:bg-slate-800'}`}>
            <div className="flex items-center space-x-3"><BarChart3 className="w-4 h-4" /><span className="font-medium truncate">{item.name}</span></div>
            <ChevronRight className="w-3 h-3 transition-transform opacity-0 group-hover:opacity-100" />
          </button>
      ));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleUpload} currentMonth={selectedMonth} currentWeek={selectedWeek} activeDepartment={selectedDepartment} departments={availableDepartments} selectedJobsite={selectedJobsite} />
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3"><div className="bg-blue-600 p-2 rounded-lg"><Pickaxe className="w-6 h-6 text-white" /></div><div><h1 className="font-bold text-lg tracking-tight">MINING 4DX</h1><p className="text-xs text-slate-500">Department Dashboard</p></div></div>
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
             <div className="flex items-center justify-between mb-2"><h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Source</h3></div>
             {hasHardcodedUrls ? (
                 <div className="flex items-center gap-2 text-blue-400 bg-blue-950/30 border border-blue-900/50 p-2 rounded-lg"><ShieldAlert className="w-4 h-4 shrink-0" /><div className="min-w-0"><p className="text-xs font-bold truncate">SYSTEM LOCKED</p><p className="text-[9px] text-slate-500 truncate">Official URLs Only</p></div></div>
             ) : savedMasterUrl ? (
                 <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4 shrink-0" /><div className="min-w-0"><p className="text-xs font-bold truncate">Master Sheet Linked</p><p className="text-[9px] text-slate-500 truncate">Stored in LocalStorage</p></div></div>
             ) : (
                 <div className="flex items-center gap-2 text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2 rounded-lg"><Database className="w-4 h-4 shrink-0" /><div className="min-w-0"><p className="text-xs font-bold truncate">No Data Source</p><p className="text-[9px] text-slate-500 truncate cursor-pointer hover:underline" onClick={() => setIsUploadModalOpen(true)}>Click to Configure</p></div></div>
             )}
        </div>
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">KPI Strategic</div><div className="space-y-1">{renderSidebarIndicators()}</div></div>
          <div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Project Management</div><div className="space-y-1">
            <button onClick={() => setCurrentView('GOALS')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${currentView === 'GOALS' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'text-slate-400 hover:bg-slate-800'}`}><div className="flex items-center space-x-3"><Target className="w-4 h-4" /><span>GOALS PROJECT</span></div></button>
            <button onClick={() => setCurrentView('MANDATORY')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${currentView === 'MANDATORY' ? 'bg-rose-900/30 text-rose-400 border border-rose-800/50' : 'text-slate-400 hover:bg-slate-800'}`}><div className="flex items-center space-x-3"><ShieldCheck className="w-4 h-4" /><span>MANDATORY</span></div></button>
            <button onClick={() => setCurrentView('ACTIVITY')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${currentView === 'ACTIVITY' ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' : 'text-slate-400 hover:bg-slate-800'}`}><div className="flex items-center space-x-3"><Calculator className="w-4 h-4" /><span>ACTIVITY PLAN</span></div></button>
            <button onClick={() => setCurrentView('MONITORING')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${currentView === 'MONITORING' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'text-slate-400 hover:bg-slate-800'}`}><div className="flex items-center space-x-3"><Eye className="w-4 h-4" /><span>DATA MONITORING</span></div></button>
          </div></div>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-3">
           <div className="flex gap-2">
               {hasHardcodedUrls ? (
                   <button onClick={handleQuickSync} disabled={isSyncing} className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg transition-colors border border-blue-500 shadow-lg shadow-blue-900/20"><RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /><span>{isSyncing ? 'Syncing...' : 'Sync Official Data'}</span></button>
               ) : savedMasterUrl ? (
                   <button onClick={handleQuickSync} disabled={isSyncing} className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white text-xs py-2 rounded-lg transition-colors border border-emerald-500"><RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /><span>{isSyncing ? 'Syncing...' : 'Sync Master Data'}</span></button>
               ) : (
                   <button onClick={() => setIsUploadModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg transition-colors border border-slate-700 animate-pulse"><Settings className="w-3 h-3" /><span>Configure Source</span></button>
               )}
           </div>
           <button onClick={() => setIsUploadModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-2 rounded-lg transition-colors border border-slate-700"><Upload className="w-4 h-4" /><span>Import Data</span></button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-6 overflow-x-auto pb-1 sm:pb-0">
             <div><label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Jobsite</label><select value={selectedJobsite} onChange={(e) => setSelectedJobsite(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none">{JOBSITE_LIST.map(site => <option key={site} value={site}>{site}</option>)}</select></div>
             <div><label className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">Department {hasCustomUrl && <span title="Data Source Connected" className="flex items-center gap-1 text-emerald-400"><LinkIcon className="w-3 h-3" /> <span className="text-[9px] font-bold">LINKED</span></span>}</label><select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none">{availableDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}</select></div>
             {selectedDepartment && selectedDepartment !== 'Corporate' && selectedDepartment !== 'All Departments' && (
               <>
                <div className="hidden xl:block"><label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Jabatan</label><select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"><option value="All Positions">All Positions</option>{filterOptions.positions.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div className="hidden xl:block"><label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Karyawan</label><select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"><option value="All Employees">All Employees</option>{filterOptions.employees.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
                <div className="hidden lg:block"><label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Bulan</label><select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value) as Month)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none">{months.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}</select></div>
                <div className="hidden lg:block"><label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Minggu</label><select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value) as Week)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none">{[1, 2, 3, 4, 5].map(w => <option key={w} value={w}>Minggu {w}</option>)}</select></div>
               </>
             )}
          </div>
          <div className="flex items-center gap-4"><button onClick={() => setIsMTD(!isMTD)} className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${isMTD ? 'bg-purple-900/30 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{isMTD ? 'MTD' : 'Weekly'}</button></div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {currentView === 'MONITORING' ? <MonitoringDashboard globalData={globalData} month={selectedMonth} week={selectedWeek} lastSyncTime={lastSyncTime} departments={availableDepartments} selectedJobsite={selectedJobsite} /> :
           currentView === 'GOALS' ? <div className="animate-[fadeIn_0.3s_ease-out]"><h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Target className="w-6 h-6 text-emerald-400" />Goals Project</h2><GoalsTrendChart yearData={chartYearData} selectedDepartment={selectedDepartment} month={selectedMonth} currentWeek={selectedWeek} currentGoals={effectiveData?.goals || []} /></div> :
           currentView === 'MANDATORY' ? <div className="animate-[fadeIn_0.3s_ease-out]"><h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-rose-400" />Mandatory</h2><MandatoryTrendChart yearData={chartYearData} selectedDepartment={selectedDepartment} month={selectedMonth} currentWeek={selectedWeek} currentRecords={effectiveData?.mandatoryRecords || []} /></div> :
           currentView === 'ACTIVITY' ? <div className="animate-[fadeIn_0.3s_ease-out]"><h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Calculator className="w-6 h-6 text-amber-400" />Activity Plan</h2><ActivitySummaryChart data={effectiveData?.activityPlans || []} isCorporate={false} /></div> :
           currentView === 'EMPLOYEES' ? (
              <div className="animate-[fadeIn_0.3s_ease-out]"><h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Award className="w-6 h-6 text-indigo-400" />Employee Performance Leaderboard</h2><div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">{employeePerformanceList.length === 0 ? <div className="p-12 text-center flex flex-col items-center"><Users className="w-12 h-12 text-slate-700 mb-4" /><p className="text-slate-500 italic text-lg">Tidak ada data karyawan ditemukan untuk periode ini.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-300"><thead className="bg-slate-950 uppercase font-bold text-slate-500 border-b border-slate-800 text-xs"><tr><th className="px-6 py-4 w-12 text-center">Rank</th><th className="px-6 py-4">Employee Details</th><th className="px-6 py-4 text-center">Avg Score</th><th className="px-6 py-4 text-center">Tasks</th><th className="px-6 py-4">Data Source</th><th className="px-6 py-4">Involvement</th></tr></thead><tbody className="divide-y divide-slate-800">{employeePerformanceList.map((emp, idx) => (<tr key={idx} className="hover:bg-slate-800/50 transition-colors group"><td className="px-6 py-4 text-center font-bold text-slate-500">#{idx + 1}</td><td className="px-6 py-4"><div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{emp.name}</div><div className="text-xs text-blue-300/80 mt-0.5 flex items-center gap-1"><Briefcase className="w-3 h-3" /> {emp.position}</div></td><td className="px-6 py-4"><div className="flex flex-col items-center"><span className={`text-lg font-black ${getColorForScore(emp.avgScore)}`}>{emp.avgScore.toFixed(0)}%</span><div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden"><div className={`h-full ${getBgColorForScore(emp.avgScore)}`} style={{ width: `${Math.min(emp.avgScore, 100)}%` }}></div></div></div></td><td className="px-6 py-4 text-center"><span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-bold border border-slate-700">{emp.count} Items</span></td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{Array.from(emp.sources).map((src, i) => (<span key={i} className="flex items-center gap-1 text-[10px] bg-indigo-900/30 border border-indigo-800/50 px-2 py-1 rounded text-indigo-300"><FileSpreadsheet className="w-3 h-3" /> {src}</span>))}</div></td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{emp.tasks.slice(0, 3).map((t, i) => (<span key={i} className="text-[10px] bg-slate-800/50 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 truncate max-w-[150px]">{t}</span>))}{emp.tasks.length > 3 && <span className="text-[10px] text-slate-500 px-1">+{emp.tasks.length - 3} more</span>}</div></td></tr>))}</tbody></table></div>}</div></div>
           ) :
           (selectedDepartment === 'Corporate' || selectedDepartment === 'All Departments' ? <GamificationBoard globalData={globalData} month={selectedMonth} week={selectedWeek} isMTD={isMTD} onSelectDepartment={(d)=>{setSelectedDepartment(d);setCurrentView('DASHBOARD');}} departments={availableDepartments} selectedJobsite={selectedJobsite} /> :
           (!effectiveData || !activeLagging ? <div className="flex flex-col items-center justify-center h-96 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed mt-8"><Upload className="w-8 h-8 mb-4" /><p className="text-lg font-medium text-slate-300">No Data Available</p><p className="text-xs text-slate-600 mt-2">Check Month/Week filters or Import Data.</p><button onClick={() => setIsUploadModalOpen(true)} className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg">Import Data Now</button></div> :
           <div className="mt-4 animate-[fadeIn_0.5s_ease-out]"><div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"><div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2" title="Score: KPI Strategic x Goals x Mandatory"><Info className="w-3.5 h-3.5 text-slate-600 cursor-help" /></div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overall Score</h3><div className="text-5xl font-black text-white">{calculateGamificationScore(effectiveData).toFixed(1)}<span className="text-xl text-slate-600">%</span></div><p className="text-[9px] text-slate-600 mt-2 font-bold uppercase">KPI STRATEGIC x GOALS x MANDATORY</p></div><div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:'KPI Strategic',val:getProjectScore(effectiveData.indicators)},{name:'GOALS',val:getGoalsScore(effectiveData.goals)},{name:'MANDATORY',val:getMandatoryScore(effectiveData.mandatoryRecords)}]}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="name" stroke="#64748b" /><YAxis domain={[0,120]} hide /><Bar dataKey="val" barSize={60} radius={[4,4,0,0]}><Cell fill="#3b82f6" /><Cell fill="#10b981" /><Cell fill="#f43f5e" /><LabelList dataKey="val" position="top" fill="#cbd5e1" fontSize={12} fontWeight="bold" formatter={(v:any)=>`${v.toFixed(1)}%`} /></Bar></BarChart></ResponsiveContainer></div></div></div><LeadingTrendChart yearData={chartYearData} selectedDepartment={selectedDepartment} month={selectedMonth} currentWeek={selectedWeek} activeLaggingId={activeLagging.id} selectedPosition={selectedPosition} selectedEmployee={selectedEmployee} /></div>))}
        </div>
      </main>
    </div>
  );
};

const months = [ { val: 1, name: 'Januari' }, { val: 2, name: 'Februari' }, { val: 3, name: 'Maret' }, { val: 4, name: 'April' }, { val: 5, name: 'Mei' }, { val: 6, name: 'Juni' }, { val: 7, name: 'Juli' }, { val: 8, name: 'Agustus' }, { val: 9, name: 'September' }, { val: 10, name: 'Oktober' }, { val: 11, name: 'November' }, { val: 12, name: 'Desember' } ];

export default App;
