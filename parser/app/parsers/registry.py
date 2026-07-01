"""Parser registry - auto-discovers and registers bank parsers."""

import logging
from typing import Optional

from app.parsers.base import BaseParser

logger = logging.getLogger(__name__)

_registry: dict[str, BaseParser] = {}


def register_parser(parser: BaseParser):
    """Register a parser in the global registry."""
    _registry[parser.bank_slug] = parser
    logger.debug(f"Parser registered: {parser.bank_slug}")


def get_parser(bank_slug: str) -> Optional[BaseParser]:
    """Get a parser by bank slug."""
    return _registry.get(bank_slug)


def detect_bank(text: str) -> Optional[str]:
    """Detect which bank's parser can handle this text."""
    for slug, parser in _registry.items():
        if parser.can_parse(text):
            logger.info(f"Bank detected: {slug}")
            return slug
    logger.warning("No parser found for the given text")
    return None


def list_parsers() -> list[str]:
    """List all registered parser slugs."""
    return list(_registry.keys())
