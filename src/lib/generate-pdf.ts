import jsPDF from "jspdf";
import type { ApplicantData, AdmissionResult } from "./admission-logic";
import { supabase } from "@/integrations/supabase/client";

interface FeeRow {
  sn: string;
  item: string;
  values: string[];
}

type Templates = Record<string, string>;

/* ================= FETCH TEMPLATE ================= */
async function fetchTemplates(): Promise<Templates> {
  const { data } = await supabase.from("letter_templates").select("template_key, content");
  const map: Templates = {};
  if (data) data.forEach((t) => (map[t.template_key] = t.content));
  return map;
}

function t(templates: Templates, key: string, fallback: string): string {
  return templates[key] ?? fallback;
}

/* ================= IMAGE LOADER ================ */
async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ================= TABLE DRAWER ================= */
function drawTable(
  doc: jsPDF,
  startY: number,
  headers: string[][],
  rows: FeeRow[],
  totals: string[][],
  colWidths: number[],
  margin: number
) {
  let y = startY;
  const rowHeight = 6.5;
  const fontSize = 7.5;
  const startX = margin;

  const drawRowCells = (
    cells: string[],
    yPos: number,
    bold = false,
    fillColor?: [number, number, number],
    textColor?: [number, number, number]
  ) => {
    let x = startX;
    for (let i = 0; i < cells.length; i++) {
      if (fillColor) {
        doc.setFillColor(...fillColor);
        doc.rect(x, yPos, colWidths[i], rowHeight, "F");
      }
      doc.setDrawColor(100);
      doc.setLineWidth(0.2);
      doc.rect(x, yPos, colWidths[i], rowHeight);

      doc.setFont("times", bold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      if (textColor) {
        doc.setTextColor(...textColor);
      } else {
        doc.setTextColor(0, 0, 0);
      }

      const align = i >= 2 ? "center" : "left";
      const textX = i >= 2 ? x + colWidths[i] / 2 : x + 1.5;
      doc.text(cells[i] || "", textX, yPos + 4.5, {
        align: align as any,
        maxWidth: colWidths[i] - 3,
      });
      x += colWidths[i];
    }
  };

  // HEADER ROWS
  for (const headerRow of headers) {
    drawRowCells(headerRow, y, true, [0, 51, 102], [255, 255, 255]);
    y += rowHeight;
  }
  doc.setTextColor(0, 0, 0);

  // DATA ROWS
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const fill: [number, number, number] | undefined = ri % 2 === 0 ? [250, 250, 250] : undefined;
    drawRowCells([row.sn, row.item, ...row.values], y, false, fill);
    y += rowHeight;
  }

  // TOTAL ROWS
  for (const totalRow of totals) {
    drawRowCells(totalRow, y, true, [220, 230, 242]);
    y += rowHeight;
  }

  return y;
}

