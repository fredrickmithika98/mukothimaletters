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

/* ================= CLEAN TABLE DRAWER ================= */
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
  drawRow(["", "TOTAL", ...totals.slice(0, headers.length - 2)], y, true, [240, 240, 240]);

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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 25;

  const isDiploma = result.category === "Diploma";

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("THARAKA UNIVERSITY", pageWidth / 2, y, { align: "center" });

  y += 6;
  doc.setFontSize(10);
  doc.text("OFFICE OF THE REGISTRAR (Academic Affairs)", pageWidth / 2, y, {
    align: "center",
  });

  y += 10;
  doc.setFontSize(11);
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, {
    align: "center",
  });

  y += 10;

  /* ================= APPLICANT INFO ================= */
  doc.setFontSize(10);
  doc.text(`Name: ${applicant.fullName}`, margin, y);
  y += 6;
  doc.text(`Index No: ${applicant.indexNumber}`, margin, y);
  y += 6;
  doc.text(`Phone: ${applicant.phoneNumber}`, margin, y);

  /* ================= BODY ================= */
  y += 10;

  doc.setFontSize(9);
  const body = `Following your completion of form four studies, we are pleased to inform you that you have been offered provisional admission to Tharaka University, Mukothima Center for a  ${result.courseName} in the ${result.faculty} for the 2026/2027 academic year The program is designed to take four semesters. All new students will be required to report to the University for registration and commencement of first semester studies of 2026/2027 academic year on Tuesday 15/09/2026.

Your registration as a student of Tharaka University shall be subject to the following conditions:
1.  Verification of your qualifications by the University. You must, therefore, present the originals of the following documents: KCSE/KCE/KACE results slip or certificate, school leaving certificate, diploma transcripts and certificates, and the national ID / Birth Certificate at your first registration
2.  To accept, by signing a declaration form, to adhere to all University Rules and Regulations governing Students Conduct after reporting.
.`;
  const lines = doc.splitTextToSize(body, contentWidth);
  doc.text(lines, margin, y);

  y += lines.length * 5 + 5;

  doc.text("3. Payment of fees as shown below:", margin, y);

  /* ================= TABLE TITLE ================= */
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("FEE STRUCTURE", margin, y);

  y += 5;
  doc.setTextColor(0, 0, 0);

  /* ================= CERTIFICATE TABLE ================= */
  if (!isDiploma) {
    const rows: FeeRow[] = [
      { sn: "1", item: "Tuition fee per year", values: ["30,000", "30,000", "17,500", "17,500"] },
      { sn: "2", item: "Registration fee", values: ["1,000", "", "1,000", ""] },
      { sn: "3", item: "Library fee", values: ["2,000", "", "2,000", ""] },
      { sn: "4", item: "Examination fee", values: ["2,000", "", "3,000", ""] },
    ];

    const headers = ["S/N", "ITEM", "REGULAR", "", "ODeL", ""];
    const subHeaders = ["", "", "Y1S1", "Y1S2", "Y1S1", "Y1S2"];
    const totals = ["38,500", "30,000", "27,000", "17,500"];
    const colWidths = [10, 70, 25, 25, 25, 25];

    y = drawTable(doc, y, headers, subHeaders, rows, totals, colWidths, margin);
  }

  /* ================= FOOTER ================= */
  y += 15;

  doc.text("Yours Faithfully,", margin, y);
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("Dr. Daniel Mwangi", margin, y);
  y += 5;
  doc.text("Ag. Registrar (Academic Affairs)", margin, y);

  doc.save(`Admission_Letter_${applicant.fullName}.pdf`);
}
