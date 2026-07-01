"""Tests for Banco Galicia parser."""

import pytest
from app.parsers.galicia import GaliciaParser
from app.parsers.detector import detect_bank


class TestGaliciaParser:
    """Test suite for Galicia parser."""

    @pytest.fixture
    def parser(self):
        return GaliciaParser()

    def test_can_parse(self, parser, sample_galicia_text):
        assert parser.can_parse(sample_galicia_text)

    def test_cannot_parse_other(self, parser):
        assert not parser.can_parse("Banco Macro resumen")

    def test_detect_bank(self, sample_galicia_text):
        assert detect_bank(sample_galicia_text) == "galicia"

    def test_parse_card_info(self, parser, sample_galicia_text):
        result = parser.parse(sample_galicia_text)
        assert result.card_type == "visa"
        assert result.card_last_four == "1234"

    def test_parse_dates(self, parser, sample_galicia_text):
        result = parser.parse(sample_galicia_text)
        assert result.period_from == "2024-01-01"
        assert result.period_to == "2024-01-31"
        assert result.due_date == "2024-02-15"

    def test_parse_amounts(self, parser, sample_galicia_text):
        result = parser.parse(sample_galicia_text)
        assert result.total_amount == 1234567  # $12.345,67
        assert result.minimum_payment == 123456  # $1.234,56
        assert result.previous_balance == 500000  # $5.000,00
        assert result.payment_received == 500000  # $5.000,00
        assert result.new_charges == 1234567  # $12.345,67

    def test_parse_transactions(self, parser, sample_galicia_text):
        result = parser.parse(sample_galicia_text)
        assert len(result.transactions) == 3

        tx1 = result.transactions[0]
        assert tx1.description == "SUPERMERCADO DIA"
        assert tx1.transaction_date == "2024-01-05"
        assert tx1.amount == 150000
        assert tx1.installment_count == 1

        tx2 = result.transactions[1]
        assert tx2.description == "NETFLIX SUBSCRIPCION"
        assert tx2.transaction_date == "2024-01-10"
        assert tx2.amount == 250000
        assert tx2.installment_count == 3
        assert tx2.installment_number == 3
        assert tx2.installment_total == 3

        tx3 = result.transactions[2]
        assert tx3.description == "FARMACIA"
        assert tx3.transaction_date == "2024-01-15"
        assert tx3.amount == 320000

    def test_parse_raw_text_preserved(self, parser, sample_galicia_text):
        result = parser.parse(sample_galicia_text)
        assert result.raw_text == sample_galicia_text
