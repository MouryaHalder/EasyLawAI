import { analyzeLegalDocument } from "../services/openaiService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Required for ES Modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix 1: Provide standardFontDataUrl to prevent UnknownErrorException
const STANDARD_FONT_DATA_URL = path.join(
  __dirname,
  "../../node_modules/pdfjs-dist/standard_fonts"
) + "/";

export const uploadFile = async (req, res) => {
  // ✅ Fix 2: Check if a file was actually uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const pdfPath = req.file.path;

  try {
    // ✅ Fix 3: Check if the file exists before reading
    if (!fs.existsSync(pdfPath)) {
      return res.status(400).json({ message: "Uploaded file not found on server." });
    }

    const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));

    // ✅ Fix 4: Pass standardFontDataUrl — this fixes the UnknownErrorException
    const pdf = await pdfjsLib.getDocument({
      data: dataBuffer,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
    }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // ✅ Fix 5: Add space between pages so text doesn't merge together
      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");

      extractedText += pageText + "\n";
    }

    // ✅ Fix 6: Guard against empty PDFs (scanned/image-only PDFs)
    if (!extractedText.trim()) {
      return res.status(422).json({
        message: "Could not extract text from PDF. It may be a scanned or image-only document.",
      });
    }

    const aiResult = await analyzeLegalDocument(extractedText);

    res.status(200).json({
      message: "PDF processed successfully",
      result: aiResult,
    });

  } catch (error) {
    console.error("uploadFile error:", error);
    res.status(500).json({
      message: "PDF processing failed",
      error: error.message,
    });

  } finally {
    // ✅ Fix 7: Always delete the uploaded temp file after processing
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
};