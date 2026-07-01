"""Tests for Banco Macro parser."""

import pytest
from app.parsers.macro import MacroParser
from app.parsers.detector import detect_bank


class TestMacroParser:
    """Test suite for Macro parser."""

    @pytest.fixture
    def parser(self):
        return MacroParser()

    def test_can_parse(self, parser):
        assert parser.can_parse("Banco Macro resumen de tarjeta")

    def test_cannot_parse_other(self, parser):
        assert not parser.can_parse("Banco Nación resumen")

    def test_detect_bank(self, sample_macro_text):
        assert detect_bank(sample_macro_text) == "macro"

    def test_parse_card_info(self, parser, sample_macro_text):
        result = parser.parse(sample_macro_text)
        assert result.card_type == "visa"
        assert result.card_last_four == "9012"

    def test_parse_dates(self, parser, sample_macro_text):
        result = parser.parse(sample_macro_text)
        assert result.period_from == "2024-03-01"
        assert result.period_to == "2024-03-31"
        assert result.due_date == "2024-04-15"

    def test_parse_amounts(self, parser, sample_macro_text):
        result = parser.parse(sample_macro_text)
        assert result.total_amount == 3500000  # $35.000,00
        assert result.minimum_payment == 350000  # $3.500,00
        assert result.previous_balance == 1000000  # $10.000,00
        assert result.new_charges == 2500000  # $25.000,00

    def test_parse_transactions(self, parser, sample_macro_text):
        result = parser.parse(sample_macro_text)
        assert len(result.transactions) == 3

        tx1 = result.transactions[0]
        assert tx1.description == "COTO COMPRA"
        assert tx1.transaction_date == "2024-03-05"
        assert tx1.amount == 1200000
