import { describe, it, expect, vi } from 'vitest';

// Mock pdfjs-dist BEFORE importing the module that uses it to prevent ReferenceErrors in Node.js
vi.mock('pdfjs-dist', () => {
  return {
    GlobalWorkerOptions: {
      workerSrc: ''
    },
    getDocument: vi.fn()
  };
});

// Now import extractPdfText
import { extractPdfText } from './pdfExtract';

describe('extractPdfText client-side extraction fallback tests', () => {
  it('should return empty string if file argument is null or undefined', async () => {
    const res = await extractPdfText(null);
    expect(res).toBe('');
  });

  it('should fallback to default file label on empty mock file content stream', async () => {
    const mockFile = {
      name: 'empty_resume.pdf',
      arrayBuffer: async () => new ArrayBuffer(0),
      text: async () => ''
    };

    const res = await extractPdfText(mockFile);
    expect(res).toBe('Candidate Resume File: empty_resume.pdf');
  });

  it('should utilize standard file.text() stream fallback if PDF.js engine arrayBuffer throws', async () => {
    const mockFile = {
      name: 'extracted_resume.txt',
      arrayBuffer: async () => { throw new Error('PDF JS engine mock exception.'); },
      text: async () => 'Parsed Resume Text mock content from text stream. This is a longer string that has more than fifty characters.'
    };

    const res = await extractPdfText(mockFile);
    expect(res).toBe('Parsed Resume Text mock content from text stream. This is a longer string that has more than fifty characters.');
  });
});
