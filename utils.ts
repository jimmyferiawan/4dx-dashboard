
import { jsPDF } from 'jspdf';
import { ControlIndicator, LeadingIndicator, LaggingIndicator, DashboardData, DepartmentYearlyData, GlobalData, Month, Week, UploadPayload, MultiUploadPayload, PICARecord, GoalRecord, ActivityPlanRecord, MandatoryRecord } from './types';
import { INITIAL_DATA, DEPARTMENTS_LIST } from './constants';

// --- CALCULATION LOGIC ---

export const calculateControlScore = (ctrl: ControlIndicator): number => {
  if (ctrl.target === 0) return 0;
  const score = (ctrl.actual / ctrl.target) * 100;
  return Math.min(score, 120); 
};

export const getLeadingScore = (leading: LeadingIndicator): number => {
  if (leading.target === 0) return 0;
  const score = (leading.actual / leading.target) * 100;
  return Math.min(score, 120);
};

export const getLaggingScore = (lagging: LaggingIndicator): number => {
  if (!lagging.leadings || lagging.leadings.length === 0) return 0;
  let totalWeightedScore = 0;
  let totalWeight = 0;
  lagging.leadings.forEach(lead => {
    const score = getLeadingScore(lead);
    totalWeightedScore += (score * lead.weight);
    totalWeight += lead.weight;
  });
  if (totalWeight === 0) return 0;
  return totalWeightedScore / totalWeight;
};

/**
 * KPI Strategic Score: Average of Lagging Productivity, Cycle Time, and Availability
 */
export const getProjectScore = (laggings: LaggingIndicator[]): number => {
  if (!laggings || laggings.length === 0) return 0;
  
  const targets = ['Productivity', 'Cycle Time', 'Availability'];
  let sum = 0;
  let foundCount = 0;

  targets.forEach(targetName => {
    const match = laggings.find(l => l.name.trim().toLowerCase().includes(targetName.toLowerCase()));
    if (match) {
      sum += getLaggingScore(match);
      foundCount++;
    }
  });

  if (foundCount === 0) return 0;
  return sum / foundCount;
};

// --- NUMBER PARSING (INDONESIA VS US SUPPORT) ---
export const parseGoalValue = (val: string | number): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  
  let str = val.toString().trim();
  if (str === '') return 0; // Handle empty string explicitly
  
  const dotIndex = str.indexOf('.');
  const commaIndex = str.indexOf(',');

  if (dotIndex !== -1 && commaIndex !== -1) {
    if (dotIndex < commaIndex) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (commaIndex !== -1) {
     str = str.replace(',', '.');
  }

  const cleanVal = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleanVal);
  return isNaN(num) ? 0 : num;
};

export const getGoalsScore = (goals: GoalRecord[]): number => {
  if (!goals || goals.length === 0) return 0;
  let totalScore = 0;
  goals.forEach(goal => {
    const target = parseGoalValue(goal.target);
    const actual = parseGoalValue(goal.actual);
    if (target > 0) {
      totalScore += Math.min((actual / target) * 100, 120); 
    }
  });
  return totalScore / goals.length;
};

export const getMandatoryScore = (records: MandatoryRecord[]): number => {
  if (!records || records.length === 0) return 0;
  let totalScore = 0;
  records.forEach(rec => {
    const target = parseGoalValue(rec.target);
    const actual = parseGoalValue(rec.actual);
    if (target > 0) {
      totalScore += Math.min((actual / target) * 100, 120);
    }
  });
  return totalScore / records.length;
};

export const getActivityScore = (plans: ActivityPlanRecord[]): number => {
  if (!plans || plans.length === 0) return 0;
  let totalScore = 0;
  plans.forEach(plan => {
    const target = parseGoalValue(plan.target);
    const actual = parseGoalValue(plan.actual);
    if (target > 0) {
      totalScore += Math.min((actual / target) * 100, 120);
    }
  });
  return totalScore / plans.length;
};

