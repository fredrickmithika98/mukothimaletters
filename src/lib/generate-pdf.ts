import jsPDF from "jspdf";
import type { ApplicantData, AdmissionResult } from "./admission-logic";

interface FeeRow {
  sn: string;
  item: string;
  regularY1S1: string;
  regularY1S2: string;
  odelY1S1?: string;
  odelY1S2?: string;
  odelY2S1?: string;
  odelY2S2?: string;
}

function getDiplomaFees(): { rows: FeeRow[]; regularTotal: [string, string]; odelTotal: [string, string, string, string]; regularYear: string; odelTotals: [string, string] } {
  return {
    rows: [
      { sn: "1", item: "Tuition fee per year", regularY1S1: "35,000", regularY1S2: "35,000", odelY1S1: "26,000", odelY1S2: "26,000", odelY2S1: "26,000", odelY2S2: "26,000" },
      { sn: "2", item: "Registration fee per year", regularY1S1: "1,000", regularY1S2: "", odelY1S1: "1,000", odelY1S2: "", odelY2S1: "1,000", odelY2S2: "" },
      { sn: "3", item: "Library per year", regularY1S1: "2,000", regularY1S2: "", odelY1S1: "2,000", odelY1S2: "", odelY2S1: "2,000", odelY2S2: "" },
      { sn: "4", item: "Activity fee per year", regularY1S1: "1,000", regularY1S2: "", odelY1S1: "", odelY1S2: "", odelY2S1: "", odelY2S2: "" },
      { sn: "5", item: "Examination fee per year", regularY1S1: "3,000", regularY1S2: "", odelY1S1: "3,000", odelY1S2: "", odelY2S1: "3,000", odelY2S2: "" },
      { sn: "6", item: "Material development per year", regularY1S1: "3,000", regularY1S2: "", odelY1S1: "", odelY1S2: "", odelY2S1: "", odelY2S2: "" },
      { sn: "7", item: "Students Union 1st year", regularY1S1: "1,000", regularY1S2: "", odelY1S1: "1,000", odelY1S2: "", odelY2S1: "", odelY2S2: "" },
      { sn: "8", item: "Caution money once", regularY1S1: "2,000", regularY1S2: "", odelY1S1: "2,000", odelY1S2: "", odelY2S1: "", odelY2S2: "" },
      { sn: "9", item: "Student ID once", regularY1S1: "500", regularY1S2: "", odelY1S1: "500", odelY1S2: "", odelY2S1: "", odelY2S2: "" },
    ],
    regularTotal: ["48,500", "35,000"],
    odelTotal: ["35,500", "26,000", "32,000", "26,000"],
    regularYear: "83,500",
    odelTotals: ["61,000", "58,000"],
  };
}

function getCertificateFees(): { rows: FeeRow[]; regularTotal: [string, string]; odelTotal: [string, string]; regularYear: string; odelYear: string } {
  return {
    rows: [
      { sn: "1", item: "Tuition fee per year", regularY1S1: "30,000", regularY1S2: "30,000", odelY1S1: "17,500", odelY1S2: "17,500" },
      { sn: "2", item: "Registration fee per year", regularY1S1: "1,000", regularY1S2: "", odelY1S1: "1,000", odelY1S2: "" },
      { sn: "3", item: "Library per year", regularY1S1: "2,000", regularY1S2: "", odelY1S1: "2,000", odelY1S2: "" },
      { sn: "4", item: "Examination fee per year", regularY1S1: "2,000", regularY1S2: "", odelY1S1: "3,000", odelY1S2: "" },
      { sn: "5", item: "Students Union 1st year", regularY1S1: "1,000", regularY1S2: "", odelY1S1: "1,000", odelY1S2: "" },
      { sn: "6", item: "Caution money once", regularY1S1: "2,000", regularY1S2: "", odelY1S1: "2,000", odelY1S2: "" },
      { sn: "7", item: "Student ID once", regularY1S1: "500", regularY1S2: "", odelY1S1: "500", odelY1S2: "" },
    ],
    regularTotal: ["38,500", "30,000"],
    odelTotal: ["27,000", "17,500"],
    regularYear: "68,500",
    odelYear: "44,500",
  };
}

