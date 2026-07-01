"""Bank-specific PDF parsers for credit card statements.

Each parser auto-registers via import. Import this package
to ensure all parsers are loaded:
    import app.parsers  # registers all parsers

Available parsers:
    - GaliciaParser (galicia)
    - NacionParser (nacion)
    - MacroParser (macro)
    - SantanderParser (santander)
    - BbvaParser (bbva)
"""

from app.parsers.galicia import GaliciaParser
from app.parsers.nacion import NacionParser
from app.parsers.macro import MacroParser
from app.parsers.santander import SantanderParser
from app.parsers.bbva import BbvaParser
from app.parsers.base import BaseParser, ParsedStatement, ParsedTransaction
from app.parsers.detector import detect_bank, detect_all_banks
from app.parsers.registry import get_parser, list_parsers
from app.parsers.ocr import extract_text
from app.parsers.utils import parse_amount, parse_date

__all__ = [
    "GaliciaParser",
    "NacionParser",
    "MacroParser",
    "SantanderParser",
    "BbvaParser",
    "BaseParser",
    "ParsedStatement",
    "ParsedTransaction",
    "detect_bank",
    "detect_all_banks",
    "get_parser",
    "list_parsers",
    "extract_text",
    "parse_amount",
    "parse_date",
]