export const calculateGamificationScore = (data: DashboardData | null): number => {
  if (!data) return 0;
  
  const kpiScoreDecimal = getProjectScore(data.indicators) / 100;
  const goalsScoreDecimal = getGoalsScore(data.goals) / 100;
  const mandatoryScoreDecimal = getMandatoryScore(data.mandatoryRecords) / 100;
  
  let resultProduct = 1;
  let hasActiveComponents = false;
  
  // Multiplicative logic: Score = KPI (x) Goals (x) Mandatory
  if (data.indicators.some(l => l.leadings.length > 0)) {
    resultProduct *= kpiScoreDecimal;
    hasActiveComponents = true;
  }
  
  if (data.goals.length > 0) {
    resultProduct *= goalsScoreDecimal;
    hasActiveComponents = true;
  }
  
  if (data.mandatoryRecords.length > 0) {
    resultProduct *= mandatoryScoreDecimal;
    hasActiveComponents = true;
  }

  if (!hasActiveComponents) return 0;
  
  return parseFloat((resultProduct * 100).toFixed(1));
};

export const getColorForScore = (score: number) => {
  if (score >= 95) return 'text-emerald-400';
  if (score >= 85) return 'text-amber-400';
  return 'text-rose-400';
};

export const getBgColorForScore = (score: number) => {
  if (score >= 95) return 'bg-emerald-500';
  if (score >= 85) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const checkIsDueSoon = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let due = new Date(dateStr);
  if (isNaN(due.getTime())) {
     const parts = dateStr.split(/[-/.]/);
     if (parts.length === 3) {
         if (parts[0].length === 4) {
             due = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
         } else {
             due = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
         }
     }
  }
  if (isNaN(due.getTime())) return false;
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
};

export const createEmptyDashboardData = (): DashboardData => {
  const data = JSON.parse(JSON.stringify(INITIAL_DATA)) as DashboardData;
  data.indicators.forEach(lag => {
    lag.leadings = []; 
  });
  data.picaRecords = [];
  data.goals = [];
  data.mandatoryRecords = [];
  data.activityPlans = [];
  return data;
};

