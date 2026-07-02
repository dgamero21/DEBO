/**
 * Extract all text content from a PDF file using pdfjs-dist.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');

  // Configure worker
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

/**
 * Detect bank slug from raw text content.
 * Returns null if no known bank is found.
 */
export function detectBankSlug(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('galicia')) return 'galicia';
  if (lower.includes('santander')) return 'santander';
  if (lower.includes('macro') || lower.includes('american express')) return 'macro';
  if (lower.includes('naranja')) return 'naranja';
  if (lower.includes('nacion') || lower.includes('nación')) return 'nacion';
  if (lower.includes('bbva')) return 'bbva';
  return null;
}

/**
 * Generate a SHA-256 hash from text for duplicate detection.
 */
export async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
