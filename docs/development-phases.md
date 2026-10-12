# Development Phases

High-level roadmap. Each phase ends with a reviewable, runnable foundation.

## Phase 01 — Project Architecture ✅ (current)

**Goal:** clean foundation; every later phase lands without restructuring.

Delivered:

- Monorepo: `frontend/`, `backend/`, `infrastructure/`, `docs/`, `tests/`
- Next.js 16 + TypeScript (strict) frontend with landing page
- FastAPI backend with `GET /health`
- Backend module boundaries: `api/`, `agents/`, `tools/`, `services/`,
  `workflows/`, `models/`, `core/`
- `.env.example`, `.gitignore`, minimal `docker-compose.yml`
- Architecture documentation in `docs/`

Not included (by design): GitHub OAuth, LangGraph workflows, RAG, ChromaDB,
Postgres, shadcn/ui, investigation dashboard, real agents.

## Phase 02 — Backend Foundation

- PostgreSQL/Supabase schema: `users`, `projects`, `repositories`,
  `integrations` (Supabase/Alembic migrations)
- Project + repository CRUD API
- GitHub OAuth connection flow (token holder, kept out of LLM context)
- Tool layer: GitHub Tool (read-only) + Repository Tool
- Service layer for projects; SSE scaffolding for investigation events

## Phase 03 — Agent Orchestration (LangGraph)

- Investigation workflow state graph
- Orchestrator (plan + agent selection)
- First real agents: Git Agent, Code Agent (+ repository tools)
- Evidence model and storage
- `agent.started` / `agent.progress` / `evidence.discovered` events

## Phase 04 — Investigation Dashboard

- Frontend: project connection, investigation creation, live investigation
  view over SSE, agent activity visualization, evidence explorer

## intermidiate phase: investigation loop (error ko monitor aur error kiss type ki problem generate kar raha hai before and after, warning kaha se aa rahi hai)

## Phase 05 — Correlation & Critic Loop (investigation loop ki research + codebase read and code merge monitor karne ke baad assumed problematic things)

- Correlation Agent
- Critic Agent with falsification loop (`hypothesis.created` /
  `hypothesis.rejected` / `hypothesis.confirmed`)
- Re-investigation trigger

## Phase 06 — Logs, Metrics & Root Cause

- Log Agent + Log Tool; Metrics Agent + Metrics Tool
- Root Cause Agent and final report generation
- Report/evidence persistence

## Phase 07 — Search & Memory

- ChromaDB ingestion (code/documentation chunks)
- Semantic evidence retrieval across investigations

## Phase 08 — Hardening & Verification

- Permission controls, scope enforcement, audit logging
- E2E tests, rate limiting, production monitoring
- Vercel frontend + containerized backend deployment

## Non-goals (long-term wishlist)

- Multi-user collaboration and orgs
- Prognostics (predicting failures before they surface)
- Autonomous remediation actions (write tools) — gated behind review
