import { DashboardData } from './types';

export const JOBSITE_LIST = [
  'AGM',
  'BAYAN',
  'CDI',
  'MAS',
  'MBL - MINING',
  'MHU',
  'MSJ-TD',
  'HEAD OFFICE'
];

export const HEAD_OFFICE_DEPARTMENTS = [
  'Corporate',
  'Finance & Accounting',
  'Internal Audit',
  'Civil Project Management',
  'General Service',
  'Intellectual Capital',
  'Plant',
  'Logistic',
  'Organizational Development',
  'Engineering',
  'Production',
  'Legal',
  'Business Development',
  'Data Center',
  'Supply Management',
  'Information Technology',
  'Safety Health and Environment'
];

export const JOBSITE_DEPARTMENTS = [
  'Engineering',
  'Finance',
  'Civil Project Management',
  'General Service',
  'Intellectual Capital',
  'Plant',
  'Logistic',
  'Organizational Development',
  'Production',
  'Data Center',
  'Information Technology',
  'Safety Health and Environment'
];

export const DEPARTMENTS_LIST = Array.from(new Set([...HEAD_OFFICE_DEPARTMENTS, ...JOBSITE_DEPARTMENTS]));

export const INITIAL_DATA: DashboardData = {
  indicators: [],
  picaRecords: [],
  goals: [],
  mandatoryRecords: [],
  activityPlans: []
};

export const INFLUENCING_FACTORS = {
  "Productivity": [
    "Front Condition Index (Floor, drainage, wall)",
    "Road Condition Index (Grade, width, slippery, undulating)",
    "Blasting Fragmentation (Oversize, powder factor)",
    "Loading Time (Digging method, pass match)",
    "Queueing Time (Bunching, truck count)"
  ],
  "Availability": [
    "Planned Maintenance Compliance",
    "Unscheduled Breakdown Rate",
    "Tire Wear & Damage Rate",
    "Sparepart Supply Lead Time",
    "Fuel Logistics"
  ],
  "Cycle Time": [
    "Haul Distance",
    "Travel Speed (Loaded/Empty)",
    "Dumping Time",
    "Spotting Time"
  ],
  "Cost": [
    "Fuel Consumption (L/Hr)",
    "Tire Cost per Hour",
    "Manpower Efficiency"
  ],
  "Safety": [
    "Fatigue Events",
    "Vehicle Interaction Incidents",
    "Geotechnical Stability"
  ]
};

// ============================================================================
// KONFIGURASI URL DATABASE - PERMANENT STORAGE
// ============================================================================
const EMPTY = { performance: '', pica: '', goals: '', mandatory: '', activity: '' };

