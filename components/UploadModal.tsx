
import React, { useState, useEffect } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download, Link as LinkIcon, Loader2, Info, Briefcase, Target, Calculator, FileText, ShieldCheck, Building2, Save, Layers } from 'lucide-react';
import { Month, Week, MultiUploadPayload } from '../types';
import { generateCSVTemplate, generatePICATemplate, generateGoalsTemplate, generateActivityTemplate, generateMandatoryTemplate, processRawCSV, transformSheetUrl } from '../utils';
import { INITIAL_DATA } from '../constants';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: MultiUploadPayload, isBatchSync?: boolean) => void;
  currentMonth: Month;
  currentWeek: Week;
  activeDepartment: string;
  departments: string[];
  selectedJobsite?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, currentMonth, currentWeek, activeDepartment, departments, selectedJobsite = 'HEAD OFFICE' }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [isMasterSheet, setIsMasterSheet] = useState(false);
  
  // Default to first non-corporate department if active is corporate, otherwise stick to active
  const initialTarget = activeDepartment === 'Corporate' && departments.length > 0 
      ? (departments.filter(d => d !== 'Corporate')[0] || '') 
      : activeDepartment;

  const [targetDepartment, setTargetDepartment] = useState(initialTarget);

  // Update target when active department changes externally
  useEffect(() => {
    if (activeDepartment !== 'Corporate') {
      setTargetDepartment(activeDepartment);
    } else {
       const firstAvailable = departments.filter(d => d !== 'Corporate')[0];
       if (firstAvailable) setTargetDepartment(firstAvailable);
    }
  }, [activeDepartment, departments]);

  // AUTO-LOAD SAVED URL
  useEffect(() => {
    if (isOpen && selectedJobsite) {
        // First check if a Master URL exists
        const masterUrl = localStorage.getItem(`url_${selectedJobsite}_MASTER`);
        if (masterUrl) {
            setSpreadsheetUrl(masterUrl);
            setIsMasterSheet(true);
        } else if (targetDepartment) {
            // Fallback to department specific
            const deptUrl = localStorage.getItem(`url_${selectedJobsite}_${targetDepartment}`);
            if (deptUrl) {
                setSpreadsheetUrl(deptUrl);
                setIsMasterSheet(false);
            } else {
                setSpreadsheetUrl('');
                setIsMasterSheet(false);
            }
        }
    }
  }, [targetDepartment, selectedJobsite, isOpen]);

  // When toggling Master Sheet, try to load its URL if saved
  useEffect(() => {
      if (!isOpen) return;
      if (isMasterSheet) {
          const masterUrl = localStorage.getItem(`url_${selectedJobsite}_MASTER`);
          if (masterUrl) setSpreadsheetUrl(masterUrl);
      } else {
          const deptUrl = localStorage.getItem(`url_${selectedJobsite}_${targetDepartment}`);
          if (deptUrl) setSpreadsheetUrl(deptUrl);
          else setSpreadsheetUrl('');
      }
  }, [isMasterSheet, selectedJobsite, targetDepartment, isOpen]);

  if (!isOpen) return null;

  const handleDownloadTemplate = (type: 'data' | 'pica' | 'goals' | 'activity' | 'mandatory') => {
    let csvContent = '';
    let filename = '';

    if (type === 'data') {
        csvContent = generateCSVTemplate(INITIAL_DATA, currentMonth, currentWeek);
        filename = `4dx_control_data_M${currentMonth}_W${currentWeek}.csv`;
    } else if (type === 'pica') {
        csvContent = generatePICATemplate(currentMonth, currentWeek);
        filename = `4dx_PICA_form_M${currentMonth}_W${currentWeek}.csv`;
    } else if (type === 'goals') {
        csvContent = generateGoalsTemplate(currentMonth, currentWeek);
        filename = `4dx_goals_project_M${currentMonth}_W${currentWeek}.csv`;
    } else if (type === 'activity') {
        csvContent = generateActivityTemplate(currentMonth, currentWeek);
        filename = `4dx_activity_plan_M${currentMonth}_W${currentWeek}.csv`;
    } else if (type === 'mandatory') {
        csvContent = generateMandatoryTemplate(currentMonth, currentWeek);
        filename = `4dx_mandatory_M${currentMonth}_W${currentWeek}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processText = (text: string) => {
    try {
        // IMPORTANT: If Master Sheet, overrideDepartment = FALSE. We trust the CSV 'Department' column.
        // If Individual, overrideDepartment = TRUE. We force the selected department.
        const overrideDept = !isMasterSheet;
        
        const payloadArray = processRawCSV(text, targetDepartment, currentMonth, currentWeek, overrideDept);

        // PASS TRUE FOR ISBATCHSYNC to Replace/Clear previous data for this week
        onUpload(payloadArray, true);
        
        const uniquePeriods = payloadArray.map(p => `M${p.month}-W${p.week}`).filter((v, i, a) => a.indexOf(v) === i).join(', ');
        const deptCount = new Set(payloadArray.map(p => p.department)).size;
        
        setSuccess(`Success! Imported ${deptCount} department(s) data (${payloadArray.length} batches).`);
        
        setError(null);
        
        setTimeout(() => {
            onClose();
            setSuccess(null);
        }, 2000);
    } catch (err: any) {
        setError(err.message || "Failed to process data.");
        setSuccess(null);
        console.error(err);
    }
  };

  const handleImportFromUrl = async () => {
    if (!spreadsheetUrl) {
      setError("Please enter a valid Google Sheets URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const cleanUrl = transformSheetUrl(spreadsheetUrl);
      const joiner = cleanUrl.includes('?') ? '&' : '?';
      const fetchUrl = `${cleanUrl}${joiner}t=${Date.now()}`;

      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`Failed to fetch. Status: ${response.status}`);
      
      const text = await response.text();
      if (text.trim().startsWith('<!DOCTYPE html>')) {
         throw new Error("Received HTML. Ensure sheet is Published to Web (CSV).");
      }

      // SAVE URL LOGIC
      if (isMasterSheet) {
          localStorage.setItem(`url_${selectedJobsite}_MASTER`, spreadsheetUrl);
          // Optional: Clear individual ones to avoid confusion? No, keep them as fallbacks.
      } else {
          localStorage.setItem(`url_${selectedJobsite}_${targetDepartment}`, spreadsheetUrl);
          // Remove Master if user explicitly sets individual? No, let user manage.
      }
      
      localStorage.setItem('lastSheetUrl', spreadsheetUrl);

      processText(text);

    } catch (err: any) {
      setError(err.message || "Network error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-emerald-600/20 p-3 rounded-full">
            <LinkIcon className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-white">Configure Data Source</h2>
             <p className="text-xs text-slate-400">Setup Google Sheet connection for <strong>{selectedJobsite}</strong></p>
          </div>
        </div>

        {/* MASTER SHEET TOGGLE */}
        <div className="mb-6 bg-slate-950 p-3 rounded border border-slate-800">
            <label className="flex items-center space-x-3 cursor-pointer">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isMasterSheet ? 'bg-blue-600 border-blue-600' : 'bg-slate-900 border-slate-600'}`}>
                    {isMasterSheet && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={isMasterSheet} onChange={(e) => setIsMasterSheet(e.target.checked)} />
                <div>
                    <span className="text-sm font-bold text-white block">Use as Master Sheet</span>
                    <span className="text-[10px] text-slate-400 block">This sheet contains data for ALL departments (Column C = Department Name)</span>
                </div>
            </label>
        </div>

        {!isMasterSheet && (
            <div className="mb-4 space-y-2 animate-[fadeIn_0.3s_ease-out]">
                <label className="text-xs text-slate-400 font-medium uppercase">Select Department</label>
                <div className="relative">
                    <select 
                        value={targetDepartment}
                        onChange={(e) => setTargetDepartment(e.target.value)}
                        className="w-full appearance-none bg-slate-950 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {departments.filter(d => d !== 'Corporate').map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <Building2 className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
            </div>
        )}

        <div className="space-y-3 mb-6">
          <label className="text-xs text-slate-400 font-medium flex justify-between items-center">
              <span>Google Spreadsheet URL (Published as CSV)</span>
              {spreadsheetUrl && (
                  <span className="text-emerald-400 text-[10px] bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
                      <Save className="w-3 h-3" /> URL SAVED IN STORAGE
                  </span>
              )}
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={spreadsheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <p className="text-[10px] text-slate-500">
             {isMasterSheet 
                ? "This URL will be saved as the MASTER SOURCE for this Jobsite." 
                : `This URL will be saved specifically for ${targetDepartment}.`
             }
          </p>
        </div>
        
        <button
            onClick={handleImportFromUrl}
            disabled={loading || !spreadsheetUrl}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{loading ? 'Save & Sync Data' : 'Save & Sync Data'}</span>
          </button>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/30 border border-rose-900/50 rounded flex items-start space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-900/50 rounded flex items-start space-x-2 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-3">Download Templates:</span>
            <div className="grid grid-cols-5 gap-2">
              <button onClick={() => handleDownloadTemplate('data')} className="col-span-1 flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                <Download className="w-4 h-4 mb-1" /> <span>Perf</span>
              </button>
              <button onClick={() => handleDownloadTemplate('pica')} className="col-span-1 flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                <FileText className="w-4 h-4 mb-1" /> <span>PICA</span>
              </button>
              <button onClick={() => handleDownloadTemplate('goals')} className="col-span-1 flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                <Target className="w-4 h-4 mb-1" /> <span>Goal</span>
              </button>
              <button onClick={() => handleDownloadTemplate('mandatory')} className="col-span-1 flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 mb-1" /> <span>Mand</span>
              </button>
              <button onClick={() => handleDownloadTemplate('activity')} className="col-span-1 flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                <Calculator className="w-4 h-4 mb-1" /> <span>Act</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
