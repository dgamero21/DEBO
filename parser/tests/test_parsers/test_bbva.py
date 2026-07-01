"""Tests for BBVA parser."""

import pytest
from app.parsers.bbva import BbvaParser
from app.parsers.detector import detect_bank


class TestBbvaParser:
    """Test suite for BBVA parser."""

    @pytest.fixture
    def parser(self):
        return BbvaParser()

    def test_can_parse(self, parser):
        assert parser.can_parse("BBVA Francés resumen")
        assert parser.can_parse("Banco BBVA")

    def test_cannot_parse_other(self, parser):
        assert not parser.can_parse("Banco Galicia resumen")

    def test_detect_bank(self, sample_bbva_text):
        assert detect_bank(sample_bbva_text) == "bbva"

    def test_parse_card_info(self, parser, sample_bbva_text):
        result = parser.parse(sample_bbva_text)
        assert result.card_type == "visa"
        assert result.card_last_four == "7890"

    def test_parse_dates(self, parser, sample_bbva_text):
        result = parser.parse(sample_bbva_text)
        assert result.period_from == "2024-02-01"
        assert result.period_to == "2024-02-28"
        assert result.due_date == "2024-03-15"

    def test_parse_amounts(self, parser, sample_bbva_text):
        result = parser.parse(sample_bbva_text)
        assert result.total_amount == 3100000  # $31.000,00
        assert result.minimum_payment == 310000  # $3.100,00
        assert result.previous_balance == 1200000  # $12.000,00
        assert result.payment_received == 1200000  # $12.000,00
        assert result.new_charges == 3100000  # $31.000,00

    def test_parse_transactions(self, parser, sample_bbva_text):
        result = parser.parse(sample_bbva_text)
        assert len(result.transactions) == 3

        tx1 = result.transactions[0]
        assert tx1.description == "NETFLIX"
        assert tx1.transaction_date == "2024-02-05"
        assert tx1.amount == 500000

        tx2 = result.transactions[1]
        assert tx2.description == "EASY COMPRA"
        assert tx2.transaction_date == "2024-02-14"
        assert tx2.amount == 1800000
        assert tx2.installment_count == 3
        assert tx2.installment_number == 3
        assert tx2.installment_total == 3