export const calculateMTDData = (deptData: DepartmentYearlyData, month: Month, currentWeek: Week): DashboardData | null => {
  if (!deptData) return null;
  let hasData = false;
  for (let w = 1; w <= currentWeek; w++) {
    if (deptData[month][w as Week] !== null) { hasData = true; break; }
  }
  if (!hasData) return null;
  
  let template: DashboardData | null = null;
  for (let w = currentWeek; w >= 1; w--) {
      if (deptData[month][w as Week]) {
          template = JSON.parse(JSON.stringify(deptData[month][w as Week]));
          break;
      }
  }
  if (!template) template = createEmptyDashboardData();
  
  template.indicators.forEach(lag => lag.leadings = []);

  const aggregatedLeadings: Record<string, Record<string, { 
    totalActual: number, count: number, target: number, unit: string, 
    controls: Record<string, { totalActual: number, count: number, target: number, unit: string }> 
  }>> = {};

  for (let w = 1; w <= currentWeek; w++) {
      const weekData = deptData[month][w as Week];
      if (!weekData) continue;

      weekData.indicators.forEach(lag => {
          if (!aggregatedLeadings[lag.name]) aggregatedLeadings[lag.name] = {};
          
          lag.leadings.forEach(lead => {
              const leadKey = lead.name.toLowerCase().trim(); 
              // BLOCK 'Process Efficiency' from MTD aggregation
              if (leadKey === 'process efficiency') return;

              if (!aggregatedLeadings[lag.name][leadKey]) {
                  aggregatedLeadings[lag.name][leadKey] = { 
                      totalActual: 0, count: 0, target: lead.target, unit: lead.unit, controls: {} 
                  };
              }
              if (lead.actual > 0 || (lead.contributors && lead.contributors.length > 0)) {
                  aggregatedLeadings[lag.name][leadKey].totalActual += lead.actual;
                  aggregatedLeadings[lag.name][leadKey].count++;
              }
              lead.controls.forEach(ctrl => {
                  const ctrlKey = ctrl.name.toLowerCase();
                  if (!aggregatedLeadings[lag.name][leadKey].controls[ctrlKey]) {
                      aggregatedLeadings[lag.name][leadKey].controls[ctrlKey] = { 
                          totalActual: 0, count: 0, target: ctrl.target, unit: ctrl.unit 
                      };
                  }
                  if (ctrl.actual > 0 || (ctrl.contributors && ctrl.contributors.length > 0)) {
                      aggregatedLeadings[lag.name][leadKey].controls[ctrlKey].totalActual += ctrl.actual;
                      aggregatedLeadings[lag.name][leadKey].controls[ctrlKey].count++;
                  }
              });
          });
      });
  }

  template.indicators = Object.keys(aggregatedLeadings).map((lagName) => {
      const aggLeads = aggregatedLeadings[lagName];
      const newLag: LaggingIndicator = {
          id: `mtd-lag-${normalizeName(lagName)}`,
          name: lagName,
          weight: 10,
          target: 100,
          leadings: []
      };
      Object.keys(aggLeads).forEach(leadKey => {
          const d = aggLeads[leadKey];
          const newLead: LeadingIndicator = {
              id: `mtd-lead-${normalizeName(leadKey)}`,
              name: leadKey.toUpperCase(),
              weight: 10,
              target: d.target,
              actual: d.count > 0 ? parseFloat((d.totalActual / d.count).toFixed(2)) : 0,
              unit: d.unit,
              contributors: [],
              controls: []
          };
          Object.keys(d.controls).forEach(ctrlKey => {
              const c = d.controls[ctrlKey];
              newLead.controls.push({
                  id: `mtd-ctrl-${normalizeName(ctrlKey)}`,
                  name: ctrlKey.toUpperCase(),
                  weight: 10,
                  target: c.target,
                  actual: c.count > 0 ? parseFloat((c.totalActual / c.count).toFixed(2)) : 0,
                  unit: c.unit,
                  contributors: []
              });
          });
          newLag.leadings.push(newLead);
      });
      return newLag;
  });

  template.picaRecords = [];
  template.goals = [];
  template.mandatoryRecords = [];
  template.activityPlans = [];
  for (let w = 1; w <= currentWeek; w++) {
    const weekData = deptData[month][w as Week];
    if (weekData) {
      if(weekData.picaRecords) template.picaRecords.push(...weekData.picaRecords);
      if(weekData.goals) template.goals.push(...weekData.goals);
      if(weekData.mandatoryRecords) template.mandatoryRecords.push(...weekData.mandatoryRecords);
      if(weekData.activityPlans) template.activityPlans.push(...weekData.activityPlans);
    }
  }
  return template;
};

// --- PARSING LOGIC ---

const normalizeName = (name: string) => name?.toLowerCase().trim().replace(/[^a-z0-9]/g, '-') || '';

const parseMonthName = (val: string): number => {
  const v = normalizeName(val).replace(/-/g, '');
  if (!v) return 0;
  const num = parseInt(v.replace(/\D/g, ''));
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'may', 'jun', 'jul', 'agu', 'aug', 'sep', 'okt', 'oct', 'nov', 'des', 'dec'];
  for(let i = 0; i < months.length; i++) { if (v.includes(months[i])) return (i % 12) + 1; }
  return 0;
};

const parseWeekName = (val: string): number => {
  const v = normalizeName(val);
  if (!v) return 0;
  const num = parseInt(v.replace(/\D/g, ''));
  if (!isNaN(num)) return num;
  return 0;
};

const generateLaggingId = (name: string) => `lag-${normalizeName(name) || 'unknown'}`;

export const generateCSVTemplate = (data: DashboardData, month: number, week: number): string => ['Month', 'Week', 'Department', 'Nama Karyawan', 'Jabatan', 'Lagging Indicator', 'Leading Indicator', 'Leading Unit', 'Leading Target', 'Leading Actual', 'Control Name/Parameter', 'Control Unit', 'Control Target', 'Control Actual'].join(',');
export const generatePICATemplate = (month: number, week: number): string => "Month,Week,Department,Nama Karyawan,Jabatan,Lagging Indicator,Leading Indicator,PROBLEM,WHY 1,WHY 2,WHY 3,WHY 4,WHY 5,IDENTIFICATION,CORRECTIVE ACTION,DUE DATE,PERSON IN CHARGE";
export const generateGoalsTemplate = (month: number, week: number): string => "Month,Week,Department,Nama Karyawan,Jabatan,Goals,Unit,Target,Actual";
export const generateMandatoryTemplate = (month: number, week: number): string => "Month,Week,Department,Nama Karyawan,Jabatan,MANDATORY,Unit,Target,Actual";
export const generateActivityTemplate = (month: number, week: number): string => "Month,Week,Department,Nama Karyawan,Jabatan,AP Corporate,Key Result,To Do List,Due Date,Unit,Target,Actual";

