
export interface Contributor {
  name: string;
  position: string;
  actual: number;
}

export interface ControlIndicator {
  id: string;
  name: string;
  weight: number; // Percentage (e.g., 40 for 40%)
  target: number;
  actual: number; // The value input by the user for the current week
  unit: string;
  contributors?: Contributor[];
}

export interface LeadingIndicator {
  id: string;
  name: string;
  weight: number;
  target: number; // The target for the leading indicator itself
  actual: number; // The actual value for the leading indicator itself
  unit: string;   // The unit (e.g., bcm/hr, %)
  controls: ControlIndicator[];
  contributors?: Contributor[];
}

export interface LaggingIndicator {
  id: string;
  name: string;
  weight: number;
  target: number;
  leadings: LeadingIndicator[];
}

export interface PICARecord {
  id: string;
  month: Month;
  week: Week;
  department?: string; 
  employeeName?: string;
  position?: string;
  laggingName: string;
  leadingName: string;
  controlName: string;
  problem: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCause: string; // IDENTIFICATION
  correctiveAction: string;
  dueDate: string;
  pic: string;
}

export interface GoalRecord {
  id: string;
  month: Month;
  week: Week;
  department?: string;
  employeeName?: string;
  position?: string;
  goals: string;
  unit?: string;
  target: string; // String to allow text descriptions or numbers
  actual: string;
}

export interface MandatoryRecord {
  id: string;
  month: Month;
  week: Week;
  department?: string;
  employeeName?: string;
  position?: string;
  mandatory: string;
  unit?: string;
  target: string;
  actual: string;
}

export interface ActivityPlanRecord {
  id: string;
  month: Month;
  week: Week;
  department?: string;
  employeeName?: string;
  position?: string;
  apCorporate: string; 
  keyResult: string;
  todoList: string;
  dueDate: string;
  unit?: string;
  target: string;
  actual: string;
}

export interface DashboardData {
  indicators: LaggingIndicator[];
  picaRecords: PICARecord[]; // Corrective Actions
  goals: GoalRecord[];
  mandatoryRecords: MandatoryRecord[]; // New Mandatory Compliance
  activityPlans: ActivityPlanRecord[];
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Week = 1 | 2 | 3 | 4 | 5;

// Data for a single department for a full year
export type DepartmentYearlyData = {
  [key in Month]: {
    [key in Week]: DashboardData | null;
  };
};

// Global data structure: Department -> Month -> Week
export type GlobalData = {
  [department: string]: DepartmentYearlyData;
}

export type YearlyData = DepartmentYearlyData; 

export interface UploadPayload {
  department: string; 
  month: Month;
  week: Week;
  leadings: {
    laggingId: string; // ID for system mapping
    laggingName: string; // RAW NAME from CSV for dynamic creation
    leadingName: string; 
    leadingId?: string; 
    actual: number;
    target?: number;
    unit?: string;
    employeeName?: string;
    position?: string;
  }[];
  controls: {
    laggingId: string;
    laggingName: string;
    leadingName: string;
    controlName: string;
    controlId?: string;
    actual: number;
    target?: number;
    unit?: string;
    employeeName?: string;
    position?: string;
  }[];
  picaRecords: PICARecord[];
  goals: GoalRecord[];
  mandatoryRecords: MandatoryRecord[];
  activityPlans: ActivityPlanRecord[];
}

export type MultiUploadPayload = UploadPayload[];
