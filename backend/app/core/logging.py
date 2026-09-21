"""Logging configuration for the ARGUS backend."""

import logging
import sys

from app.core.config import Settings


def configure_logging(settings: Settings) -> None:
    """Configure root logging for the application.

    Idempotent: re-running after configuration does not duplicate handlers.
    """
    root = logging.getLogger()
    if any(isinstance(h, logging.StreamHandler) for h in root.handlers):
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s %(levelname)s [%(name)s] %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )
    )
    root.addHandler(handler)
    root.setLevel(settings.log_level.upper())