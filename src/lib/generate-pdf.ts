import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ApplicantData, AdmissionResult } from "./admission-logic";

/* ================= MAIN FUNCTION ================= */
export async function generateAdmissionLetter(
  applicant: ApplicantData,
  result: AdmissionResult
): Promise<void> {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 25;

  const isDiploma = result.category === "Diploma";

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("OFFICE OF THE REGISTRAR", pageWidth / 2, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "italic");
  doc.text("(Academic Affairs)", pageWidth / 2, y, { align: "center" });

  y += 10;
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, y, { align: "right" });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, { align: "center" });

  y += 12;

  /* ================= APPLICANT ================= */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Name: ${applicant.fullName}`, margin, y);
  y += 6;
  doc.text(`Index No: ${applicant.indexNumber}`, margin, y);
  y += 6;
  doc.text(`Phone: ${applicant.phoneNumber}`, margin, y);

  /* ================= BODY ================= */
  y += 10;
  doc.setFontSize(9.5);

  const intro = `You have been offered admission to pursue ${result.courseName} in the ${result.faculty} for the 2026/2027 academic year.`;
  doc.text(doc.splitTextToSize(intro, contentWidth), margin, y);

  y += 12;
  doc.text("3. Payment of all fees as shown below:", margin, y);

  /* ================= TABLE TITLE ================= */
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("FEE STRUCTURE", margin, y);
  doc.setTextColor(0, 0, 0);

  y += 4;

  /* ================= DIPLOMA TABLE ================= */
  if (isDiploma) {
    autoTable(doc, {
      startY: y,

      head: [
        [
          "S/N",
          "ITEM",
          "REGULAR Y1S1",
          "REGULAR Y1S2",
          "ODeL Y1S1",
          "ODeL Y1S2",
          "ODeL Y2S1",
          "ODeL Y2S2",
        ],
      ],

      body: [
        ["1", "Tuition", "35,000", "35,000", "26,000", "26,000", "26,000", "26,000"],
        ["2", "Registration", "1,000", "", "1,000", "", "1,000", ""],
        ["3", "Library", "2,000", "", "2,000", "", "2,000", ""],
        ["4", "Examination", "3,000", "", "3,000", "", "3,000", ""],
        ["5", "Student Union", "1,000", "", "1,000", "", "", ""],
        ["6", "Caution", "2,000", "", "2,000", "", "", ""],
        ["7", "Student ID", "500", "", "500", "", "", ""],
      ],

      foot: [
        ["", "TOTAL", "48,500", "35,000", "35,500", "26,000", "32,000", "26,000"],
        ["", "TOTAL PER YEAR", "83,500", "", "61,000", "", "58,000", ""],
      ],

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      headStyles: {
        fillColor: [0, 51, 102],
        textColor: 255,
        halign: "center",
      },

      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
      },

      columnStyles: {
        0: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
        7: { halign: "center" },
      },
    });
  }

  /* ================= CERTIFICATE TABLE ================= */
  else {
    autoTable(doc, {
      startY: y,

      head: [
        ["S/N", "ITEM", "REGULAR Y1S1", "REGULAR Y1S2", "ODeL Y1S1", "ODeL Y1S2"],
      ],

      body: [
        ["1", "Tuition", "30,000", "30,000", "17,500", "17,500"],
        ["2", "Registration", "1,000", "", "1,000", ""],
        ["3", "Library", "2,000", "", "2,000", ""],
        ["4", "Examination", "2,000", "", "3,000", ""],
      ],

      foot: [["", "TOTAL", "38,500", "30,000", "27,000", "17,500"]],

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fillColor: [0, 51, 102],
        textColor: 255,
      },

      footStyles: {
        fillColor: [240, 240, 240],
        fontStyle: "bold",
      },
    });
  }

  /* ================= PAGE 2 ================= */
  doc.addPage();
  y = 25;

  doc.setFontSize(10);
  doc.text("PAYMENT INSTRUCTIONS", margin, y);

  y += 10;
  doc.setFontSize(9);

  const mpesa = [
    "Go to Lipa na M-Pesa",
    "Pay Bill: 222222",
    "Account: APPF-NAME",
    "Enter Amount",
    "Enter PIN",
  ];

  mpesa.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });

  /* ================= SIGNATURE ================= */
  y += 20;
  doc.text("Yours Faithfully,", margin, y);

  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Dr. Daniel Mwangi", margin, y);

  y += 5;
  doc.text("Ag. Registrar (Academic Affairs)", margin, y);

  /* ================= FOOTER ================= */
  for (let p = 1; p <= doc.getNumberOfPages(); p++) {
    doc.setPage(p);

    const footY = pageHeight - 12;

    doc.setFontSize(7);
    doc.text("Education for Freedom / Elimu ni Uhuru", pageWidth / 2, footY, {
      align: "center",
    });

    doc.text(
      "Tharaka University is ISO 9001:2015 Certified",
      pageWidth / 2,
      footY + 4,
      { align: "center" }
    );
  }

  doc.save(`Admission_Letter_${applicant.fullName}.pdf`);
}
