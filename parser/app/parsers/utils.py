"""Utility functions for PDF parsing.

Common helpers used by all bank parsers:
- parse_amount: Convert Argentine-formatted currency to centavos
- parse_date: Convert DD/MM/YYYY to YYYY-MM-DD
"""

import re
from typing import Optional


def parse_amount(text: str) -> int:
    """Parse Argentine-formatted amount string to centavos (integer).

    Handles formats:
      - "$ 1.234,56"  -> 123456
      - "$1.234,56"   -> 123456
      - "1.234,56"    -> 123456
      - "$ 12.345"    -> 1234500  (whole pesos, assumes 00 centavos)
      - "-$ 1.234,56" -> -123456

    Args:
        text: Amount string as it appears in a PDF statement.

    Returns:
        Amount in centavos (e.g. 123456 = $1,234.56). Always returns
        an integer; returns 0 if the text cannot be parsed.
    """
    if not text or not text.strip():
        return 0

    cleaned = text.strip()

    # Detect negative
    negative = False
    if cleaned.startswith("-"):
        negative = True
        cleaned = cleaned.lstrip("-").strip()

    # Remove currency symbols and whitespace
    cleaned = cleaned.replace("$", "").replace("USD", "").replace("ARS", "").strip()

    # Remove parentheses indicating negative (e.g. "(1.234,56)")
    if cleaned.startswith("(") and cleaned.endswith(")"):
        negative = True
        cleaned = cleaned[1:-1].strip()

    if not cleaned:
        return 0

    # Handle different decimal separator conventions
    # Argentine format: 1.234,56 (dot = thousands, comma = decimal)
    # US format: 1,234.56 (comma = thousands, dot = decimal)

    has_comma = "," in cleaned
    has_dot = "." in cleaned

    if has_comma and has_dot:
        # Check which is the decimal separator
        # If comma is followed by exactly 1-2 digits at end -> comma is decimal
        if re.search(r",\d{1,2}$", cleaned):
            # Argentine format: 1.234,56
            integer_part = cleaned.split(",")[0].replace(".", "")
            decimal_part = cleaned.split(",")[1].ljust(2, "0")[:2]
            centavos = int(integer_part) * 100 + int(decimal_part)
        elif re.search(r"\.\d{2}$", cleaned):
            # US format: 1,234.56
            integer_part = cleaned.split(".")[0].replace(",", "")
            decimal_part = cleaned.split(".")[1].ljust(2, "0")[:2]
            centavos = int(integer_part) * 100 + int(decimal_part)
        else:
            # Ambiguous — try removing all thousand separators
            integer_part = cleaned.replace(",", "").replace(".", "")
            centavos = int(integer_part) * 100 if integer_part.isdigit() else 0
    elif has_comma and not has_dot:
        # Comma only: could be "1,50" (1.50) or "1,234" (1234)
        # If 1-2 digits after comma -> decimal, otherwise thousand sep
        if re.search(r",\d{1,2}$", cleaned):
            integer_part = cleaned.split(",")[0]
            decimal_part = cleaned.split(",")[1].ljust(2, "0")[:2]
            centavos = int(integer_part) * 100 + int(decimal_part)
        else:
            integer_part = cleaned.replace(",", "")
            centavos = int(integer_part) * 100 if integer_part.isdigit() else 0
    elif has_dot and not has_comma:
        # Dot only: could be "1.50" (1.50) or "1.234" (1234)
        # If 1-2 digits after dot -> decimal, otherwise thousand sep
        if re.search(r"\.\d{1,2}$", cleaned):
            parts = cleaned.split(".")
            integer_part = parts[0]
            decimal_part = parts[1].ljust(2, "0")[:2]
            centavos = int(integer_part) * 100 + int(decimal_part)
        else:
            integer_part = cleaned.replace(".", "")
            centavos = int(integer_part) * 100 if integer_part.isdigit() else 0
    else:
        # No separators — plain integer, assume pesos
        if cleaned.isdigit():
            centavos = int(cleaned) * 100
        else:
            centavos = 0

    return -centavos if negative else centavos


def parse_date(date_str: str, fmt: str = "DD/MM/YYYY") -> Optional[str]:
    """Parse a date string to ISO format YYYY-MM-DD.

    Supports:
      - DD/MM/YYYY -> YYYY-MM-DD
      - DD-MM-YYYY -> YYYY-MM-DD
      - YYYY-MM-DD  -> YYYY-MM-DD (passthrough)

    Args:
        date_str: Date string in common formats.
        fmt: Input format hint.

    Returns:
        ISO date string or None if unparseable.
    """
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()

    # Already ISO
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        return date_str

    # DD/MM/YYYY or DD-MM-YYYY
    m = re.match(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})$", date_str)
    if m:
        day, month, year = m.groups()
        return f"{year}-{int(month):02d}-{int(day):02d}"

    return None


def parse_transaction_line(line: str) -> Optional["ParsedTransaction"]:
    """Parse a single transaction line from a bank statement.

    Common format across Argentine bank statements:
      DD/MM/YYYY  DESCRIPTION   $ AMOUNT  [INSTALLMENTS]

    Installments can be:
      - "1"       (single payment)
      - "3/3"     (installment 3 of 3)
      - "01/12"   (installment 1 of 12)

    Args:
        line: A single line of text from the transaction section.

    Returns:
        ParsedTransaction or None if the line is not a transaction.
    """
    from app.parsers.base import ParsedTransaction

    line = line.strip()
    if not line:
        return None

    # Must start with a date
    m = re.match(r"(\d{2}/\d{2}/\d{4})\s+(.+)$", line)
    if not m:
        return None

    date_str = m.group(1)
    rest = m.group(2).strip()

    # Step 1: extract trailing installments (e.g., "1", "3/3", "01/12")
    installments = 1
    installment_num = None
    installment_total = None

    inst_match = re.search(r"(\d+)\s*/\s*(\d+)\s*$", rest)
    if inst_match:
        installment_num = int(inst_match.group(1))
        installment_total = int(inst_match.group(2))
        installments = installment_total
        rest = rest[: inst_match.start()].strip()
    else:
        # Maybe a single digit for 1 installment?
        single_match = re.search(r"\s+(\d+)\s*$", rest)
        if single_match:
            installments = int(single_match.group(1))
            rest = rest[: single_match.start()].strip()

    # Step 2: extract amount at the end (after description)
    # Amount formats: "$ 1.500,00", "$1.500,00", "1.500,00"
    amount_match = re.search(r"\$?\s*([\d.,]+)\s*$", rest)
    if not amount_match:
        return None

    amount_str = amount_match.group(1)
    description = rest[: amount_match.start()].strip()

    # Clean up description
    description = re.sub(r"\s+", " ", description).strip()

    iso_date = parse_date(date_str)
    if not iso_date:
        return None

    amount = parse_amount(amount_str)
    if amount == 0 and not description:
        return None

    return ParsedTransaction(
        description=description,
        transaction_date=iso_date,
        amount=amount,
        installment_count=installments,
        installment_number=installment_num,
        installment_total=installment_total,
        raw_line=line,
    )