export const splitTextIntoRows = (text: string): string[] => {
  const rows: string[] = [];
  let currentRow = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') inQuotes = !inQuotes;
    if (!inQuotes && (char === '\n' || char === '\r')) {
       if (char === '\r' && i + 1 < text.length && text[i+1] === '\n') i++;
       if (currentRow.trim()) rows.push(currentRow);
       currentRow = '';
    } else currentRow += char;
  }
  if (currentRow.trim()) rows.push(currentRow);
  return rows;
};

const detectDelimiter = (text: string): string => {
  const lines = text.split('\n').slice(0, 10);
  let commaCount = 0;
  let tabCount = 0;
  let semiCount = 0;
  lines.forEach(line => {
     commaCount += (line.match(/,/g) || []).length;
     tabCount += (line.match(/\t/g) || []).length;
     semiCount += (line.match(/;/g) || []).length;
  });
  if (commaCount > tabCount && commaCount > semiCount) return ',';
  if (tabCount >= commaCount) return '\t';
  if (semiCount > commaCount) return ';';
  return ',';
};

const splitCSVLine = (line: string, delimiter: string): string[] => {
  if (delimiter === '\t') return line.split('\t').map(h => h.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
  const regex = new RegExp(`${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`);
  return line.split(regex).map(h => h.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
};

const findHeaderRowIndex = (lines: string[], keywords: string[]): number => {
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some(k => line.includes(k))) return i;
  }
  return 0;
};

const findColumnIndex = (header: string[], aliases: string[]) => {
  const lh = header.map(h => h.toLowerCase().trim());
  for (const a of aliases) { const i = lh.indexOf(a); if (i !== -1) return i; }
  for (const a of aliases) { const i = lh.findIndex(h => h.includes(a)); if (i !== -1) return i; }
  return -1;
};

const getVal = (parts: string[], idx: number) => (idx === -1 || idx >= parts.length) ? '' : parts[idx]?.trim() || '';

