// Grade hierarchy for comparisons
const GRADE_ORDER = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"] as const;
export type Grade = (typeof GRADE_ORDER)[number];

export interface ApplicantData {
  fullName: string;
  indexNumber: string;
  phoneNumber: string;
  meanGrade: Grade;
}

export interface CourseInfo {
  name: string;
  faculty: string;
  category: "Diploma" | "Certificate";
}

export interface AdmissionResult {
  category: "Diploma" | "Certificate";
  courseName: string;
  faculty: string;
  eligible: boolean;
  reason?: string;
}

function gradeIndex(grade: Grade): number {
  return GRADE_ORDER.indexOf(grade);
}

function isGradeAtLeast(grade: Grade, minimum: Grade): boolean {
  return gradeIndex(grade) <= gradeIndex(minimum);
}

const FACULTY_NAMES: Record<string, string> = {
  FHSS: "Faculty of Humanities and Social Sciences",
  FBUS: "Faculty of Business Studies",
  FPSET: "Faculty of Physical Sciences Engineering & Technology",
  FLNS: "Faculty of Life Sciences and Natural Resources",
  FEDU: "Faculty of Education",
};
};

// Diploma courses (mean grade C or C-)
const DIPLOMA_COURSES: CourseInfo[] = [
  // Humanities & Social Sciences
  { name: "Diploma in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Leadership and Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Information Science", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Journalism & Mass Communication", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Counselling Psychology", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },

  // Business Studies
  { name: "Diploma in Business Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Sales and Marketing", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Procurement & Logistics Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Insurance and Risk Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Accounting", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },
  { name: "Diploma in Human Resource Management", faculty: FACULTY_NAMES.FBUS, category: "Diploma" },

  // Physical Sciences & Technology
  { name: "Diploma in Computer Science", faculty: FACULTY_NAMES.FPSET, category: "Diploma" },
  { name: "Diploma in Information Technology", faculty: FACULTY_NAMES.FPSET, category: "Diploma" },
  { name: "Diploma in Project Planning & Management", faculty: FACULTY_NAMES.FPSET, category: "Diploma" },

  // Life Sciences & Natural Resources
  { name: "Diploma in Agriculture and Rural Development", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Tourism and Hotel Management", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Wildlife Management", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Agricultural Education & Extension", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Meat Science and Technology", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Farm Resources and Management", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Horticulture", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
  { name: "Diploma in Dryland Agriculture", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },

  // Health
  { name: "Diploma in Health Records & Information Management", faculty: FACULTY_NAMES.FLNS, category: "Diploma" },
];

/const CERTIFICATE_COURSES: CourseInfo[] = [
  // Humanities & Social Sciences
  { name: "Certificate in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Leadership and Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in National Cohesion, Values and Governance", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },

  // Business Studies
  { name: "Certificate in Business Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Procurement & Logistics Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Insurance & Risk Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Accounting", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },
  { name: "Certificate in Project Planning & Management", faculty: FACULTY_NAMES.FBUS, category: "Certificate" },

  // ICT / Tech
  { name: "Certificate in Computer Science", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Certificate in Information Technology", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },
  { name: "Certificate in Computer Literacy/Packages", faculty: FACULTY_NAMES.FPSET, category: "Certificate" },

  // Life Sciences / Hospitality
  { name: "Certificate in Hospitality & Tourism Management", faculty: FACULTY_NAMES.FLNS, category: "Certificate" },
  { name: "Certificate in Health Records & Information Management", faculty: FACULTY_NAMES.FLNS, category: "Certificate" },
];

export function getEligibleCourses(meanGrade: Grade): CourseInfo[] {
  const isDiploma = isGradeAtLeast(meanGrade, "C-");
  const isCertificate = !isDiploma && isGradeAtLeast(meanGrade, "D");

  if (isDiploma) return DIPLOMA_COURSES;
  if (isCertificate) return CERTIFICATE_COURSES;
  return [];
}

export function evaluateAdmission(data: ApplicantData, selectedCourse: CourseInfo): AdmissionResult {
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
