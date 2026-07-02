// Grade hierarchy for comparisons
const GRADE_ORDER = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"] as const;
export type Grade = (typeof GRADE_ORDER)[number];

export interface ApplicantData {
  fullName: string;
  indexNumber: string;
  phoneNumber: string;
  meanGrade: Grade;
  guardianName?: string;
  guardianPhone?: string;
}

export interface TermFee { label: string; amount: number }

export type Category = "Diploma" | "Certificate" | "TVET";
export type ProgrammeType = "University" | "TVET";

export interface CourseInfo {
  name: string;
  faculty: string;
  category: Category;
  level?: string;
  duration?: string;
  terms?: TermFee[];
}

export interface AdmissionResult {
  category: Category;
  courseName: string;
  faculty: string;
  eligible: boolean;
  reason?: string;
  level?: string;
  duration?: string;
  terms?: TermFee[];
}

function gradeIndex(grade: Grade): number {
  return GRADE_ORDER.indexOf(grade);
}

function isGradeAtLeast(grade: Grade, minimum: Grade): boolean {
  return gradeIndex(grade) <= gradeIndex(minimum);
}

const FACULTY_NAMES = {
  FBUS: "Faculty of Business Studies",
  FLSNR: "Faculty of Life Sciences and Natural Resources",
  SNHS: "School of Nursing and Health Sciences",
  FPSET: "Faculty of Physical Sciences, Engineering & Technology",
  FHSS: "Faculty of Humanities and Social Sciences",
  FHS: "Faculty of Health Services",
} as const;