export const parseCSV = (csvText: string, department: string, defaultMonth: Month, defaultWeek: Week, overrideDepartment: boolean = false): MultiUploadPayload => {
  const rows = splitTextIntoRows(csvText);
  const delimiter = detectDelimiter(csvText);
  const groupedData: Record<string, UploadPayload> = {};
  
  const hIdx = findHeaderRowIndex(rows, ['control', 'leading', 'parameter', 'month', 'week', 'goals', 'mandatory', 'activity', 'plan', 'nama', 'jabatan', 'ap corporate', 'key result']);
  const header = splitCSVLine(rows[hIdx], delimiter);
  
  const findIdx = (a: string[]) => findColumnIndex(header, a);
  const idxM = findIdx(['month', 'bulan']);
  const idxW = findIdx(['week', 'minggu']);
  const idxD = findIdx(['department', 'dept']);
  const idxN = findIdx(['nama karyawan', 'nama', 'name', 'employee', 'karyawan', 'pic', 'person', 'person in charge']);
  const idxP = findIdx(['jabatan', 'position', 'role', 'job', 'title', 'posisi']);
  
  const idxLag = findIdx(['lagging', 'kpi']);
  const idxLead = findIdx(['leading', 'parameter', 'main parameter']);
  const idxLeadU = findIdx(['leading unit', 'uom', 'satuan']);
  const idxLA = findIdx(['leading actual', 'actual leading', 'actual', 'result']);
  const idxLT = findIdx(['leading target', 'target leading', 'target', 'plan']);
  
  const idxCN = findIdx(['control', 'parameter', 'sub parameter']);
  const idxCU = findIdx(['control unit', 'unit control']);
  const idxCA = findIdx(['control actual', 'actual control']);
  const idxCT = findIdx(['control target', 'target control']);

  const idxGoals = findIdx(['goals', 'goal', 'target project']);
  const idxGoalTarget = findIdx(['goal target', 'target']);
  const idxGoalActual = findIdx(['goal actual', 'actual']);

  const idxMandatory = findIdx(['mandatory', 'kepatuhan']);
  const idxMandatoryTarget = findIdx(['mandatory target']); 
  const idxMandatoryActual = findIdx(['mandatory actual']);

  const idxAPCorp = findIdx(['ap corporate', 'interlock to kpi strategic', 'ap corp']);
  const idxKeyResult = findIdx(['key result', 'activity plan', 'aktivitas']);
  const idxTodoList = findIdx(['to do list', 'todolist']);
  const idxDueDateAct = findIdx(['due date', 'deadline']);
  
  let lastLaggingName = '';
  let lastLeadingName = '';

  for (let i = hIdx + 1; i < rows.length; i++) {
    const parts = splitCSVLine(rows[i], delimiter);
    if (parts.length <= 1 && !parts[0]) continue;

    let rowDept = department;
    if (!overrideDepartment) {
         const rawDept = getVal(parts, idxD);
         if (rawDept) rowDept = rawDept; 
    }

    let rm = defaultMonth;
    if (idxM !== -1) { const mVal = parseMonthName(getVal(parts, idxM)); if (mVal > 0) rm = mVal as Month; }
    
    let rw = defaultWeek;
    if (idxW !== -1) { const wVal = parseWeekName(getVal(parts, idxW)); if (wVal > 0) rw = wVal as Week; }

    const rowName = getVal(parts, idxN);
    if (rowName) {
        const lowerName = rowName.toLowerCase();
        if (lowerName === 'nama karyawan' || lowerName === 'name' || lowerName === 'employee' || lowerName === 'pic') continue;
    }

    const rowPos = getVal(parts, idxP);
    const key = `${rowDept}-${rm}-${rw}`;
    if (!groupedData[key]) groupedData[key] = { department: rowDept, month: rm, week: rw, controls: [], leadings: [], picaRecords: [], goals: [], mandatoryRecords: [], activityPlans: [] };
    
    const ctrlN = getVal(parts, idxCN);
    let leadN = getVal(parts, idxLead);

    // BLOCK 'Process Efficiency' - If this indicator is found, skip the entire row
    if (leadN && leadN.toLowerCase().trim() === 'process efficiency') {
        continue; 
    }

    if (leadN) {
        lastLeadingName = leadN;
    } else if (ctrlN || (rowName && lastLeadingName)) {
        leadN = lastLeadingName;
        // Inherited block check
        if (leadN.toLowerCase().trim() === 'process efficiency') continue;
    }

    let lagN = getVal(parts, idxLag);
    if (lagN) {
        lastLaggingName = lagN;
    } else if (leadN) {
        lagN = lastLaggingName;
    }

    if (lagN && (leadN || ctrlN || (leadN && rowName))) {
        const laggingId = generateLaggingId(lagN);
        const la = parseGoalValue(getVal(parts, idxLA));
        const ltRaw = getVal(parts, idxLT);
        const lt = ltRaw ? parseGoalValue(ltRaw) : undefined;
        const lu = getVal(parts, idxLeadU) || '%';
        const ca = parseGoalValue(getVal(parts, idxCA));
        const ct = parseGoalValue(getVal(parts, idxCT));
        const cu = getVal(parts, idxCU) || '%';

        if (leadN) {
            groupedData[key].leadings.push({ 
              laggingId, laggingName: lagN, leadingName: leadN, actual: la, target: lt, unit: lu, employeeName: rowName, position: rowPos 
            });
        }
        if (ctrlN) {
            groupedData[key].controls.push({ 
                laggingId, laggingName: lagN, leadingName: leadN, controlName: ctrlN, actual: ca, target: ct, unit: cu, employeeName: rowName, position: rowPos 
            });
        }
    }

    const goalVal = getVal(parts, idxGoals);
    if (goalVal && idxGoals !== -1) {
       groupedData[key].goals.push({
           id: `goal-${Date.now()}-${Math.random()}`,
           month: rm, week: rw, department: rowDept, employeeName: rowName, position: rowPos,
           goals: goalVal,
           target: getVal(parts, idxGoalTarget !== -1 ? idxGoalTarget : idxLT) || '100',
           actual: getVal(parts, idxGoalActual !== -1 ? idxGoalActual : idxLA) || '0',
           unit: '%'
       });
    }

    const mandVal = getVal(parts, idxMandatory);
    if (mandVal && idxMandatory !== -1) {
       groupedData[key].mandatoryRecords.push({
           id: `mand-${Date.now()}-${Math.random()}`,
           month: rm, week: rw, department: rowDept, employeeName: rowName, position: rowPos,
           mandatory: mandVal,
           target: getVal(parts, idxMandatoryTarget !== -1 ? idxMandatoryTarget : idxLT) || '100',
           actual: getVal(parts, idxMandatoryActual !== -1 ? idxMandatoryActual : idxLA) || '0',
           unit: '%'
       });
    }

    const krVal = getVal(parts, idxKeyResult);
    if (krVal && idxKeyResult !== -1) {
       groupedData[key].activityPlans.push({
           id: `act-${Date.now()}-${Math.random()}`,
           month: rm, week: rw, department: rowDept, employeeName: rowName, position: rowPos,
           apCorporate: getVal(parts, idxAPCorp),
           keyResult: krVal,
           todoList: getVal(parts, idxTodoList),
           dueDate: getVal(parts, idxDueDateAct),
           target: getVal(parts, idxLT) || '100',
           actual: getVal(parts, idxLA) || '0',
           unit: getVal(parts, idxLeadU) || '%'
       });
    }
  }
  return Object.values(groupedData);
};