export const PREDEFINED_SHEET_URLS: Record<string, Record<string, { performance: string, pica: string, goals: string, mandatory: string, activity: string }>> = {
  'HEAD OFFICE': {
     'Corporate': { ...EMPTY }, 
     'Finance & Accounting': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=1687623069&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=923010022&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=841952853&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=556835153&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=2020185172&single=true&output=csv'
     },
     'Internal Audit': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=560643164&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=516636074&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1287093510&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1130819851&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=367478895&single=true&output=csv'
     },
     'Civil Project Management': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=2143348470&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1553422342&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=475694211&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1108744961&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1192730486&single=true&output=csv'
     },
     'General Service': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=1208465665&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=647657613&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1789309141&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1062675151&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1087678640&single=true&output=csv'
     },
     'Intellectual Capital': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=2101829753&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1690574483&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1749007390&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1586214156&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=422777922&single=true&output=csv'
     },
     'Plant': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=218436796&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1230949727&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1378283148&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1427953036&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1771046712&single=true&output=csv'
     },
     'Logistic': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=1803998370&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1922748505&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1976967140&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1354152776&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1596165030&single=true&output=csv'
    },
     'Organizational Development': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=392001459&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=769890331&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1174939817&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1294582402&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=215285924&single=true&output=csv'
     },
     'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=398119940&single=true&output=csv'
     },
     'Production': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=634494456&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=679238783&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=270199073&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1703896086&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1386135290&single=true&output=csv'
     },
     'Information Technology': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=244647925&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=647956313&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=1376472995&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=1432501377&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=1409284447&single=true&output=csv'
     },
     'Safety Health and Environment': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXuIBA_KiV9n95WHRr_rwDiMuc1LmVhZHZ8jQMTGxnRtmJ0nNLa2KtzcmivWRCUQBe9xWVUtWScUkm/pub?gid=2100325895&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0DcXUvad6yTfAvTROepMXzUs-eQhM3iZ9MvawmeZp7qsneXpRa2mi7XBb_e6p8byt5oBSjOLmJED/pub?gid=1800159792&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVMDo9T8W8qnkX6W_SQ2QB-U4lQY-DyHq9t8zHVLtlOu9C3MBL5twfXApzP50R8c2ElLT8B5wLu3SM/pub?gid=400756928&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh4He8ReBxRgN83cG02yaoDUvkg0ARaSVoILtkUmZjjEmBh1b3KKUX5U2-XGfh5Wyc3ZQP1E99gNbj/pub?gid=240277304&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4uC8qCyjooJVZoBxjLqTLCx3hs4eMN7583dTbN9oNygeD3KKa7dPXZ1qd0HqD9_1kMxYBv5yEN46z/pub?gid=420113076&single=true&output=csv'
     }
  },
  'AGM': {
    'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdKghrqe7545FWFOSrLIcfCkK2SYi9uk2i7Bm07-bGgJ793x-Z2qfs5h6jTIKLJALHvcv_1YbCOQgw/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9gEluYSZKbJ8RagY3DxhZtosiCg4fJJymqI1s-3xpy3RThCpSrAoF_wYmBEBp61zPmqSrIUDT4JDh/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bw7jHp93v6hFiIZPoo7PfOKwBdcMPY03SmPTaBwQJ0UsB-ReV2hzllWAbQV0bCzI2I3pD_QQYfot/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRee0MMfhPV8F08lAOtgcAE4BF9a0e8NnVkP6IVY9czyz2roL_h9X3aK2xi9Nxz8jcRdtLBTmY4XOIw/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThMFKyyt0iRzwnR-umYjENsdOQRI_Kh0BVQzKUh2WQPLda_s_FVJHcr28MX-iQdtfXVcm_-HTOmMb7/pub?gid=398119940&single=true&output=csv'
    }, 
    'Finance': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdKghrqe7545FWFOSrLIcfCkK2SYi9uk2i7Bm07-bGgJ793x-Z2qfs5h6jTIKLJALHvcv_1YbCOQgw/pub?gid=1687623069&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9gEluYSZKbJ8RagY3DxhZtosiCg4fJJymqI1s-3xpy3RThCpSrAoF_wYmBEBp61zPmqSrIUDT4JDh/pub?gid=923010022&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bw7jHp93v6hFiIZPoo7PfOKwBdcMPY03SmPTaBwQJ0UsB-ReV2hzllWAbQV0bCzI2I3pD_QQYfot/pub?gid=841952853&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRee0MMfhPV8F08lAOtgcAE4BF9a0e8NnVkP6IVY9czyz2roL_h9X3aK2xi9Nxz8jcRdtLBTmY4XOIw/pub?gid=556835153&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThMFKyyt0iRzwnR-umYjENsdOQRI_Kh0BVQzKUh2WQPLda_s_FVJHcr28MX-iQdtfXVcm_-HTOmMb7/pub?gid=2020185172&single=true&output=csv'
    }, 
    'Civil Project Management': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdKghrqe7545FWFOSrLIcfCkK2SYi9uk2i7Bm07-bGgJ793x-Z2qfs5h6jTIKLJALHvcv_1YbCOQgw/pub?gid=2143348470&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9gEluYSZKbJ8RagY3DxhZtosiCg4fJJymqI1s-3xpy3RThCpSrAoF_wYmBEBp61zPmqSrIUDT4JDh/pub?gid=1553422342&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bw7jHp93v6hFiIZPoo7PfOKwBdcMPY03SmPTaBwQJ0UsB-ReV2hzllWAbQV0bCzI2I3pD_QQYfot/pub?gid=475694211&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRee0MMfhPV8F08lAOtgcAE4BF9a0e8NnVkP6IVY9czyz2roL_h9X3aK2xi9Nxz8jcRdtLBTmY4XOIw/pub?gid=1108744961&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThMFKyyt0iRzwnR-umYjENsdOQRI_Kh0BVQzKUh2WQPLda_s_FVJHcr28MX-iQdtfXVcm_-HTOmMb7/pub?gid=1192730486&single=true&output=csv'
    }, 
    'General Service': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdKghrqe7545FWFOSrLIcfCkK2SYi9uk2i7Bm07-bGgJ793x-Z2qfs5h6jTIKLJALHvcv_1YbCOQgw/pub?gid=1208465665&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9gEluYSZKbJ8RagY3DxhZtosiCg4fJJymqI1s-3xpy3RThCpSrAoF_wYmBEBp61zPmqSrIUDT4JDh/pub?gid=647657613&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bw7jHp93v6hFiIZPoo7PfOKwBdcMPY03SmPTaBwQJ0UsB-ReV2hzllWAbQV0bCzI2I3pD_QQYfot/pub?gid=1789309141&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRee0MMfhPV8F08lAOtgcAE4BF9a0e8NnVkP6IVY9czyz2roL_h9X3aK2xi9Nxz8jcRdtLBTmY4XOIw/pub?gid=1062675151&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThMFKyyt0iRzwnR-umYjENsdOQRI_Kh0BVQzKUh2WQPLda_s_FVJHcr28MX-iQdtfXVcm_-HTOmMb7/pub?gid=1087678640&single=true&output=csv'
    }, 
    'Intellectual Capital': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdKghrqe7545FWFOSrLIcfCkK2SYi9uk2i7Bm07-bGgJ793x-Z2qfs5h6jTIKLJALHvcv_1YbCOQgw/pub?gid=2101829753&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9gEluYSZKbJ8RagY3DxhZtosiCg4fJJymqI1s-3xpy3RThCpSrAoF_wYmBEBp61zPmqSrIUDT4JDh/pub?gid=1690574483&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bw7jHp93v6hFiIZPoo7PfOKwBdcMPY03SmPTaBwQJ0UsB-ReV2hzllWAbQV0bCzI2I3pD_QQYfot/pub?gid=1749007390&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRee0MMfhPV8F08lAOtgcAE4BF9a0e8NnVkP6IVY9czyz2roL_h9X3aK2xi9Nxz8jcRdtLBTmY4XOIw/pub?gid=1586214156&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThMFKyyt0iRzwnR-umYjENsdOQRI_Kh0BVQzKUh2WQPLda_s_FVJHcr28MX-iQdtfXVcm_-HTOmMb7/pub?gid=422777922&single=true&output=csv'
    }
  },
  'BAYAN': {
    'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSznu1c-1C5GxTAyCSZJHws59tXPUJoHzjIcNI8V-pRtZswlDqZJ4RiNfZHs-BWK6n5QL3S6BkSbgMI/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeyvWe4yYI9nSqQXY7jR8GpABnRoGkfwHp40IVM7VuKJXPP09j8c25P8LOK7L-x8Fyi1R6STl-_Zqs/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRMglZfGjsKpZPrsDoYGay3mvfPMvGrTVe8xhmAW1fXMar588eRNQyj1cI6GvcWv15TLLprI7ms0f/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfAXmMXQWPOWNf7uzcT4vJpRLOrZNJ8g5yILbZuJ8ZCtzePDkTnDanV1GrPt_X0SPC45sTEEcP07UE/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0CmDB8yv7bfuEgPLCE-JQRyJO8lJZrGgqicl2We5vN7KVuWdEJXQUxCHhpEyd5kFobPZupIRPIUvY/pub?gid=398119940&single=true&output=csv'
    },
    'Finance': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSznu1c-1C5GxTAyCSZJHws59tXPUJoHzjIcNI8V-pRtZswlDqZJ4RiNfZHs-BWK6n5QL3S6BkSbgMI/pub?gid=1687623069&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeyvWe4yYI9nSqQXY7jR8GpABnRoGkfwHp40IVM7VuKJXPP09j8c25P8LOK7L-x8Fyi1R6STl-_Zqs/pub?gid=923010022&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRMglZfGjsKpZPrsDoYGay3mvfPMvGrTVe8xhmAW1fXMar588eRNQyj1cI6GvcWv15TLLprI7ms0f/pub?gid=841952853&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfAXmMXQWPOWNf7uzcT4vJpRLOrZNJ8g5yILbZuJ8ZCtzePDkTnDanV1GrPt_X0SPC45sTEEcP07UE/pub?gid=556835153&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0CmDB8yv7bfuEgPLCE-JQRyJO8lJZrGgqicl2We5vN7KVuWdEJXQUxCHhpEyd5kFobPZupIRPIUvY/pub?gid=2020185172&single=true&output=csv'
    },
    'Information Technology': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSznu1c-1C5GxTAyCSZJHws59tXPUJoHzjIcNI8V-pRtZswlDqZJ4RiNfZHs-BWK6n5QL3S6BkSbgMI/pub?gid=2090704651&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeyvWe4yYI9nSqQXY7jR8GpABnRoGkfwHp40IVM7VuKJXPP09j8c25P8LOK7L-x8Fyi1R6STl-_Zqs/pub?gid=542718394&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRMglZfGjsKpZPrsDoYGay3mvfPMvGrTVe8xhmAW1fXMar588eRNQyj1cI6GvcWv15TLLprI7ms0f/pub?gid=855367866&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfAXmMXQWPOWNf7uzcT4vJpRLOrZNJ8g5yILbZuJ8ZCtzePDkTnDanV1GrPt_X0SPC45sTEEcP07UE/pub?gid=546923026&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0CmDB8yv7bfuEgPLCE-JQRyJO8lJZrGgqicl2We5vN7KVuWdEJXQUxCHhpEyd5kFobPZupIRPIUvY/pub?gid=1326285944&single=true&output=csv'
    },
    'Safety Health and Environment': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSznu1c-1C5GxTAyCSZJHws59tXPUJoHzjIcNI8V-pRtZswlDqZJ4RiNfZHs-BWK6n5QL3S6BkSbgMI/pub?gid=709653420&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeyvWe4yYI9nSqQXY7jR8GpABnRoGkfwHp40IVM7VuKJXPP09j8c25P8LOK7L-x8Fyi1R6STl-_Zqs/pub?gid=1211341414&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFRMglZfGjsKpZPrsDoYGay3mvfPMvGrTVe8xhmAW1fXMar588eRNQyj1cI6GvcWv15TLLprI7ms0f/pub?gid=1183503487&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfAXmMXQWPOWNf7uzcT4vJpRLOrZNJ8g5yILbZuJ8ZCtzePDkTnDanV1GrPt_X0SPC45sTEEcP07UE/pub?gid=289367264&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0CmDB8yv7bfuEgPLCE-JQRyJO8lJZrGgqicl2We5vN7KVuWdEJXQUxCHhpEyd5kFobPZupIRPIUvY/pub?gid=124202275&single=true&output=csv'
    }
  },
  'CDI': {
    'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZJTnw2UsPYNIM6iENZUMTTQvrxU5H5sHNWxvMi20gLkTrvaYBYA_oGfDEFW6DxwAmAG-02HQBf_X5/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfn_OR2ltfVHDx37PyJ6CeF9O5SZi25RyL1ZZD-EuOdhZhbsMemBJ03PYaE3-0ncDuX3SPMkKLmt5v/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSFM6Tb_2eOGE8UPXoFaFSxYYotcVWkZ7bpmU05a8UFPkOdNhNec7ZjVkpzAsMHQWQyq-xIgIpZ642t/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmCqEOnHkDbk2yzlkRnJJ5izfXlVzYN5avICP9XnjSAvx66pKfhQmcS45w1D6L-lWoeQCnBD7b42LL/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6iexxsFTINEkXGrvLpL1eHkc1hJlLFQeg6xGhZXAx1L_KtCSGuCGp69VTpF7iic-AXUbIc2R97sDk/pub?gid=398119940&single=true&output=csv'
    }
  },
  'MAS': {
    'Information Technology': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJMfyMsLG4ZjWgLqaAy2fyXj9W3UK61f9DlWrf4DZJrGwQ8c4rr-OzfirdNViKexF6KVZb6QWTYURu/pub?gid=307677340&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRp4dxwxwDO1ZAyWoXPSEc3CrBjOzkpD3eRAAv2TMPj4HqVf2cetax_5DaaBBaFw_IaEtEOGNjuEWOj/pub?gid=597149632&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUg_YOHTcJpi9MgaXjHHcLNdx9l0FBen4V3z5LSPjhD1p0ldZQ0hrjyu1p9pL02gHPnGNhXKT-EwtX/pub?gid=856668897&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZFS168wVYg2ABPzIlZhI_VDFENa10g7LtekaIcgMjI9eEe1fCFtC-GOJYlQNNOvTDrhH1IeBA_HRK/pub?gid=58728773&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTg3JDhrBMltRDwF1npHSRbbsNeQVDOUsjZcfpt3EUE5A06dTKLPY4H-Uc6tMjvpgVUgyywIMhQwgZT/pub?gid=114209445&single=true&output=csv'
    },
    'Safety Health and Environment': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJMfyMsLG4ZjWgLqaAy2fyXj9W3UK61f9DlWrf4DZJrGwQ8c4rr-OzfirdNViKexF6KVZb6QWTYURu/pub?gid=1688771545&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRp4dxwxwDO1ZAyWoXPSEc3CrBjOzkpD3eRAAv2TMPj4HqVf2cetax_5DaaBBaFw_IaEtEOGNjuEWOj/pub?gid=519770260&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUg_YOHTcJpi9MgaXjHHcLNdx9l0FBen4V3z5LSPjhD1p0ldZQ0hrjyu1p9pL02gHPnGNhXKT-EwtX/pub?gid=1065515087&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZFS168wVYg2ABPzIlZhI_VDFENa10g7LtekaIcgMjI9eEe1fCFtC-GOJYlQNNOvTDrhH1IeBA_HRK/pub?gid=241389539&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTg3JDhrBMltRDwF1npHSRbbsNeQVDOUsjZcfpt3EUE5A06dTKLPY4H-Uc6tMjvpgVUgyywIMhQwgZT/pub?gid=1432089950&single=true&output=csv'
    }
  },
  'MBL - MINING': {
    'Information Technology': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVWn1U-cJNczOWbLqMUS1Mxrcc0ld6iTyLUXfHBHEnJMHldIn3YBegTjaX0TX_NS6IIZ-pu3Ra21xE/pub?gid=357931575&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRj3W5-Pa6RsNpl8nm9Pd81TLplcsz6z99zewjkydcde02zzOefAzSTmoFn7Cl5MPaMeFcZZCpgw2Rm/pub?gid=1742131374&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCKcz_-xxxC4yA3BhFDxTNJFqcZUhRU3PvWRCm0X-F8XLjud8gOSjkEiDBw-2xsXaReXUQjv0sj_8W/pub?gid=1395897512&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrf_QGBhQeI2QT52nbILgXF0h35wQN5NvlerGkLTZMGaPawma0k1ZUvU14sdYvDS5Wvd44PVG8Vydm/pub?gid=935848414&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbC-hChAuzaWbM943pboiENcUKdmDNAFcRg8v8hLpXQrjuwCCxsUs5k-cg7VhovF58izbyKAOqZvXv/pub?gid=1062891999&single=true&output=csv'
    },
    'Safety Health and Environment': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVWn1U-cJNczOWbLqMUS1Mxrcc0ld6iTyLUXfHBHEnJMHldIn3YBegTjaX0TX_NS6IIZ-pu3Ra21xE/pub?gid=1382270470&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRj3W5-Pa6RsNpl8nm9Pd81TLplcsz6z99zewjkydcde02zzOefAzSTmoFn7Cl5MPaMeFcZZCpgw2Rm/pub?gid=1483273771&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCKcz_-xxxC4yA3BhFDxTNJFqcZUhRU3PvWRCm0X-F8XLjud8gOSjkEiDBw-2xsXaReXUQjv0sj_8W/pub?gid=1763917865&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrf_QGBhQeI2QT52nbILgXF0h35wQN5NvlerGkLTZMGaPawma0k1ZUvU14sdYvDS5Wvd44PVG8Vydm/pub?gid=1148272558&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbC-hChAuzaWbM943pboiENcUKdmDNAFcRg8v8hLpXQrjuwCCxsUs5k-cg7VhovF58izbyKAOqZvXv/pub?gid=804255400&single=true&output=csv'
    }
  },
  'MHU': {
    'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6ewF1r0XqMDa9zxxJG_Ax86cqxrZFHHhpesr4uJWU6BArtmrqRXtC0ghS4rvc1ZujNCYh8xU8YiGI/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZhYmlUWRoWcOo2HR9TJ-j1rWdHR8EhE30-nPBP8vuLpCLdlfIKOpPTjrAGCn0lRO4YilZ04la3cs4/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSAMXrk1psgRlgdK7p9RvxXTNHEo6C0oK6Rk3AgFAOJI8mNuUVQHaII7HAG0V5a6bH3SYLJF2FtLDvq/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTumEZPtubgulzLhRX1Hgr-cZF5RPookWtt-S6qUajG7Bb1_maHfte51Xa7uD0l9k88Mx6m2tchxuWk/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtTQ4l0dzJNIsZpqp8ZtJ26q4iNEmYqHcQH3sg31Lu9b08jnG1HHC0c0HVjSkBh9GUfVP0qgZJwflv/pub?gid=398119940&single=true&output=csv'
    }
  },
  'MSJ-TD': {
    'Engineering': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1057980815&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=1409165126&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=2088838559&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1665901129&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=398119940&single=true&output=csv'
    },
    'Finance': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1687623069&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=923010022&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=841952853&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=556835153&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=2020185172&single=true&output=csv'
    },
    'Civil Project Management': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=2143348470&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=1553422342&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=475694211&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1108744961&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1192730486&single=true&output=csv'
    },
    'General Service': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1208465665&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=647657613&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1789309141&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1062675151&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1087678640&single=true&output=csv'
    },
    'Intellectual Capital': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=2101829753&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=1690574483&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1749007390&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1586214156&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=422777922&single=true&output=csv'
    },
    'Plant': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=218436796&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=1230949727&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1378283148&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1427953036&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1771046712&single=true&output=csv'
    },
    'Logistic': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1803998370&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=1922748505&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1976967140&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1354152776&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1596165030&single=true&output=csv'
    },
    'Organizational Development': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=392001459&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=769890331&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1174939817&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1294582402&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=215285924&single=true&output=csv'
    },
    'Production': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=634494456&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=679238783&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=270199073&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1703896086&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1386135290&single=true&output=csv'
    },
    'Data Center': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1504768866&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=943061825&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=519585376&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1797897380&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1384062941&single=true&output=csv'
    },
    'Information Technology': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=2016126005&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=2105323415&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1022894710&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1479040289&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=1086237499&single=true&output=csv'
    },
    'Safety Health and Environment': { 
        performance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnutQZdHeSO85Oxr958lPCeq30GTQ1wztFQQ-AW94TwQooCFmhEyr719C49MckzoVXF1-Aame9_cDT/pub?gid=1947074631&single=true&output=csv',
        pica: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa03VrjjEm-81UyEJ4TCQrm0_R-cMbDUIUqnDd9ysrgHX8IN4k46tE2J1xq8JVVWlGDuZVZpy0sjdm/pub?gid=331821704&single=true&output=csv',
        goals: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrP2twG5iv8SqUGGLDmUxCCA1vKftY0hTUPj-EyKcwKIi7brPLIYo7gTwVmBrqxBaMYEUeqQ8mza0q/pub?gid=1305471646&single=true&output=csv',
        mandatory: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGNOh7o9P9zEvsbHixWwv4uoisrHL6JOQGar1guH0KB5cJYWwOb29kUQwRIbQ9p6Sy5XYcKV4EHgBY/pub?gid=1631803403&single=true&output=csv',
        activity: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxeAOhvhBx6-UomhfKJc0pNIJYB652v99Z9-_4wNscPBXu6uH2bPXg_bPVEImt_Wc90u-TFXDz_GwH/pub?gid=226731536&single=true&output=csv'
    }
  }
};