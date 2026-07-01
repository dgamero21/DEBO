"""Bank detection from PDF text.

Identifies which bank issued the credit card based on
text patterns in the PDF. Uses both the detector's own
regex patterns and the registered parsers' can_parse().
"""

import re
from typing import Optional


# Patterns for bank detection (used by detect_bank standalone function)
BANK_PATTERNS: dict[str, list[str]] = {
    "galicia": [
        r"galicia",
        r"banco\s+galicia",
        r"resumen\s+de\s+galicia",
    ],
    "nacion": [
        r"banco\s+de\s+la\s+naci[oó]n",
        r"banco\s+naci[oó]n",
        r"bna\s+tarjetas",
        r"bna\s+.*tarjeta",
    ],
    "macro": [
        r"banco\s+macro",
        r"macro\s+.*tarjeta",
        r"resumen\s+macro",
    ],
    "santander": [
        r"santander",
        r"banco\s+santander",
        r"santander\s+r[ií]o",
        r"supervielle",  # Santander absorbed Supervielle
    ],
    "bbva": [
        r"bbva",
        r"bbva\s+franc[ée]s",
        r"banco\s+bbva",
        r"franc[ée]s\s+.*bbva",
    ],
    "provincia": [
        r"banco\s+(de\s+la\s+)?provincia",
        r"bapro",
        r"banco\s+provincia",
    ],
    "ciudad": [
        r"banco\s+ciudad",
        r"banco\s+de\s+la\s+ciudad",
    ],
    "hipotecario": [
        r"banco\s+hipotecario",
        r"hipotecario",
    ],
    "patagonia": [
        r"banco\s+patagonia",
        r"patagonia",
    ],
    "columbia": [
        r"banco\s+columbia",
        r"columbia",
    ],
}


def detect_bank(text: str) -> Optional[str]:
    """Detect bank from text content using regex patterns.

    Runs pattern matching on the lowercased text against
    all known bank patterns.

    Args:
        text: Full text extracted from PDF.

    Returns:
        Bank slug if detected, None otherwise.
    """
    if not text or not text.strip():
        return None

    text_lower = text.lower()

    matched: list[tuple[int, str]] = []
    for bank_slug, patterns in BANK_PATTERNS.items():
        for pattern in patterns:
            m = re.search(pattern, text_lower)
            if m:
                # Score by position: earlier match = more reliable
                score = m.start()
                matched.append((score, bank_slug))
                break  # One match per bank is enough

    if not matched:
        return None

    # Return the bank slug with the earliest match (most reliable)
    matched.sort(key=lambda x: x[0])
    return matched[0][1]


def detect_all_banks(text: str) -> list[str]:
    """Detect all banks that match in the text.

    Useful when the text might contain multiple bank references.

    Args:
        text: Full text extracted from PDF.

    Returns:
        List of matching bank slugs, ordered by appearance.
    """
    if not text or not text.strip():
        return []

    text_lower = text.lower()
    found: list[str] = []

    for bank_slug, patterns in BANK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                found.append(bank_slug)
                break

    return found