export const parsePICACSV = (csvText: string, department: string, defaultMonth: Month, defaultWeek: Week, overrideDepartment: boolean = false): MultiUploadPayload => {
  return parseCSV(csvText, department, defaultMonth, defaultWeek, overrideDepartment); 
};

export const transformSheetUrl = (url: string): string => {
  let f = url.trim();
  let gid = '0';
  const gidMatch = f.match(/[#&?]gid=([0-9]+)/);
  if (gidMatch) gid = gidMatch[1];
  if (f.includes('/pubhtml')) f = f.replace('/pubhtml', '/pub'); 
  if (f.includes('/d/e/') || f.includes('/pub')) {
      if (!f.includes('output=csv')) f += (f.includes('?') ? '&' : '?') + 'output=csv';
      return f;
  }
  const idMatch = f.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv&gid=${gid}`; 
  }
  return f;
};

export const processRawCSV = (text: string, defaultDepartment: string, currentMonth: Month, currentWeek: Week, overrideDepartment: boolean = false): MultiUploadPayload => {
    const headerSample = text.split('\n').slice(0, 8).join(' ').toLowerCase(); 
    if (headerSample.includes('problem') && (headerSample.includes('corrective') || headerSample.includes('root cause'))) return parsePICACSV(text, defaultDepartment, currentMonth, currentWeek, overrideDepartment);
    return parseCSV(text, defaultDepartment, currentMonth, currentWeek, overrideDepartment);
};

export const downloadAIReportPDF = (reportText: string, periodName: string) => {
  const doc = new jsPDF();
  const margin = 20, maxW = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 20;
  doc.setFontSize(16); doc.text(`AI Analysis Report`, margin, y); y += 10;
  doc.setFontSize(12); doc.setTextColor(80, 80, 80); doc.text(`Context: ${periodName}`, margin, y); y += 15;
  doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  const clean = reportText.replace(/\*\*/g, '').replace(/#/g, '').replace(/\n\n/g, '\n');
  const lines = doc.splitTextToSize(clean, maxW);
  lines.forEach((l: string) => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(l, margin, y); y += 6;
  });
  doc.save(`AI_Report_${periodName}.pdf`);
};
