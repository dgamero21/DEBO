"""OCR text extraction from PDFs.

Primary: olmOCR API (remote)
Fallback: pdfplumber (local, no GPU needed)
"""

import logging
from typing import Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def extract_text_olmocr(content: bytes, filename: str = "") -> Optional[str]:
    """Extract text from PDF using remote olmOCR API.

    Uses the olmOCR server endpoint configured in settings.
    Sends PDF bytes via multipart upload and receives extracted text.

    Args:
        content: Raw PDF bytes.
        filename: Original filename for debugging / content-type.

    Returns:
        Extracted text or None if API unavailable or fails.
    """
    api_url = settings.olmocr_api_url.rstrip("/")
    endpoint = f"{api_url}/process"

    try:
        with httpx.Client(timeout=300.0) as client:
            files = {
                "file": (filename or "statement.pdf", content, "application/pdf"),
            }
            response = client.post(endpoint, files=files)

            if response.status_code == 200:
                data = response.json()
                return data.get("text")
            else:
                logger.warning(
                    f"olmOCR API responded with {response.status_code}: "
                    f"{response.text[:300]}"
                )
                return None
    except httpx.TimeoutException:
        logger.error(f"olmOCR API timeout processing {filename or 'unknown'}")
        return None
    except httpx.RequestError as e:
        logger.error(f"olmOCR API request failed: {e}")
        return None
    except Exception as e:
        logger.error(f"olmOCR extraction error: {e}")
        return None


def extract_text_pdfplumber(content: bytes) -> Optional[str]:
    """Extract text from PDF using pdfplumber (local fallback).

    Args:
        content: Raw PDF bytes.

    Returns:
        Extracted text or None on failure.
    """
    try:
        import pdfplumber
        import io
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text_parts = []
            for page_num, page in enumerate(pdf.pages, 1):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_parts.append(f"--- Página {page_num} ---\n{page_text}")
            return "\n\n".join(text_parts) if text_parts else None
    except ImportError:
        logger.error("pdfplumber is not installed")
        return None
    except Exception as e:
        logger.error(f"pdfplumber extraction failed: {e}")
        return None


def extract_text(content: bytes, filename: str = "") -> Optional[str]:
    """Extract text from PDF using best available method.

    Tries olmOCR API first, falls back to pdfplumber.

    Args:
        content: Raw PDF bytes.
        filename: Original filename for debugging.

    Returns:
        Extracted text or None if both methods fail.
    """
    # Try olmOCR first (remote API)
    text = extract_text_olmocr(content, filename=filename)
    if text and text.strip():
        logger.info("Text extracted via olmOCR API")
        return text

    # Fallback to pdfplumber (local, no GPU needed)
    text = extract_text_pdfplumber(content)
    if text and text.strip():
        logger.info("Text extracted via pdfplumber (fallback)")
        return text

    logger.error("All OCR methods failed to extract text")
    return None