export function generateAdmissionLetter(applicant: ApplicantData, result: AdmissionResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  const isDiploma = result.category === "Diploma";
  const semesters = isDiploma ? "four" : "TWO";
  const admissionFee = isDiploma ? "2,000" : "1,000";

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("THARAKA", pageWidth / 2 - 30, y);
  doc.setFontSize(18);
  doc.text("UNIVERSITY", pageWidth / 2 + 18, y);

  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("P.O BOX 193-60215, MARIMANTI, KENYA", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text("Website: https://tharaka.ac.ke  |  Email: info@tharaka.ac.ke", pageWidth / 2, y, { align: "center" });

  // Divider
  y += 5;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);

  // Office line
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("OFFICE OF THE REGISTRAR", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text("(Academic Affairs)", pageWidth / 2, y, { align: "center" });

  // Date
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const now = new Date();
  const day = now.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  doc.text(`${day}${suffix} ${months[now.getMonth()]} ${now.getFullYear()}`, margin, y);

  // Title
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, { align: "center" });
  y += 2;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  const titleW = doc.getTextWidth("PROVISIONAL LETTER OF OFFER");
  doc.line((pageWidth - titleW) / 2, y, (pageWidth + titleW) / 2, y);

  // Name, Index, Phone, Course
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "bold");
  doc.text("Name:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(applicant.fullName, margin + 25, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Index No:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(applicant.indexNumber, margin + 25, y);

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", pageWidth / 2, y);
  doc.setFont("helvetica", "normal");
  doc.text(applicant.phoneNumber, pageWidth / 2 + 22, y);

  // Body paragraph
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);

  const bodyText = `Following your completion of form four studies, we are pleased to inform you that you have been offered provisional admission to Tharaka University, Mukothima Center for a ${result.courseName} in the ${result.faculty}, for the 2026/2027 academic year.`;
  const bodyLines = doc.splitTextToSize(bodyText, contentWidth);
  doc.text(bodyLines, margin, y);
  y += bodyLines.length * 4.5;

  y += 3;
  const semText = `The program is designed to take ${semesters} semesters. All new students will be required to report to the University for registration and commencement of first semester studies on Tuesday 15/09/2026.`;
  const semLines = doc.splitTextToSize(semText, contentWidth);
  doc.text(semLines, margin, y);
  y += semLines.length * 4.5;

  // Conditions
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Your registration as a student of Tharaka University shall be subject to the following conditions:", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const cond1 = "1. Verification of your qualifications by the University. You must present the originals of: KCSE results slip or certificate, school leaving certificate, and national ID / Birth Certificate at your first registration.";
  const c1Lines = doc.splitTextToSize(cond1, contentWidth - 5);
  doc.text(c1Lines, margin + 3, y);
  y += c1Lines.length * 4;

  y += 2;
  const cond2 = "2. To accept, by signing a declaration form, to adhere to all University Rules and Regulations governing Students Conduct after reporting.";
  const c2Lines = doc.splitTextToSize(cond2, contentWidth - 5);
  doc.text(c2Lines, margin + 3, y);
  y += c2Lines.length * 4;

  y += 2;
  doc.text("3. Payment of all fees and charges as set out below:", margin + 3, y);

  // ===== FEE TABLE =====
  y += 7;

  if (isDiploma) {
    const fees = getDiplomaFees();
    // Diploma has 8 columns: S/N, Item, Reg Y1S1, Reg Y1S2, ODeL Y1S1, ODeL Y1S2, ODeL Y2S1, ODeL Y2S2
    const colWidths = [8, 52, 18, 18, 18, 18, 18, 18];
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = margin;

    const drawRow = (cells: string[], rowY: number, bold = false, fillColor?: [number, number, number]) => {
      let x = startX;
      for (let i = 0; i < cells.length; i++) {
        if (fillColor) {
          doc.setFillColor(...fillColor);
          doc.rect(x, rowY - 3.5, colWidths[i], 5, "F");
        }
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.2);
        doc.rect(x, rowY - 3.5, colWidths[i], 5);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        const align = i >= 2 ? "center" : "left";
        const tx = align === "center" ? x + colWidths[i] / 2 : x + 1;
        doc.text(cells[i], tx, rowY, { align: align === "center" ? "center" : "left" });
      }
    };

    // Header row 1
    drawRow(["S/N", "", "REGULAR OPTION", "", "ODeL PROGRAMME OPTION", "", "", ""], y, true, [0, 51, 102]);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("S/N", startX + 1, y);
    doc.text("REGULAR OPTION", startX + colWidths[0] + colWidths[1] + 18, y, { align: "center" });
    doc.text("ODeL PROGRAMME OPTION", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 36, y, { align: "center" });

    y += 5;
    // Sub-header
    drawRow(["", "", "Y1S1", "Y1S2", "Y1S1", "Y1S2", "Y2S1", "Y2S2"], y, true, [220, 230, 242]);

    // Data rows
    for (const row of fees.rows) {
      y += 5;
      drawRow([row.sn, row.item, row.regularY1S1, row.regularY1S2, row.odelY1S1 || "", row.odelY1S2 || "", row.odelY2S1 || "", row.odelY2S2 || ""], y);
    }

    // Total
    y += 5;
    drawRow(["", "TOTAL", fees.regularTotal[0], fees.regularTotal[1], fees.odelTotal[0], fees.odelTotal[1], fees.odelTotal[2], fees.odelTotal[3]], y, true, [245, 245, 245]);

    // Total per year
    y += 5;
    drawRow(["", "TOTAL PER YEAR", fees.regularYear, "", fees.odelTotals[0], "", fees.odelTotals[1], ""], y, true, [245, 245, 245]);

  } else {
    const fees = getCertificateFees();
    const colWidths = [8, 52, 22, 22, 22, 22];
    const startX = margin;

    const drawRow = (cells: string[], rowY: number, bold = false, fillColor?: [number, number, number]) => {
      let x = startX;
      for (let i = 0; i < cells.length; i++) {
        if (fillColor) {
          doc.setFillColor(...fillColor);
          doc.rect(x, rowY - 3.5, colWidths[i], 5, "F");
        }
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.2);
        doc.rect(x, rowY - 3.5, colWidths[i], 5);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        const align = i >= 2 ? "center" : "left";
        const tx = align === "center" ? x + colWidths[i] / 2 : x + 1;
        doc.text(cells[i], tx, rowY, { align: align === "center" ? "center" : "left" });
      }
    };

    // Header
    drawRow(["S/N", "", "REGULAR OPTION", "", "ODeL OPTION", ""], y, true, [0, 51, 102]);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("S/N", startX + 1, y);
    doc.text("REGULAR OPTION", startX + colWidths[0] + colWidths[1] + 22, y, { align: "center" });
    doc.text("ODeL OPTION", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 22, y, { align: "center" });

    y += 5;
    drawRow(["", "", "Y1S1", "Y1S2", "Y1S1", "Y1S2"], y, true, [220, 230, 242]);

    for (const row of fees.rows) {
      y += 5;
      drawRow([row.sn, row.item, row.regularY1S1, row.regularY1S2, row.odelY1S1 || "", row.odelY1S2 || ""], y);
    }

    y += 5;
    drawRow(["", "TOTAL", fees.regularTotal[0], fees.regularTotal[1], fees.odelTotal[0], fees.odelTotal[1]], y, true, [245, 245, 245]);

    y += 5;
    drawRow(["", "TOTAL PER YEAR", fees.regularYear, "", fees.odelYear, ""], y, true, [245, 245, 245]);
  }

  // ===== PAGE 2 =====
  doc.addPage();
  y = 25;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);

  const feeNote = "Please note that the University fees and other charges are determined by the University Council. The Council may revise the fees structure at any time it deems necessary.";
  const fnLines = doc.splitTextToSize(feeNote, contentWidth);
  doc.text(fnLines, margin, y);
  y += fnLines.length * 4.5 + 5;

  // Payment instructions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const payText = `All students MUST pay the required ${admissionFee} non-refundable admission fees through Government E-CITIZEN platform:`;
  const payLines = doc.splitTextToSize(payText, contentWidth);
  doc.text(payLines, margin, y);
  y += payLines.length * 4.5 + 4;

  // M-Pesa box
  doc.setFillColor(245, 248, 252);
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y - 3, contentWidth, 32, 2, 2, "FD");

  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const mpesaLines = [
    "Go to Lipa na M-Pesa",
    "Pay Bill 222222",
    "Account No. APPF-NAME",
    "Amount…….",
    "M-Pesa Pin",
  ];
  for (const line of mpesaLines) {
    doc.text(line, margin + 10, y);
    y += 5;
  }

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("After payment, print your M-Pesa SMS and attach it to your academic documents", margin, y);
  y += 4.5;
  doc.text("for admission number processing.", margin, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const arrangeText = "You will also be required to make your own arrangements during the year to meet catering, exercise books & stationery and accommodation expenses.";
  const arrLines = doc.splitTextToSize(arrangeText, contentWidth);
  doc.text(arrLines, margin, y);
  y += arrLines.length * 4.5 + 5;

  // NB note
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const nbText = isDiploma
    ? "NB/ You will be ELIGIBLE FOR GOVERNMENT HELB LOAN and credit transfer that may allow you to complete the degree course in three (3) years after graduating with a diploma."
    : "NB/ You will be ELIGIBLE for Four/Six Semester Diploma after graduating with a Certificate.";
  const nbLines = doc.splitTextToSize(nbText, contentWidth);
  doc.text(nbLines, margin, y);
  y += nbLines.length * 4.5 + 5;

  // Contact
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const contactText = "If you accept the offer under these conditions, contact Mobile No. 0720021155 - Dr. Faustine Muchui to formalize your admission.";
  const ctLines = doc.splitTextToSize(contactText, contentWidth);
  doc.text(ctLines, margin, y);
  y += ctLines.length * 4.5 + 5;

  // Closing
  const closeText = "We look forward to you joining Tharaka University - Mukothima Centre and on behalf of the Vice Chancellor, I wish you success in your future studies at our institution.";
  const clLines = doc.splitTextToSize(closeText, contentWidth);
  doc.text(clLines, margin, y);
  y += clLines.length * 4.5 + 8;

  doc.text("Yours Faithfully,", margin, y);

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Dr. Daniel Mwangi", margin, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Ag. Registrar (Academic Affairs)", margin, y);

  // Footer on both pages
  for (let p = 1; p <= 2; p++) {
    doc.setPage(p);
    const footY = pageHeight - 12;
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.4);
    doc.line(margin, footY, pageWidth - margin, footY);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Education for Freedom / Elimu ni Uhuru", pageWidth / 2, footY + 4, { align: "center" });
    doc.text("Tharaka University is ISO 9001:2015 Certified", pageWidth / 2, footY + 8, { align: "center" });
  }

  doc.save(`Admission_Letter_${applicant.fullName.replace(/\s+/g, "_")}.pdf`);
}
