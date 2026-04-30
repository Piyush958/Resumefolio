"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportResumePdf(name: string, selector = "resume-preview") {
  const target = document.getElementById(selector);
  if (!target) {
    throw new Error("Preview element not found.");
  }

  const canvas = await html2canvas(target, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let remainingHeight = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    position = remainingHeight - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
  }

  const fileName = `${name.replace(/\s+/g, "-") || "Resume"}-Resume.pdf`;
  pdf.save(fileName);
}
