import jsPDF from "jspdf";

/* ================= LOAD IMAGE ================= */
async function loadImage(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/* ================= MAIN FUNCTION ================= */
export async function generateAdmissionLetter(applicant, result) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  /* ================= LOAD LOGO + SIGNATURE ================= */
  let logo = "";
  let signature = "";

  try {
    logo = await loadImage("/images/tharaka-logo.jpg");
    signature = await loadImage("/images/signature.png"); // upload your signature here
  } catch {}

  /* ================= HEADER ================= */
  if (logo) {
    doc.addImage(logo, "JPEG", pageWidth / 2 - 25, y, 50, 20);
    y += 22;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("THARAKA UNIVERSITY", pageWidth / 2, y, { align: "center" });

  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("P.O BOX 193-60215, MARIMANTI, KENYA", pageWidth / 2, y, { align: "center" });

  y += 4;
  doc.text("Email: info@tharaka.ac.ke | Website: www.tharaka.ac.ke", pageWidth / 2, y, { align: "center" });

  /* ===== LINE ===== */
  y += 6;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);

  /* ================= OFFICE ================= */
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("OFFICE OF THE REGISTRAR", pageWidth / 2, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "italic");
  doc.text("(Academic Affairs)", pageWidth / 2, y, { align: "center" });

  /* ================= DATE ================= */
  y += 10;
  const today = new Date().toDateString();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(today, margin, y);

  /* ================= TITLE ================= */
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("PROVISIONAL LETTER OF OFFER", pageWidth / 2, y, { align: "center" });

  y += 2;
  doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);

  /* ================= STUDENT DETAILS ================= */
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  doc.text(`Name: ${applicant.fullName}`, margin, y);
  y += 6;
  doc.text(`Index No: ${applicant.indexNumber}`, margin, y);
  y += 6;
  doc.text(`Phone: ${applicant.phoneNumber}`, margin, y);

  /* ================= BODY ================= */
  y += 10;

  doc.setFontSize(9.5);
  const body1 = `Following your completion of Form Four studies, we are pleased to inform you that you have been offered provisional admission to Tharaka University to pursue ${result.courseName} in the ${result.faculty} for the 2026/2027 academic year.`;

  doc.text(doc.splitTextToSize(body1, contentWidth), margin, y);
  y += 12;

  const body2 = `The programme will take ${result.category === "Diploma" ? "four" : "two"} semesters. You are required to report on 15th September 2026 for registration.`;

  doc.text(doc.splitTextToSize(body2, contentWidth), margin, y);
  y += 12;

  /* ================= CONDITIONS ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Admission Conditions:", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");

  const conditions = [
    "1. Present original KCSE certificate, leaving certificate, and ID.",
    "2. Sign student declaration form.",
    "3. Pay all required fees as outlined below.",
  ];

  conditions.forEach((c) => {
    doc.text(doc.splitTextToSize(c, contentWidth), margin, y);
    y += 6;
  });

  /* ================= SIMPLE TABLE ================= */
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("FEE STRUCTURE", margin, y);

  y += 6;

  doc.setFont("helvetica", "normal");

  const fees = [
    ["Item", "Amount"],
    ["Tuition", "30,000"],
    ["Registration", "1,000"],
    ["Library", "2,000"],
    ["Total", "38,500"],
  ];

  fees.forEach((row) => {
    doc.text(row[0], margin, y);
    doc.text(row[1], pageWidth - margin - 30, y);
    y += 6;
  });

  /* ================= PAGE 2 ================= */
  doc.addPage();
  y = 25;

  doc.setFontSize(9.5);

  doc.text(
    doc.splitTextToSize(
      "University fees may change as determined by the University Council.",
      contentWidth
    ),
    margin,
    y
  );

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT PROCEDURE (M-PESA)", margin, y);

  y += 6;

  const mpesa = [
    "Go to Lipa na M-Pesa",
    "Pay Bill: 222222",
    "Account: APPF-NAME",
    "Enter Amount",
    "Enter PIN",
  ];

  doc.setFont("helvetica", "normal");
  mpesa.forEach((m) => {
    doc.text(m, margin + 5, y);
    y += 6;
  });

  y += 10;

  doc.text(
    "Attach payment SMS to your documents for processing.",
    margin,
    y
  );

  y += 15;

  doc.text("Yours Faithfully,", margin, y);

  /* ================= SIGNATURE ================= */
  y += 15;

  if (signature) {
    doc.addImage(signature, "PNG", margin, y - 10, 40, 15);
  }

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Dr. Daniel Mwangi", margin, y);

  y += 5;
  doc.text("Ag. Registrar (Academic Affairs)", margin, y);

  /* ================= FOOTER ================= */
  const addFooter = () => {
    const fy = pageHeight - 15;

    doc.setDrawColor(0, 51, 102);
    doc.line(margin, fy, pageWidth - margin, fy);

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Education for Freedom / Elimu ni Uhuru", pageWidth / 2, fy + 5, {
      align: "center",
    });

    doc.text("ISO 9001:2015 Certified Institution", pageWidth / 2, fy + 9, {
      align: "center",
    });
  };

  doc.setPage(1);
  addFooter();

  doc.setPage(2);
  addFooter();

  /* ================= SAVE ================= */
  doc.save(`Admission_${applicant.fullName}.pdf`);
}
