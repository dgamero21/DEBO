"""Tests for Banco Nación parser."""

import pytest
from app.parsers.nacion import NacionParser
from app.parsers.detector import detect_bank


class TestNacionParser:
    """Test suite for Nación parser."""

    @pytest.fixture
    def parser(self):
        return NacionParser()

    def test_can_parse(self, parser):
        assert parser.can_parse("Banco de la Nación Argentina")
        assert parser.can_parse("BNA tarjetas resumen")

    def test_cannot_parse_other(self, parser):
        assert not parser.can_parse("Banco Galicia resumen")

    def test_detect_bank(self, sample_nacion_text):
        assert detect_bank(sample_nacion_text) == "nacion"

    def test_parse_card_info(self, parser, sample_nacion_text):
        result = parser.parse(sample_nacion_text)
        assert result.card_type == "mastercard"
        assert result.card_last_four == "5678"

    def test_parse_dates(self, parser, sample_nacion_text):
        result = parser.parse(sample_nacion_text)
        assert result.period_from == "2024-02-01"
        assert result.period_to == "2024-02-29"
        assert result.due_date == "2024-03-20"

    def test_parse_amounts(self, parser, sample_nacion_text):
        result = parser.parse(sample_nacion_text)
        assert result.total_amount == 2100000  # $21.000,00
        assert result.minimum_payment == 210000  # $2.100,00
        assert result.previous_balance == 800000  # $8.000,00

    def test_parse_transactions(self, parser, sample_nacion_text):
        result = parser.parse(sample_nacion_text)
        assert len(result.transactions) == 3

        tx1 = result.transactions[0]
        assert tx1.description == "YPF CARGA COMBUSTIBLE"
        assert tx1.transaction_date == "2024-02-01"
        assert tx1.amount == 850000

        tx3 = result.transactions[2]
        assert tx3.description == "ELECTRODOMESTICOS SA"
        assert tx3.installment_count == 3
        assert tx3.installment_number == 3
        assert tx3.installment_total == 3
