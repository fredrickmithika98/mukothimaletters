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
  FHSS: "Faculty of Humanities & Social Sciences",
  FBUST: "Faculty of Business & Technology",
  FPET: "Faculty of Pure & Engineering Technology",
  FLIND: "Faculty of Liberal & Interdisciplinary Studies",
};

// Diploma courses (mean grade C or C-)
const DIPLOMA_COURSES: CourseInfo[] = [
  { name: "Diploma in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Leadership & Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Information Science", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Journalism & Mass Communication", faculty: FACULTY_NAMES.FHSS, category: "Diploma" },
  { name: "Diploma in Counselling Psychology", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Business Management", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Sales and Marketing", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Procurement & Logistics Management", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Insurance and Risk Management", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Accounting", faculty: FACULTY_NAMES.FBUST, category: "Diploma" },
  { name: "Diploma in Project Planning & Management", faculty: FACULTY_NAMES.FPET, category: "Diploma" },
  { name: "Diploma in Computer Science", faculty: FACULTY_NAMES.FPET, category: "Diploma" },
  { name: "Diploma in Information Technology", faculty: FACULTY_NAMES.FLIND, category: "Diploma" },
  { name: "Diploma in Health Records & Information Management", faculty: FACULTY_NAMES.FLIND, category: "Diploma" },
  { name: "Diploma in Dryland Agriculture", faculty: FACULTY_NAMES.FLIND, category: "Diploma" },
];

// Certificate courses (mean grade D+ or D)
const CERTIFICATE_COURSES: CourseInfo[] = [
  { name: "Certificate in Community Development", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Criminology & Security Studies", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Social Work", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Disaster Management", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Leadership & Public Administration", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in National Cohesion, Values and Governance", faculty: FACULTY_NAMES.FHSS, category: "Certificate" },
  { name: "Certificate in Business Management", faculty: FACULTY_NAMES.FBUST, category: "Certificate" },
  { name: "Certificate in Procurement & Logistics", faculty: FACULTY_NAMES.FBUST, category: "Certificate" },
  { name: "Certificate in Insurance & Risk Management", faculty: FACULTY_NAMES.FBUST, category: "Certificate" },
  { name: "Certificate in Accounting", faculty: FACULTY_NAMES.FBUST, category: "Certificate" },
  { name: "Certificate in Project Planning & Management", faculty: FACULTY_NAMES.FPET, category: "Certificate" },
  { name: "Certificate in Computer Science", faculty: FACULTY_NAMES.FPET, category: "Certificate" },
  { name: "Certificate in Information Technology", faculty: FACULTY_NAMES.FLIND, category: "Certificate" },
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
