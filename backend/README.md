# ARGUS Backend — FastAPI

Python 3.11+ · FastAPI · Pydantic · uv

## Local development

```bash
uv sync            # install dependencies into .venv
uv run uvicorn app.main:app --reload   # start API on http://localhost:8000
```

## Health check

```
GET http://localhost:8000/health
```

## Module layout

| Module            | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| `api/`            | HTTP routes and dependency wiring                |
| `agents/`         | LangGraph orchestration agents (Phase 02+)       |
| `tools/`          | Tool abstraction: Agent → Tool → External service |
| `services/`       | Investigation, evidence, and project services     |
| `workflows/`      | LangGraph state graphs (Phase 02+)               |
| `models/`         | Pydantic domain models                            |
| `core/`           | Configuration and logging                         |