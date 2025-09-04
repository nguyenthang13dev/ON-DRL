import kySoCauHinhService from "@/services/kySoCauHinh/kySoCauHinhService";
import {
  KySoCauHinhType,
  PdfDisplayType,
} from "@/types/kySoCauHinh/kySoCauHinh";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

export const addImageAndTextToPdf = async (
  listCauHinh: KySoCauHinhType[],
  pdfTempLink: string,
  pdfDisplay: PdfDisplayType
) => {
  // Load PDF từ URL
  const fileUrl = `${StaticFileUrl}/${pdfTempLink}`;
  const existingPdfBytes = await fetch(fileUrl).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const { displayWidth, displayHeight, marginTop } = pdfDisplay;

  // Đăng ký fontkit nếu cần
  pdfDoc.registerFontkit(fontkit);
  const font = await loadFont(pdfDoc);
  const pages = pdfDoc.getPages();

  // === Chèn hình ảnh ===
  for (const item of listCauHinh) {
    const pageIndex = calculatePageFromY(item.posY, pdfDisplay) - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) {
      console.warn(`Invalid page index: ${pageIndex}`);
      continue;
    }
    const page = pages[pageIndex];
    const { width: pdfWidth, height: pdfHeight } = page.getSize();
    const scaleX = pdfWidth / displayWidth;
    const scaleY = pdfHeight / displayHeight;
    if (item.type == "IMAGE") {
      const response = await kySoCauHinhService.image(item.imageSrc);
      if (!response || !response.status) {
        continue;
      }
      const imageBytes = response.data;
      const pngImage = await pdfDoc.embedPng(imageBytes);
      page.drawImage(pngImage, {
        x: item.posX * scaleX,
        y: pdfHeight - ((item.posY % displayHeight) + item.height) * scaleY,
        width: item.width * scaleX,
        height: item.height * scaleY,
      });
    }
    if (item.type === "TEXT" && item.content) {
      const fontSize = isNaN(Number(item.fontSize)) ? 8 : Number(item.fontSize);
      const lineHeight = fontSize * 1.2;
      const lines = item.content.split("\n");
      const { r, g, b } = hexToRgb(item.textColor || "#000000");

      lines.forEach((line, index) => {
        page.drawText(line, {
          x: (item.posX + 5) * scaleX,
          y:
            pdfHeight -
            ((item.posY % displayHeight) + 25 / 2 + 5 + index * lineHeight) *
              scaleY,
          font,
          size: fontSize,
          maxWidth: item.width * scaleX,
          color: rgb(r, g, b),
        });
      });
    }
  }

  // Trả lại blob PDF sau khi đã xử lý
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

// Hàm tải font arial
const loadFont = async (pdfDoc: PDFDocument) => {
  const fontUrl = "/fonts/arial/arial.ttf";
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  return pdfDoc.embedFont(fontBytes, { subset: true });
};

const calculatePageFromY = (y: number, pdfDisplay: PdfDisplayType) => {
  const pageHeight = pdfDisplay.displayHeight;
  const adjustedY = Math.max(0, y - pdfDisplay.marginTop);
  const pageIndex = Math.floor(adjustedY / pageHeight) + 1;
  return pageIndex;
};

const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace(/^#/, "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return { r, g, b };
};

export const extractFilePath = (path: string) => path.replace(/\\/g, "/");
