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

const FACULTY_NAMES = {
  FBUS: "Faculty of Business Studies",
  FLSNR: "Faculty of Life Sciences and Natural Resources",
  SNHS: "School of Nursing and Health Sciences",
  FPSET: "Faculty of Physical Sciences, Engineering & Technology",
  FHSS: "Faculty of Humanities and Social Sciences",
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
