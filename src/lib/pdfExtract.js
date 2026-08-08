/**
 * pdfExtract.js — Client-side PDF text extraction
 *
 * Uses Mozilla's PDF.js library to extract raw text content from PDF files
 * directly in the browser. This avoids sending large binary files to the
 * server — only the extracted text is transmitted to the Gemini API endpoint.
 */

import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '6.2.108'}/build/pdf.worker.min.mjs`;
}

/**
 * Extracts plain text content from a PDF File object in the browser.
 * @param {File} file - PDF file object
 * @returns {Promise<string>} Extracted text string from all pages
 */
export async function extractPdfText(file) {
  if (!file) return '';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageItems = textContent.items.map((item) => item.str);
      const pageText = pageItems.join(' ');
      fullText += `[Page ${i}]\n${pageText}\n\n`;
    }

    const trimmed = fullText.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  } catch (_err) {
    // PDF.js extraction failed — fall through to text stream fallback
  }

  // Fallback text reader in case PDF stream fails
  try {
    const rawText = await file.text();
    if (rawText && rawText.length > 50) {
      return rawText.slice(0, 5000);
    }
  } catch (_e) {
    // Ignore fallback error
  }

  return `Candidate Resume File: ${file.name}`;
}
