// Grade hierarchy for comparisons
const GRADE_ORDER = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"] as const;
export type Grade = (typeof GRADE_ORDER)[number];

export interface ApplicantData {
  fullName: string;
  indexNumber: string;
  phoneNumber: string;
  meanGrade: Grade;
  biologyGrade: Grade;
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

// Diploma courses (mean grade C- or C)
const DIPLOMA_COURSES = [
  { name: "Diploma in Animal Health", faculty: "Faculty of Agriculture & Veterinary Sciences", requiresBiology: "C" as Grade },
  { name: "Diploma in Agricultural Engineering", faculty: "Faculty of Agriculture & Veterinary Sciences" },
  { name: "Diploma in Business Management", faculty: "Faculty of Business & Economics" },
  { name: "Diploma in Information Technology", faculty: "Faculty of Computing & IT" },
  { name: "Diploma in Education", faculty: "Faculty of Education & Social Sciences" },
];

// Certificate courses (mean grade D+ or D)
const CERTIFICATE_COURSES = [
  { name: "Certificate in Animal Health", faculty: "Faculty of Agriculture & Veterinary Sciences", requiresBiology: "C-" as Grade },
  { name: "Certificate in Farm Management", faculty: "Faculty of Agriculture & Veterinary Sciences" },
  { name: "Certificate in Business Studies", faculty: "Faculty of Business & Economics" },
  { name: "Certificate in Computer Applications", faculty: "Faculty of Computing & IT" },
  { name: "Certificate in Social Work", faculty: "Faculty of Education & Social Sciences" },
];

export function evaluateAdmission(data: ApplicantData): AdmissionResult {
  const { meanGrade, biologyGrade } = data;

  // Determine category
  const isDiploma = isGradeAtLeast(meanGrade, "C-"); // C- or higher
  const isCertificate = !isDiploma && isGradeAtLeast(meanGrade, "D"); // D+ or D

  if (!isDiploma && !isCertificate) {
    return {
      category: "Certificate",
      courseName: "",
      faculty: "",
      eligible: false,
      reason: "KCSE mean grade is below the minimum requirement (D) for admission.",
    };
  }

  const category = isDiploma ? "Diploma" : "Certificate";
  const courses = isDiploma ? DIPLOMA_COURSES : CERTIFICATE_COURSES;

  // Try to find best course — prefer Animal Health if biology qualifies
  for (const course of courses) {
    if (course.requiresBiology) {
      if (isGradeAtLeast(biologyGrade, course.requiresBiology)) {
        return { category, courseName: course.name, faculty: course.faculty, eligible: true };
      }
      // Skip this course, biology not met
      continue;
    }
    return { category, courseName: course.name, faculty: course.faculty, eligible: true };
  }

  return {
    category,
    courseName: "",
    faculty: "",
    eligible: false,
    reason: "No eligible courses found for the given grades.",
  };
}

export function getAllGrades(): Grade[] {
  return [...GRADE_ORDER];
}
