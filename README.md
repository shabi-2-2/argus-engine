# ARGUS

**Autonomous Investigation & Root-Cause Intelligence**

> **Give ARGUS a problem. It investigates.**

ARGUS is an agentic AI platform that connects to a user's software project —
primarily through GitHub — understands the codebase and available system
evidence, and autonomously investigates technical problems.

The system is **evidence-driven**: agents gather and correlate evidence rather
than simply generate an answer. A critic/reasoning loop challenges every
initial hypothesis before ARGUS produces a final investigation report.

## Core philosophy

- **Evidence-driven, not answer-driven.** Agents gather and correlate evidence
  rather than generating an answer.
- **Investigate, don't guess.** ARGUS plans, gathers, correlates, then
  concludes.
- **Falsify, don't confirm.** A critic agent searches for evidence that could
  disprove the hypothesis before a root cause is accepted.

## Architecture

```
USER
 │
 ▼
Next.js Dashboard
 │
 ▼
FastAPI API Layer
 │
 ▼
LangGraph Orchestrator
 │
 ▼
Specialized Agents ─── Code · Git · Log · Metrics
 │
 ▼
Evidence Collection
 │
 ▼
Correlation Agent
 │
 ▼
Critic Agent  ◄── re-investigate loop
 │
 ▼
Root Cause Agent
 │
 ▼
Investigation Report
```

Agents never touch external services directly — they go through a controlled
tool layer (`Agent → Tool → External Service`). The Orchestrator decides which
agents are necessary for each investigation rather than running every agent.

See [docs/architecture.md](docs/architecture.md) and
[docs/agent-system.md](docs/agent-system.md).

## Technology stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | Next.js · TypeScript · Tailwind CSS · shadcn/ui (Phase 02+) |
| Backend    | Python · FastAPI                            |
| Orchestration | LangGraph (Phase 02+)                    |
| Database   | PostgreSQL / Supabase (Phase 02+)           |
| Vector store | ChromaDB (Phase 02+)                      |
| Repository | GitHub API / GitHub OAuth (Phase 02+)       |
| Real-time  | Server-Sent Events (SSE)                    |
| Deployment | Vercel (frontend) · cloud hosting (backend) |

## Current development phase

**Phase 01 — Project Architecture** is in progress. This phase establishes the
monorepo structure, runnable frontend and backend, health check, environment
configuration, and architecture documentation. Future-phase features are
intentionally not implemented. See [docs/development-phases.md](docs/development-phases.md).

## Repository structure

```
argus-engine/
├── frontend/          Next.js dashboard
├── backend/           FastAPI API + agent system
├── infrastructure/    Docker and deployment assets
├── docs/              Architecture and design docs
├── tests/             Cross-app test surface
├── .env.example       Environment template (copy to .env)
└── docker-compose.yml Base services
```

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+ and [uv](https://docs.astral.sh/uv/)

### Environment

```bash
cp .env.example .env
```

`.env` is git-ignored. The template documents every variable; most are optional
in Phase 01 (only the defaults are needed to run).

### Run the frontend

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Run the backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
# health check: http://localhost:8000/health
```

## Documentation

- [Architecture](docs/architecture.md)
- [Agent system](docs/agent-system.md)
- [Data architecture](docs/data-architecture.md)
- [Security](docs/security.md)
- [Development phases](docs/development-phases.md)

## Status

Phase 01 delivers the foundation only: a clean, independently runnable frontend
and backend, health checks, externalized configuration, and design
documentation. No agents, OAuth, RAG, dashboards, or production features are
implemented yet.