/* ================= MAIN FUNCTION ================= */
export async function generateAdmissionLetter(
  applicant: ApplicantData,
  result: AdmissionResult
): Promise<void> {
  const tpl = await fetchTemplates();
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 12;

  const isDiploma = result.category === "Diploma";

  /* ================= HEADER WITH LOGO ================= */
  try {
    const headerImg = await loadImageAsBase64("/images/tharaka-header.png");
    const imgWidth = contentWidth;
    const imgHeight = 28;
    doc.addImage(headerImg, "PNG", margin, y, imgWidth, imgHeight);
    y += imgHeight + 4;
  } catch {
    // Fallback text header if image fails
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("THARAKA UNIVERSITY", pageWidth / 2, y + 10, { align: "center" });
    y += 20;
  }

  //* ================= OFFICE LINE ================= */
doc.setFont("times", "bold");
doc.setFontSize(11);
doc.text("OFFICE OF THE REGISTRAR", pageWidth / 2, y, { align: "center" });

y += 5;
doc.setFontSize(10);
doc.text("(Academic Affairs)", pageWidth / 2, y, { align: "center" });

/* ===== BOLD FULL-WIDTH BLACK LINE ===== */
y += 6;

// FORCE BLACK COLOR + THICK LINE
doc.setDrawColor(0, 0, 0);   // black
doc.setLineWidth(1.5);       // bold thickness

doc.line(margin, y, pageWidth - margin, y);

y += 8; // space after line

  /* ================= DATE ================= */
  y += 7;
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  const today = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const day = today.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  const dateStr = `${day}${suffix} ${months[today.getMonth()]} ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - margin, y, { align: "right" });

  /* ================= TITLE ================= */
  y += 8;
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, { align: "center" });

  /* ================= APPLICANT INFO ================= */
  y += 8;
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text(`Name: ${applicant.fullName}`, margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(`Index Number: ${applicant.indexNumber}`, margin, y);

  /* ================= BODY PARAGRAPH 1 ================= */
  y += 8;
  doc.setFontSize(10);

  // Build paragraph with mixed bold/normal
  const lineHeight = 4.5;

doc.setFont("times", "normal");
doc.text(
  "Following your completion of form four studies, we are pleased to inform you that you have been offered provisional admission to",
  margin,
  y
);

y += lineHeight;

doc.setFont("times", "bold");
const admissionLine = `Tharaka University, Mukothima Centre for a ${result.courseName} in the ${result.faculty}`;
const admissionLines = doc.splitTextToSize(admissionLine, contentWidth);
doc.text(admissionLines, margin, y);
y += admissionLines.length * lineHeight;

doc.setFont("times", "normal");
doc.text(
  "for the 2026/2027 academic year.",
  margin,
  y
);

y += lineHeight + 3;

  // Second body paragraph
  const semestersText = isDiploma ? "four semesters" : "two semesters";
  const bodyP2 = `The program is designed to take ${semestersText}. All new students will be required to report to the University for registration and commencement of first semester studies of 2026/2027 academic year on Monday 24/08/2026.`;
  const p2Lines = doc.splitTextToSize(bodyP2, contentWidth);
  doc.text(p2Lines, margin, y);
  y += p2Lines.length * lineHeight + 3;

  // Conditions intro
  const condIntro = "Your registration as a student of Tharaka University shall be subject to the following conditions:";
  const condLines = doc.splitTextToSize(condIntro, contentWidth);
  doc.text(condLines, margin, y);
  y += condLines.length * lineHeight + 2;

  // Numbered conditions
  const indentX = margin + 5;
  const condWidth = contentWidth - 5;

  doc.text("1.", margin, y);
  const cond1 = "Verification of your qualifications by the University. You must, therefore, present the originals of the following documents: KCSE/KCE/KACE results slip or certificate, school leaving certificate, diploma transcripts and certificates, and the national ID / Birth Certificate at your first registration";
  const c1Lines = doc.splitTextToSize(cond1, condWidth);
  doc.text(c1Lines, indentX, y);
  y += c1Lines.length * lineHeight + 2;

  doc.text("2.", margin, y);
  const cond2 = "To accept, by signing a declaration form, to adhere to all University Rules and Regulations governing Students Conduct after reporting.";
  const c2Lines = doc.splitTextToSize(cond2, condWidth);
  doc.text(c2Lines, indentX, y);
  y += c2Lines.length * lineHeight + 2;

  doc.text("3.", margin, y);
  doc.text("Payment of all fees and charges as set out below:", indentX, y);
  y += lineHeight + 4;

/* ================= FEE TABLE ================= */
if (isDiploma) {
  // ===== DIPLOMA (REGULAR ONLY) =====
  const headers = [
    ["S/N", "ITEM", "Y1S1", "Y1S2"],
  ];

  const rows: FeeRow[] = [
    { sn: "1", item: "Tuition fee per year", values: ["35,000", "35,000"] },
    { sn: "2", item: "Registration fee per year", values: ["1,000", ""] },
    { sn: "3", item: "Library per year", values: ["2,000", ""] },
    { sn: "4", item: "Activity fee per year", values: ["1,000", ""] },
    { sn: "5", item: "Examination fee per year", values: ["3,000", ""] },
    { sn: "6", item: "Material development per year", values: ["3,000", ""] },
    { sn: "7", item: "Students Union 1st year", values: ["1,000", ""] },
    { sn: "8", item: "Caution money once", values: ["2,000", ""] },
    { sn: "10", item: "Student ID once", values: ["500", ""] },
  ];

  const totals = [
    ["", "TOTAL", "48,500", "35,000"],
  ];

  const colWidths = [10, 80, 30, 30];

  y = drawTable(doc, y, headers, rows, totals, colWidths, margin);

} else {
  // ===== CERTIFICATE (REGULAR ONLY) =====
  const headers = [
    ["S/N", "ITEM", "Y1S1", "Y1S2"],
  ];

  const rows: FeeRow[] = [
    { sn: "1", item: "Tuition fee per year", values: ["30,000", "30,000"] },
    { sn: "2", item: "Registration fee", values: ["1,000", ""] },
    { sn: "3", item: "Library fee", values: ["2,000", ""] },
    { sn: "4", item: "Examination fee", values: ["2,000", ""] },
    { sn: "5", item: "Activity fee", values: ["1,000", ""] },
    { sn: "6", item: "Students Union", values: ["1,000", ""] },
    { sn: "7", item: "Caution money once", values: ["2,000", ""] },
    { sn: "8", item: "Student ID once", values: ["500", ""] },
  ];

  const totals = [
    ["", "TOTAL", "310,500", "30,000"],
  ];

  const colWidths = [10, 80, 30, 30];

  y = drawTable(doc, y, headers, rows, totals, colWidths, margin);
}





  /* ================= POST-TABLE CONTENT ================= */
  y += 5;
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const feesNote = "Please note that the University fees and other charges are determined by the University Council. The Council may revise the fees structure at any time it deems necessary.";
  const fnLines = doc.splitTextToSize(feesNote, contentWidth);
  doc.text(fnLines, margin, y);
  y += fnLines.length * lineHeight + 4;

  /* ================= PAYMENT INSTRUCTIONS ================= */
doc.setFont("times", "bold");
doc.setFontSize(10);

const payIntro =
  "All students MUST pay the required 2000 non-refundable admission fees through Government E-CITIZEN platform:";

const piLines = doc.splitTextToSize(payIntro, contentWidth);
doc.text(piLines, margin, y);

y += piLines.length * lineHeight + 3;

// Steps (normal text)
doc.setFont("times", "normal");
doc.setFontSize(10);

const paySteps: string[] = [];

for (const step of paySteps) {
  doc.text(step, margin + 5, y);
  y += lineHeight + 0.5;
}

y += 2;
  const afterPay = ".";
  const apLines = doc.splitTextToSize(afterPay, contentWidth);
  doc.text(apLines, margin, y);
  y += apLines.length * lineHeight + 4;

  /* ================= CHECK PAGE OVERFLOW ================= */
  if (y > pageHeight - 65) {
    doc.addPage();
    y = 20;
  }

  /* ================= ADDITIONAL NOTES ================= */
  doc.setFont("times", "normal");
  const arrangements = "You will also be required to make your own arrangements during the year to meet catering, exercise books & stationery and accommodation expenses.";
  const arrLines = doc.splitTextToSize(arrangements, contentWidth);
  doc.text(arrLines, margin, y);
  y += arrLines.length * lineHeight + 4;

  // HELB note (only for Diploma)
if (isDiploma) {
  const helb =
    "NB/ you will be LEGIBLE FOR GOVERNMENT HELB LOAN and credit transfer that may allow you to complete the degree course in three (3) years after graduating with a diploma.";

  doc.setFont("times", "bold");   // set bold first
  doc.setFontSize(10);

  const hLines = doc.splitTextToSize(helb, contentWidth);
  doc.text(hLines, margin, y);

  y += hLines.length * (lineHeight + 0.5) + 5; // better spacing
  }

  /* ================= CONTACT & ACCEPTANCE ================= */
 doc.setFont("times", "bold");
doc.setFontSize(10);
doc.setTextColor(0, 51, 153); // strong blue

const contact =
  "If you accept the offer under these conditions, contact Mobile No. 0720021155 - Dr. Faustine Muchui. to formalize your admission.";

const ctLines = doc.splitTextToSize(contact, contentWidth);
doc.text(ctLines, margin, y);

y += ctLines.length * lineHeight + 4;

// Reset color back to black for next text
doc.setTextColor(0, 0, 0);

  const closing = "We look forward to you joining Tharaka University - Mukothima Centre and on behalf of the Vice Chancellor, I wish you success in your future studies at our institution.";
  const clLines = doc.splitTextToSize(closing, contentWidth);
  doc.text(clLines, margin, y);
  y += clLines.length * lineHeight + 5;

  /* ================= SIGNATURE ================= */
doc.text("Yours Faithfully,", margin, y);
y += 3;

try {
  const sigImg = await loadImageAsBase64("/images/registrar-signature.png");
  doc.addImage(sigImg, "PNG", margin, y, 30, 12);

  y += 18; // ⬅️ increased space after signature image
} catch {
  y += 16; // keep similar spacing if no image
}

doc.setFont("times", "bold");
doc.text("Dr. Daniel Mwangi", margin, y);

y += 5;
doc.text("Ag. Registrar (Academic Affairs)", margin, y);

doc.save(`Admission_Letter_${applicant.fullName}.pdf`);
}
