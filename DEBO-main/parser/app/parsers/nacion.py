"""Banco Nación parser.

Parses Banco de la Nación Argentina credit card statement PDFs.
Typically Mastercard and Visa cards.
"""

import re
import logging
from typing import Optional

from app.parsers.base import BaseParser, ParsedStatement, ParsedTransaction
from app.parsers.utils import parse_amount, parse_date, parse_transaction_line

logger = logging.getLogger(__name__)

PARSER_VERSION = "1.0.0"


class NacionParser(BaseParser):
    """Parser for Banco Nación credit card statements."""

    @property
    def bank_slug(self) -> str:
        return "nacion"

    @property
    def parser_version(self) -> str:
        return PARSER_VERSION

    def can_parse(self, text: str) -> bool:
        return bool(re.search(r"naci[oó]n|bna\s+tarjetas|banco\s+de\s+la\s+naci[oó]n", text, re.IGNORECASE))

    def _extract_card_info(self, text: str) -> tuple[str, str, Optional[str]]:
        card_type = "mastercard"
        card_last_four = "0000"
        holder_name = None

        if re.search(r"visa", text, re.IGNORECASE):
            card_type = "visa"
        elif re.search(r"american\s*express|amex", text, re.IGNORECASE):
            card_type = "amex"

        # Card number: "**** **** **** 1234" or "XXXX XXXX XXXX 1234"
        m = re.search(r"(?:\*{4}|\.{4}|X{4})\s*(?:\*{4}|\.{4}|X{4})\s*(?:\*{4}|\.{4}|X{4})\s*(\d{4})", text)
        if m:
            card_last_four = m.group(1)

        # Titular
        m = re.search(r"(?:titular|holder|nombre|cliente)[:\s]*([A-ZÁÉÍÓÚÜÑ\s]{3,60})(?:\n|$)", text, re.IGNORECASE)
        if m:
            holder_name = m.group(1).strip()

        return card_type, card_last_four, holder_name

    def _extract_dates(self, text: str) -> tuple[Optional[str], Optional[str], Optional[str]]:
        period_from = None
        period_to = None
        due_date = None

        # Período
        m = re.search(
            r"(?:per[ií]odo|periodo|desde)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4})"
            r"(?:\s*(?:al|a|hasta|[-])\s*)(\d{1,2}[/-]\d{1,2}[/-]\d{4})",
            text, re.IGNORECASE,
        )
        if m:
            period_from = parse_date(m.group(1))
            period_to = parse_date(m.group(2))

        # Vencimiento / vto
        m = re.search(
            r"(?:vencimiento|due\s*date|vto)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4})",
            text, re.IGNORECASE,
        )
        if m:
            due_date = parse_date(m.group(1))

        return period_from, period_to, due_date

    def _extract_amounts(self, text: str) -> dict:
        amounts = {
            "total_amount": None,
            "minimum_payment": None,
            "previous_balance": 0,
            "payment_received": 0,
            "new_charges": 0,
            "interest_charges": 0,
            "other_charges": 0,
        }

        # Total / saldo
        m = re.search(
            r"(?:total\s*a\s*pagar|saldo\s*total|pago\s*total)[:\s]*\$?\s*([\d.,\s]+)",
            text, re.IGNORECASE,
        )
        if m:
            amounts["total_amount"] = parse_amount(m.group(1))

        # Pago mínimo
        m = re.search(
            r"(?:pago\s*m[ií]nimo|pago\s*m[ií]n\.?|m[ií]nimo)[:\s]*\$?\s*([\d.,\s]+)",
            text, re.IGNORECASE,
        )
        if m:
            amounts["minimum_payment"] = parse_amount(m.group(1))

        # Saldo anterior
        m = re.search(
            r"(?:saldo\s*anterior|saldo\s*ant\.?)[:\s]*\$?\s*([\d.,\s]+)",
            text, re.IGNORECASE,
        )
        if m:
            amounts["previous_balance"] = parse_amount(m.group(1))

        return amounts

    def _extract_transactions(self, text: str) -> list[ParsedTransaction]:
        transactions: list[ParsedTransaction] = []
        tx_section = self._find_transaction_section(text)
        if not tx_section:
            return transactions

        for line in tx_section.split("\n"):
            tx = parse_transaction_line(line)
            if tx:
                transactions.append(tx)

        logger.info(f"Extracted {len(transactions)} transactions from Nación statement")
        return transactions

    def _find_transaction_section(self, text: str) -> Optional[str]:
        markers = [
            r"detalle\s*de\s*consumos[:\s]*\n",
            r"consumos[:\s]*\n",
            r"movimientos[:\s]*\n",
            r"transacciones[:\s]*\n",
            r"detalle\s*del\s*movimiento[:\s]*\n",
        ]
        start = None
        for marker in markers:
            m = re.search(marker, text, re.IGNORECASE | re.MULTILINE)
            if m:
                start = m.end()
                break
        if start is None:
            return None

        section = text[start:]
        footer_markers = [
            r"\n\s*(?:totales|resumen|totales\s*del\s*per[ií]odo)",
        ]
        end = len(section)
        for marker in footer_markers:
            m = re.search(marker, section, re.IGNORECASE)
            if m:
                end = min(end, m.start())
        return section[:end]

    def _parse_transaction_line(self, line: str) -> Optional[ParsedTransaction]:
        return parse_transaction_line(line)

    def parse(self, text: str) -> ParsedStatement:
        """Parse Nación statement text into structured data."""
        logger.info("Parsing Banco Nación statement...")

        card_type, card_last_four, holder_name = self._extract_card_info(text)
        period_from, period_to, due_date = self._extract_dates(text)
        amounts = self._extract_amounts(text)
        transactions = self._extract_transactions(text)

        return ParsedStatement(
            card_type=card_type,
            card_last_four=card_last_four,
            holder_name=holder_name,
            period_from=period_from,
            period_to=period_to,
            due_date=due_date,
            total_amount=amounts["total_amount"],
            minimum_payment=amounts["minimum_payment"],
            previous_balance=amounts["previous_balance"],
            payment_received=amounts["payment_received"],
            new_charges=amounts["new_charges"],
            interest_charges=amounts["interest_charges"],
            other_charges=amounts["other_charges"],
            transactions=transactions,
            raw_text=text,
        )


# Register the parser
from app.parsers.registry import register_parser
register_parser(NacionParser())
