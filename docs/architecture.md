# ARGUS — Architecture

ARGUS (**A**utonomous **I**nvestigation & **R**oot-**C**ause Intelligence) is an
agentic AI platform that connects to a software project, understands the
codebase and available system evidence, and autonomously investigates technical
problems.

> **Give ARGUS a problem. It investigates.**

This document describes the *intended* architecture. Phase 01 establishes only
the foundation; features described here are implemented incrementally in later
phases. See [development-phases.md](./development-phases.md) for the roadmap.

## Core philosophy

1. **Evidence-driven, not answer-driven.** Agents gather and correlate evidence
   rather than generate answers from the prompt alone.
2. **Investigation before conclusion.** ARGUS plans, gathers, correlates, then
   concludes — in that order.
3. **Falsify, don't confirm.** A critic loop actively searches for evidence that
   could disprove the working hypothesis before a root cause is accepted.
4. **Separation of concerns.** Agents reason; tools access; services own
   business logic. No agent touches an external service directly.

## System overview

```
USER
 │
 ▼
Next.js Dashboard ──────────┐
      │                      │
      ▼                      │
FastAPI API Layer ───────────┤
      │                      │
      ▼                      │
LangGraph Orchestrator       │
      │                      │
      ▼                      │
Specialized Agents           │
      │                      │
      ▼                      │
Evidence Collection          │
      │                      │
      ▼                      │
Correlation Agent            │
      │                      │
      ▼                      │
Critic Agent  ◄──────────────┘ (challenge / re-investigate loop)
      │
      ▼
Root Cause Agent
      │
      ▼
Investigation Report
```

## Repositories

Monorepo, with each application kept independently runnable:

```
argus-ai/           (currently: argus-engine)
├── frontend/       Next.js + TypeScript dashboard
├── backend/        FastAPI + Python API and agent system
├── infrastructure/ Docker and deployment assets
├── docs/           Architecture and design documentation
└── tests/          Cross-app / integration test surface
```

## Frontend architecture

The frontend will contain (Phase 02+):

- Project dashboard and connection flow
- Investigation creation
- Live investigation view (SSE-driven agent activity)
- Evidence explorer
- Correlation graph
- Investigation report and history
- Settings and integrations

Phase 01 scope: app shell, directory boundaries
(`app/`, `components/`, `lib/`, `hooks/`, `types/`), and a landing page.

## Backend architecture

### Layering

```
┌─────────────────────────────────────────────┐
│ API layer        api/routes, dependencies   │ HTTP boundaries, auth, SSE
├─────────────────────────────────────────────┤
│ Workflow layer   workflows/                 │ LangGraph state graphs
├─────────────────────────────────────────────┤
│ Agent layer      agents/                    │ reasoning, planning, critique
├─────────────────────────────────────────────┤
│ Tool layer       tools/                     │ controlled external access
├─────────────────────────────────────────────┤
│ Service layer    services/                  │ investigation/evidence/projects
├─────────────────────────────────────────────┤
│ Model layer      models/                    │ Pydantic domain models
└─────────────────────────────────────────────┘
core/config.py · core/logging.py  (cross-cutting)
```

### Agent → Tool → Service rule

Agents must not contain external-service implementation. Communication flows
one way:

```
Agent  →  Tool  →  External Service (GitHub API, filesystem, log store, …)
```

Examples:

| Agent            | Tool              | External service |
| ---------------- | ----------------- | ---------------- |
| Code Agent       | Repository Tool   | Repository       |
| Git Agent        | GitHub Tool       | GitHub API       |
| Log Agent        | Log Tool*         | Log sources      |

\* Additional read-only tools are defined where needed. Write/action tools are
kept **separate** from read-only investigation tools (see
[security.md](./security.md)).

## Agents

| Agent              | Responsibility                                              |
| ------------------ | ----------------------------------------------------------- |
| Orchestrator       | Plans the investigation, decides which agents are necessary |
| Code Agent         | Analyzes repository source                                 |
| Git Agent          | Gathers commit/history evidence                            |
| Log Agent          | Collects and analyzes logs                                 |
| Metrics Agent      | Correlates metric signals                                  |
| Correlation Agent  | Cross-correlates evidence into findings                    |
| Critic Agent       | Challenges the hypothesis, looks for disconfirming evidence |
| Root Cause Agent   | Produces the root-cause assessment and report              |

The orchestrator does **not** blindly execute every agent; it selects the
minimum necessary set based on the problem. See
[agent-system.md](./agent-system.md).

## Investigation workflow

```
User Question
      │
      ▼
Input Processing
      │
      ▼
Investigation Planning
      │
      ▼
Select Required Agents
      │
      ▼
Gather Evidence ──► Analyze Evidence ──► Correlate Findings
                                              │
                                              ▼
                                        Generate Hypothesis
                                              │
                                              ▼
                                           Critic Agent
                                              │
                            ┌─────────────┐   │
                            │ re-investigate ─┘ (evidence contradicts hypothesis)
                            └─────────────┘
                                              │
                                              ▼
                                          Root Cause
                                              │
                                              ▼
                                        Investigation Report
```

## Real-time communication (SSE)

Investigation progress streams to the dashboard over Server-Sent Events. The
event surface (Phase 02+) includes:

```
investigation.started      hypothesis.created
agent.started              critic.started
agent.progress             hypothesis.rejected
evidence.discovered        hypothesis.confirmed
                           investigation.completed
                           investigation.failed
```

```
FastAPI → SSE stream → Next.js → Live investigation interface
```

## Data stores (Phase 02+)

- **PostgreSQL / Supabase** — relational store for users, projects,
  repositories, integrations, investigations, agent runs, evidence,
  hypotheses, reports.
- **ChromaDB** — vector store for code chunks, documentation, repository
  context, and investigation evidence embeddings.

Neither is wired in Phase 01. See [data-architecture.md](./data-architecture.md).

## Infrastructure

- Frontend deploys to Vercel.
- Backend deploys to appropriate cloud hosting (containerized FastAPI).
- `docker-compose.yml` currently runs only the backend; Postgres and ChromaDB
  are reserved as commented services for Phase 02+.

## Security posture

See [security.md](./security.md). Principles are designed in from day one:
credentials never reach LLM prompts, agents only reach external systems through
controlled tools, repository code is untrusted input, and no agent may execute
arbitrary shell commands.