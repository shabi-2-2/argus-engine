"""Domain models for the ARGUS backend.

System-wide schemas live here; agent-specific, API request/response, and
database models will be added in later phases.
"""

from app.models.health import HealthResponse

__all__ = ["HealthResponse"]