"""Tests for Santander parser."""

import pytest
from app.parsers.santander import SantanderParser
from app.parsers.detector import detect_bank


class TestSantanderParser:
    """Test suite for Santander parser."""

    @pytest.fixture
    def parser(self):
        return SantanderParser()

    def test_can_parse(self, parser):
        assert parser.can_parse("Santander Río resumen de tarjeta")
        assert parser.can_parse("Banco Santander")

    def test_cannot_parse_other(self, parser):
        assert not parser.can_parse("Banco Galicia resumen")

    def test_detect_bank(self, sample_santander_text):
        assert detect_bank(sample_santander_text) == "santander"

    def test_parse_card_info(self, parser, sample_santander_text):
        result = parser.parse(sample_santander_text)
        assert result.card_type == "mastercard"
        assert result.card_last_four == "3456"

    def test_parse_dates(self, parser, sample_santander_text):
        result = parser.parse(sample_santander_text)
        assert result.period_from == "2024-01-01"
        assert result.period_to == "2024-01-31"
        assert result.due_date == "2024-02-10"

    def test_parse_amounts(self, parser, sample_santander_text):
        result = parser.parse(sample_santander_text)
        assert result.total_amount == 4200000  # $42.000,00
        assert result.minimum_payment == 420000  # $4.200,00
        assert result.previous_balance == 1500000  # $15.000,00
        assert result.payment_received == 1500000  # $15.000,00
        assert result.new_charges == 4200000  # $42.000,00

    def test_parse_transactions(self, parser, sample_santander_text):
        result = parser.parse(sample_santander_text)
        assert len(result.transactions) == 3

        tx1 = result.transactions[0]
        assert tx1.description == "MERCADO LIBRE"
        assert tx1.transaction_date == "2024-01-02"
        assert tx1.amount == 2500000
        assert tx1.installment_count == 6
        assert tx1.installment_number == 6
        assert tx1.installment_total == 6

        tx2 = result.transactions[1]
        assert tx2.description == "STARBUCKS"
        assert tx2.transaction_date == "2024-01-15"
        assert tx2.amount == 250000
