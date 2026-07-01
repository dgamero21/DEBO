"""Abstract base parser for bank-specific PDF parsing.

All bank parsers must inherit from this class and implement
the parse() method.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ParsedStatement:
    """Structured data extracted from a credit card PDF statement."""

    # Card info
    card_type: str  # visa, mastercard, amex
    card_last_four: str
    holder_name: Optional[str] = None

    # Period
    period_from: Optional[str] = None  # YYYY-MM-DD
    period_to: Optional[str] = None  # YYYY-MM-DD
    due_date: Optional[str] = None  # YYYY-MM-DD

    # Amounts (in centavos)
    total_amount: Optional[int] = None
    minimum_payment: Optional[int] = None
    previous_balance: Optional[int] = 0
    payment_received: Optional[int] = 0
    new_charges: Optional[int] = 0
    interest_charges: Optional[int] = 0
    other_charges: Optional[int] = 0

    # Transactions
    transactions: list = field(default_factory=list)

    # Raw
    raw_text: Optional[str] = None


@dataclass
class ParsedTransaction:
    """A single transaction extracted from a statement."""

    description: str
    transaction_date: str  # YYYY-MM-DD
    amount: int  # centavos
    category: Optional[str] = None
    installment_count: int = 1
    installment_number: Optional[int] = None
    installment_total: Optional[int] = None
    raw_line: Optional[str] = None


class BaseParser(ABC):
    """Abstract parser that each bank-specific parser implements."""

    @property
    @abstractmethod
    def bank_slug(self) -> str:
        """Bank identifier: 'galicia', 'nacion', 'macro', etc."""
        ...

    @property
    def parser_version(self) -> str:
        """Parser implementation version for audit trail."""
        return "1.0.0"

    @abstractmethod
    def can_parse(self, text: str) -> bool:
        """Detect if this PDF text belongs to this bank."""
        ...

    @abstractmethod
    def parse(self, text: str) -> ParsedStatement:
        """Parse the full text into structured statement data."""
        ...
