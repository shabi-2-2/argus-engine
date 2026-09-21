"""Response schema for the health check endpoint."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Reported on ``GET /health`` to confirm the API is running."""

    status: str
    service: str
    version: str
    environment: str