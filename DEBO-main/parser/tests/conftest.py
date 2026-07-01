"""Test configuration and fixtures for Pago Parser Microservice."""

import os
import sys
import pytest

# Ensure parser is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


@pytest.fixture
def sample_pdf_content():
    """Return dummy PDF content for testing."""
    return b"%PDF-1.4 fake pdf content for testing"


# ---------------------------------------------------------------------------
# Sample statement texts
# ---------------------------------------------------------------------------


@pytest.fixture
def sample_galicia_text():
    """Sample text resembling a Banco Galicia statement."""
    return """\
RESUMEN DE TARJETA
Banco Galicia
Visa Galicia - **** **** **** 1234
Periodo: 01/01/2024 al 31/01/2024
Fecha de vencimiento: 15/02/2024
Pago minimo: $ 1.234,56
Pago total: $ 12.345,67
Saldo anterior: $ 5.000,00
Pago recibido: $ 5.000,00
Nuevos consumos: $ 12.345,67

Consumos:
05/01/2024  SUPERMERCADO DIA   $ 1.500,00  1
10/01/2024  NETFLIX SUBSCRIPCION   $ 2.500,00  3/3
15/01/2024  FARMACIA   $ 3.200,00  1
"""


@pytest.fixture
def sample_nacion_text():
    """Sample text resembling a Banco Nación statement."""
    return """\
RESUMEN DE TARJETA DE CREDITO
Banco de la Nación Argentina
Mastercard BNA - **** **** **** 5678
Periodo: 01/02/2024 al 29/02/2024
Vencimiento: 20/03/2024
Pago mínimo: $ 2.100,00
Saldo total: $ 21.000,00
Saldo anterior: $ 8.000,00

Detalle de consumos:
01/02/2024  YPF CARGA COMBUSTIBLE   $ 8.500,00  1
15/02/2024  MUSIMUNDO SUBSCRIPCION   $ 3.500,00  1
20/02/2024  ELECTRODOMESTICOS SA   $ 9.000,00  3/3
"""


@pytest.fixture
def sample_macro_text():
    """Sample text resembling a Banco Macro statement."""
    return """\
RESUMEN DE TARJETA
Banco Macro
Visa Macro - **** **** **** 9012
Periodo: 01/03/2024 al 31/03/2024
Vto: 15/04/2024
Pago minimo: $ 3.500,00
Total a pagar: $ 35.000,00
Saldo anterior: $ 10.000,00
Nuevos consumos: $ 25.000,00

Movimientos:
05/03/2024  COTO COMPRA   $ 12.000,00  1
12/03/2024  DISNEY PLUS   $ 4.500,00  1
25/03/2024  FARMACITY   $ 8.500,00  1
"""


@pytest.fixture
def sample_santander_text():
    """Sample text resembling a Santander Río statement."""
    return """\
RESUMEN DE TARJETA
Santander Río
Mastercard Santander - **** **** **** 3456
Periodo: 01/01/2024 al 31/01/2024
Vencimiento: 10/02/2024
Pago mínimo: $ 4.200,00
Saldo total: $ 42.000,00
Saldo anterior: $ 15.000,00
Pago recibido: $ 15.000,00
Nuevos consumos: $ 42.000,00

Transacciones:
02/01/2024  MERCADO LIBRE   $ 25.000,00  6/6
15/01/2024  STARBUCKS   $ 2.500,00  1
28/01/2024  VIAJES YA   $ 14.500,00  1
"""


@pytest.fixture
def sample_bbva_text():
    """Sample text resembling a BBVA Francés statement."""
    return """\
ESTADO DE CUENTA
BBVA Francés
Visa BBVA - **** **** **** 7890
Periodo: 01/02/2024 al 28/02/2024
Vencimiento: 15/03/2024
Pago mínimo: $ 3.100,00
Total a pagar: $ 31.000,00
Saldo anterior: $ 12.000,00
Pago recibido: $ 12.000,00
Nuevos consumos: $ 31.000,00

Detalle del movimiento:
05/02/2024  NETFLIX   $ 5.000,00  1
14/02/2024  EASY COMPRA   $ 18.000,00  3/3
22/02/2024  McDONALD'S   $ 8.000,00  1
"""
