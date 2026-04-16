import jsPDF from "jspdf";
import type { ApplicantData, AdmissionResult } from "./admission-logic";
import { supabase } from "@/integrations/supabase/client";

/* ================= TYPES ================= */
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

/* ================= TABLE DRAWER ================= */
function drawTable(
  doc: jsPDF,
  startY: number,
  headers: string[],
  subHeaders: string[],
  rows: FeeRow[],
  totals: string[],
  colWidths: number[],
  margin: number
) {
  let y = startY;
  const rowHeight = 7;
  const startX = margin;

  const drawRow = (
    cells: string[],
    yPos: number,
    bold = false,
    fillColor?: [number, number, number]
  ) => {
    let x = startX;

    for (let i = 0; i < cells.length; i++) {
      if (fillColor) {
        doc.setFillColor(...fillColor);
        doc.rect(x, yPos, colWidths[i], rowHeight, "F");
      }

      doc.setDrawColor(120);
      doc.rect(x, yPos, colWidths[i], rowHeight);

      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(8);

      const align = i >= 2 ? "center" : "left";
      const textX = i >= 2 ? x + colWidths[i] / 2 : x + 2;

      doc.text(cells[i] || "", textX, yPos + 4.5, {
        align: align as any,
        maxWidth: colWidths[i] - 4,
      });

      x += colWidths[i];
    }
  };

  // HEADER
  drawRow(headers, y, true, [0, 51, 102]);
  doc.setTextColor(255, 255, 255);

  y += rowHeight;

  // SUB HEADER
  drawRow(subHeaders, y, true, [220, 230, 242]);
  doc.setTextColor(0, 0, 0);

  // DATA ROWS
  for (const row of rows) {
    y += rowHeight;
    drawRow([row.sn, row.item, ...row.values], y);
  }

  // TOTAL
  y += rowHeight;
  drawRow(["", "TOTAL", ...totals], y, true, [240, 240, 240]);

  return y + rowHeight;
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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 25;

  const isDiploma = result.category === "Diploma";
  const admissionFee = isDiploma ? "2,000" : "1,000";

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("OFFICE OF THE REGISTRAR", pageWidth / 2, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("(Academic Affairs)", pageWidth / 2, y, { align: "center" });

  // DATE RIGHT
  y += 10;
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, y, { align: "right" });

  // TITLE
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, { align: "center" });

  y += 2;
  const titleWidth = doc.getTextWidth("PROVISIONAL LETTER OF OFFER");
  doc.line((pageWidth - titleWidth) / 2, y, (pageWidth + titleWidth) / 2, y);

  /* ================= APPLICANT ================= */
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Name: ${applicant.fullName}`, margin, y);
  y += 6;
  doc.text(`Index No: ${applicant.indexNumber}`, margin, y);
  y += 6;
  doc.text(`Phone: ${applicant.phoneNumber}`, margin, y);

  /* ================= BODY PAGE 1 ================= */
  y += 10;
  doc.setFontSize(9.5);

  const intro = `Following your completion of form four studies, we are pleased to inform you that you have been offered provisional admission to Tharaka University, Mukothima Centre for a ${result.courseName} in the ${result.faculty} for the 2026/2027 academic year.`;
  doc.text(doc.splitTextToSize(intro, contentWidth), margin, y);

  y += 12;

  const duration = `The program is designed to take ${
    isDiploma ? "four" : "two"
  } semesters. All new students will be required to report on Tuesday 15/09/2026 for registration.`;

  doc.text(doc.splitTextToSize(duration, contentWidth), margin, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text(
    "Your registration as a student shall be subject to the following conditions:",
    margin,
    y
  );

  y += 8;
  doc.setFont("helvetica", "normal");

  doc.text(
    doc.splitTextToSize(
      "1. Verification of your qualifications. Present original KCSE certificate, school leaving certificate, and ID/Birth Certificate.",
      contentWidth
    ),
    margin,
    y
  );

  y += 10;

  doc.text(
    doc.splitTextToSize(
      "2. Signing a declaration agreeing to University Rules and Regulations.",
      contentWidth
    ),
    margin,
    y
  );

  y += 10;

  doc.text("3. Payment of all fees as shown below:", margin, y);

  /* ================= TABLE ================= */
  y += 8;

  if (!isDiploma) {
    const rows: FeeRow[] = [
      { sn: "1", item: "Tuition fee", values: ["30,000", "30,000", "17,500", "17,500"] },
      { sn: "2", item: "Registration", values: ["1,000", "", "1,000", ""] },
      { sn: "3", item: "Library", values: ["2,000", "", "2,000", ""] },
    ];

    const headers = ["S/N", "ITEM", "REGULAR", "", "ODeL", ""];
    const subHeaders = ["", "", "Y1S1", "Y1S2", "Y1S1", "Y1S2"];
    const totals = ["38,500", "30,000", "27,000", "17,500"];
    const colWidths = [10, 70, 25, 25, 25, 25];

    y = drawTable(doc, y, headers, subHeaders, rows, totals, colWidths, margin);
  }

  /* ================= PAGE 2 ================= */
  doc.addPage();
  y = 25;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);

  doc.text(
    doc.splitTextToSize(
      "University fees are subject to change by the University Council.",
      contentWidth
    ),
    margin,
    y
  );

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text(
    `All students MUST pay ${admissionFee} admission fee via E-Citizen:`,
    margin,
    y
  );

  y += 10;

  doc.rect(margin, y, contentWidth, 30);

  y += 6;
  const mpesa = [
    "Go to Lipa na M-Pesa",
    "Pay Bill: 222222",
    "Account: APPF-NAME",
    "Enter Amount",
    "Enter PIN",
  ];

  mpesa.forEach((line) => {
    doc.text(line, margin + 5, y);
    y += 5;
  });

  y += 6;

  doc.text(
    doc.splitTextToSize(
      "After payment, attach M-Pesa message to your documents.",
      contentWidth
    ),
    margin,
    y
  );

  y += 10;

  doc.text(
    "You must cater for accommodation, meals, and personal expenses.",
    margin,
    y
  );

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text(
    isDiploma
      ? "NB: Eligible for HELB loan and degree progression."
      : "NB: Eligible to progress to Diploma.",
    margin,
    y
  );

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.text(
    "Contact 0720021155 (Dr. Faustine Muchui) to confirm admission.",
    margin,
    y
  );

  y += 12;

  doc.text(
    "We look forward to welcoming you to Tharaka University.",
    margin,
    y
  );

  y += 15;

  doc.text("Yours Faithfully,", margin, y);

  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Dr. Daniel Mwangi", margin, y);

  y += 5;
  doc.text("Ag. Registrar (Academic Affairs)", margin, y);

  /* ================= FOOTER ================= */
  for (let p = 1; p <= 2; p++) {
    doc.setPage(p);
    const footY = pageHeight - 12;

    doc.setFontSize(7);
    doc.text(
      "Education for Freedom / Elimu ni Uhuru",
      pageWidth / 2,
      footY,
      { align: "center" }
    );

    doc.text(
      "Tharaka University is ISO 9001:2015 Certified",
      pageWidth / 2,
      footY + 4,
      { align: "center" }
    );
  }

  doc.save(`Admission_Letter_${applicant.fullName}.pdf`);
}
