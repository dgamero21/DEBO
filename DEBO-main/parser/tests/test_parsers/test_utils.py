"""Tests for parser utility functions."""

import pytest
from app.parsers.utils import parse_amount, parse_date


class TestParseAmount:
    """Test parse_amount with Argentine currency formats."""

    def test_simple_pesos(self):
        assert parse_amount("$ 1.234,56") == 123456

    def test_no_currency_symbol(self):
        assert parse_amount("1.234,56") == 123456

    def test_no_whitespace(self):
        assert parse_amount("$1.234,56") == 123456

    def test_large_amount(self):
        assert parse_amount("$ 12.345,67") == 1234567

    def test_whole_pesos(self):
        assert parse_amount("$ 5.000") == 500000

    def test_no_thousands_separator(self):
        assert parse_amount("$ 1234,56") == 123456

    def test_minimum_payment(self):
        assert parse_amount("$ 1.234,56") == 123456

    def test_zero(self):
        assert parse_amount("$ 0,00") == 0

    def test_empty_string(self):
        assert parse_amount("") == 0

    def test_none_string(self):
        assert parse_amount("  ") == 0

    def test_negative_amount_with_sign(self):
        assert parse_amount("-$ 1.000,00") == -100000

    def test_us_format_comma_thousands(self):
        # This is NOT Argentine format but defensive
        result = parse_amount("$1,234.56")
        assert result == 123456

    def test_whole_number_no_separator(self):
        assert parse_amount("5000") == 500000

    def test_amount_with_usd(self):
        assert parse_amount("USD 1.500,00") == 150000

    def test_decimal_with_one_digit(self):
        assert parse_amount("$ 1.234,5") == 123450


class TestParseDate:
    """Test parse_date with various formats."""

    def test_dd_mm_yyyy_slashes(self):
        assert parse_date("01/01/2024") == "2024-01-01"

    def test_dd_mm_yyyy_dashes(self):
        assert parse_date("31-12-2024") == "2024-12-31"

    def test_single_digit_day_month(self):
        # DD/MM/YYYY -> 1 Feb 2024
        assert parse_date("1/2/2024") == "2024-02-01"

    def test_iso_format_passthrough(self):
        assert parse_date("2024-01-15") == "2024-01-15"

    def test_empty_string(self):
        assert parse_date("") is None

    def test_none_string(self):
        assert parse_date("  ") is None
