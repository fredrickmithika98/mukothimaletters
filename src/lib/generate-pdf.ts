import jsPDF from "jspdf";
import type { ApplicantData, AdmissionResult } from "./admission-logic";

export function generateAdmissionLetter(applicant: ApplicantData, result: AdmissionResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 25;
  let y = 30;

  // Header line
  doc.setDrawColor(25, 40, 80);
  doc.setLineWidth(1.5);
  doc.line(margin, y - 5, pageWidth - margin, y - 5);

  // Institution name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(25, 40, 80);
  doc.text("KENYA NATIONAL POLYTECHNIC", pageWidth / 2, y + 5, { align: "center" });

  y += 14;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("P.O. Box 30209-00100, Nairobi, Kenya", pageWidth / 2, y, { align: "center" });

  y += 6;
  doc.text("Tel: +254 20 2345678 | Email: admissions@knp.ac.ke", pageWidth / 2, y, { align: "center" });

  y += 8;
  doc.setDrawColor(180, 150, 60);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);

  // Date
  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Date: ${date}`, margin, y);

  // Reference
  y += 8;
  doc.text(`Ref: ADM/${new Date().getFullYear()}/${applicant.indexNumber}`, margin, y);

  // Applicant address
  y += 15;
  doc.text(applicant.fullName, margin, y);
  y += 6;
  doc.text(`Index No: ${applicant.indexNumber}`, margin, y);
  y += 6;
  doc.text(`Phone: ${applicant.phoneNumber}`, margin, y);

  // Subject
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(25, 40, 80);
  doc.text("RE: OFFER OF ADMISSION", margin, y);

  // Underline
  y += 2;
  doc.setDrawColor(25, 40, 80);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 72, y);

  // Body
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);

  const bodyLines = [
    `Dear ${applicant.fullName},`,
    "",
    "Following your application and based on your Kenya Certificate of Secondary Education (KCSE)",
    `results, we are pleased to inform you that you have been admitted to the following programme:`,
  ];

  for (const line of bodyLines) {
    doc.text(line, margin, y);
    y += 7;
  }

  // Course details box
  y += 5;
  doc.setFillColor(240, 245, 252);
  doc.setDrawColor(25, 40, 80);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 40, 3, 3, "FD");

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 40, 80);
  doc.text("Programme:", margin + 8, y);
  doc.setFont("helvetica", "normal");
  doc.text(result.courseName, margin + 45, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Faculty:", margin + 8, y);
  doc.setFont("helvetica", "normal");
  doc.text(result.faculty, margin + 45, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Category:", margin + 8, y);
  doc.setFont("helvetica", "normal");
  doc.text(result.category, margin + 45, y);

  // Continuation
  y += 20;
  doc.setTextColor(50, 50, 50);
  const contLines = [
    "Please report to the institution within two (2) weeks from the date of this letter with the",
    "following documents:",
    "",
    "   1. Original KCSE certificate or result slip",
    "   2. National ID or birth certificate",
    "   3. Two (2) passport-size photographs",
    "   4. School leaving certificate",
    "",
    "We congratulate you on your admission and look forward to welcoming you.",
    "",
    "Yours faithfully,",
  ];

  for (const line of contLines) {
    doc.text(line, margin, y);
    y += 7;
  }

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 40, 80);
  doc.text("Dr. James Mwangi", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Registrar, Academic Affairs", margin, y);

  // Footer line
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(180, 150, 60);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  doc.setFontSize(8);
  doc.text("This is an official admission letter from Kenya National Polytechnic.", pageWidth / 2, footerY + 6, { align: "center" });

  doc.save(`Admission_Letter_${applicant.fullName.replace(/\s+/g, "_")}.pdf`);
}
