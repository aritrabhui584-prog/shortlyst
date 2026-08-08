import * as pdfjsLib from 'pdfjs-dist';

// Set up pdfjs worker using jsDelivr CDN matching current installed version
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
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
  } catch (err) {
    console.warn(`PDF.js text extraction failed for ${file.name}, using text stream fallback:`, err);
  }

  // Fallback text reader in case PDF stream fails
  try {
    const rawText = await file.text();
    if (rawText && rawText.length > 50) {
      return rawText.slice(0, 5000);
    }
  } catch (e) {
    // Ignore fallback error
  }

  return `Candidate Resume File: ${file.name}`;
}
