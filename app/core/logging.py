"""
Logging configuration for the application.
"""

import logging
import sys


def setup_logging() -> None:
    """Configure the root logger with INFO level and structured format."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(module)s - %(message)s"
    )
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(handler)