// Diploma courses (mean grade C or C-)
const DIPLOMA_COURSES: CourseInfo[] = [
  // Faculty of Business Studies
  { name: "Diploma in Business Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Sales and Marketing", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Procurement & Logistic Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Insurance and Risk Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Accounting", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Project Planning & Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Human Resource Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },

  // Faculty of Life Sciences and Natural Resources
  { name: "Diploma in Agriculture and Rural Development", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Wildlife Management", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Agricultural Education & Extension", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Meat Science and Technology", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Farm Resources and Management", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Horticulture", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },
  { name: "Diploma in Dryland Agriculture", faculty: FACULTY_NAMES.FLSNR, category: "Diploma" },

  // School of Nursing and Health Sciences
  { name: "Diploma in Health Records and Information Management", faculty: FACULTY_NAMES.SNHS, category: "Diploma" },

  // Faculty of Physical Sciences, Engineering & Technology
  { name: "Diploma in Computer Science", faculty: FACULTY_NAMES.FPSET, category: "Diploma" },
  { name: "Diploma in Information Technology", faculty: FACULTY_NAMES.FPSET, category: "Diploma" },

  // Faculty of Humanities and Social Sciences
  { name: "Diploma in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Leadership and Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Information Science", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Journalism & Mass Communication", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Counselling Psychology", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },

  // Faculty of Health Services (Diploma — Level 5 & 6)
  { name: "Diploma in Perioperative Theatre Technology Level 5", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
  { name: "Diploma in Perioperative Theatre Technology Level 6", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
  { name: "Diploma in Healthcare Support Services Level 5", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
  { name: "Diploma in Mortuary Science Level 5", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
  { name: "Diploma in Community Health Level 5", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
  { name: "Diploma in Community Health Level 6", faculty: FACULTY_NAMES.FHS, category: "Diploma" },
];

// Certificate courses (mean grade D+ or D)
const CERTIFICATE_COURSES: CourseInfo[] = [
  // Faculty of Business Studies
  { name: "Certificate in Business Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Procurement & Logistics Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Insurance and Risk Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Accounting", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Project Planning & Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },

  // Faculty of Life Sciences and Natural Resources
  { name: "Certificate in Hospitality & Tourism Management", faculty: FACULTY_NAMES.FLSNR, category: "Certificate" },

  // School of Nursing and Health Sciences
  { name: "Certificate in Health Records and Information Management", faculty: FACULTY_NAMES.SNHS, category: "Certificate" },

  // Faculty of Physical Sciences, Engineering & Technology
  { name: "Certificate in Computer Science", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Certificate in Information Technology", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Certificate in Computer Literacy / Packages", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Cisco Academy Certifications", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Huawei ICT Academy Certifications", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "AWS Academy Certifications", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Palo Alto Cybersecurity Academy Certifications", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },

  // Faculty of Humanities and Social Sciences
  { name: "Certificate in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Leadership and Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in National Cohesion, Values and Principles of Governance", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },

  // Faculty of Health Services (Certificate — Level 4)
  { name: "Certificate in Caregiving Level 4", faculty: FACULTY_NAMES.FHS, category: "Certificate" },
];

// ============= TVET COURSES (Mukothima TVET) =============
const TVET_FACULTIES = {
  BUILD: "Faculty of Building & Construction Technology",
  HEALTH: "Faculty of Health & Applied Sciences",
  HOSP: "Faculty of Hospitality, Cosmetology & Fashion",
  ENGICT: "Faculty of Engineering & ICT",
} as const;

const TERMS_L6: TermFee[] = [
  { label: "Term 1", amount: 40500 },
  { label: "Term 2", amount: 30000 },
  { label: "Term 3", amount: 30000 },
];
const TERMS_L5: TermFee[] = [
  { label: "Term 1", amount: 31500 },
  { label: "Term 2", amount: 30000 },
  { label: "Term 3", amount: 30000 },
];
const TERMS_L4_L3: TermFee[] = [
  { label: "Term 1", amount: 26500 },
  { label: "Term 2", amount: 20000 },
];

const tvet = (name: string, faculty: string, level: string, duration: string, terms: TermFee[]): CourseInfo => ({
  name: `${name} - ${level}`,
  faculty,
  category: "TVET",
  level,
  duration,
  terms,
});

const TVET_COURSES: CourseInfo[] = [
  // Building & Construction
  tvet("Building Technology", TVET_FACULTIES.BUILD, "Level 6", "2 Years", TERMS_L6),
  tvet("Building Technology", TVET_FACULTIES.BUILD, "Level 5", "1 Year", TERMS_L5),
  tvet("Masonry", TVET_FACULTIES.BUILD, "Level 4", "6 Months", TERMS_L4_L3),
  tvet("Plumbing", TVET_FACULTIES.BUILD, "Level 4", "6 Months", TERMS_L4_L3),
  tvet("Welding", TVET_FACULTIES.BUILD, "Level 4", "6 Months", TERMS_L4_L3),

  // Health & Applied Sciences
  tvet("Caregiving", TVET_FACULTIES.HEALTH, "Level 4", "6 Months", TERMS_L4_L3),
  tvet("Community Health", TVET_FACULTIES.HEALTH, "Level 6", "2 Years", TERMS_L6),
  tvet("Community Health", TVET_FACULTIES.HEALTH, "Level 5", "1 Year", TERMS_L5),
  tvet("Healthcare Support Services", TVET_FACULTIES.HEALTH, "Level 5", "1 Year", TERMS_L5),
  tvet("Mortuary Science", TVET_FACULTIES.HEALTH, "Level 5", "1 Year", TERMS_L5),
  tvet("Perioperative Theatre Technology", TVET_FACULTIES.HEALTH, "Level 6", "2 Years", TERMS_L6),
  tvet("Perioperative Theatre Technology", TVET_FACULTIES.HEALTH, "Level 5", "1 Year", TERMS_L5),

  // Hospitality, Cosmetology & Fashion
  tvet("Food and Beverage Management", TVET_FACULTIES.HOSP, "Level 6", "2 Years", TERMS_L6),
  tvet("Food and Beverage Operations", TVET_FACULTIES.HOSP, "Level 5", "1 Year", TERMS_L5),
  tvet("Cosmetology", TVET_FACULTIES.HOSP, "Level 5", "1 Year", TERMS_L5),
  tvet("Cosmetology", TVET_FACULTIES.HOSP, "Level 4", "6 Months", TERMS_L4_L3),
  tvet("Cosmetology", TVET_FACULTIES.HOSP, "Level 3", "3 Months", TERMS_L4_L3),
  tvet("Fashion Design Technology", TVET_FACULTIES.HOSP, "Level 5", "1 Year", TERMS_L5),
  tvet("Fashion Design Technology", TVET_FACULTIES.HOSP, "Level 4", "6 Months", TERMS_L4_L3),

  // Engineering & ICT
  tvet("Computer Operations", TVET_FACULTIES.ENGICT, "Level 3", "3 Months", TERMS_L4_L3),
  tvet("Electrical Engineering", TVET_FACULTIES.ENGICT, "Level 6", "2 Years", TERMS_L6),
  tvet("Electrical Engineering", TVET_FACULTIES.ENGICT, "Level 5", "1 Year", TERMS_L5),
  tvet("Electrical Installation", TVET_FACULTIES.ENGICT, "Level 4", "6 Months", TERMS_L4_L3),
];

export function getTvetCourses(): CourseInfo[] {
  return TVET_COURSES;
}

export function getEligibleCourses(meanGrade: Grade): CourseInfo[] {
  const isDiploma = isGradeAtLeast(meanGrade, "C-");
  const isCertificate = !isDiploma && isGradeAtLeast(meanGrade, "D");

  if (isDiploma) return DIPLOMA_COURSES;
  if (isCertificate) return CERTIFICATE_COURSES;
  return [];
}

export function evaluateAdmission(data: ApplicantData, selectedCourse: CourseInfo): AdmissionResult {
  // TVET: no grade eligibility check
  if (selectedCourse.category === "TVET") {
    return {
      category: "TVET",
      courseName: selectedCourse.name,
      faculty: selectedCourse.faculty,
      eligible: true,
      level: selectedCourse.level,
      duration: selectedCourse.duration,
      terms: selectedCourse.terms,
    };
  }

  const courses = getEligibleCourses(data.meanGrade);
  const found = courses.find((c) => c.name === selectedCourse.name);

  if (!found) {
    return {
      category: selectedCourse.category,
      courseName: selectedCourse.name,
      faculty: selectedCourse.faculty,
      eligible: false,
      reason: "You are not eligible for the selected course based on your KCSE mean grade.",
    };
  }

  return {
    category: found.category,
    courseName: found.name,
    faculty: found.faculty,
    eligible: true,
  };
}

export function getAllGrades(): Grade[] {
  return [...GRADE_ORDER];
}
