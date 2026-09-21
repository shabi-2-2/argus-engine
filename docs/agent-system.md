# Agent System

> Phase 01 note: this document describes the *intended* agent system. No agent
> implementations exist yet. The package boundaries in
> `backend/app/agents/` are established so later phases can add real
> implementations without restructuring.

## Design principles

1. **Agents reason, tools act.** Agents decide *what* to investigate; tools
   define *how* external access happens. No agent contains external-service
   code.
2. **Evidence-driven.** Every agent returns evidence — source citations,
   log excerpts, metric values, commit hashes — never unsupported assertions.
3. **Falsification over confirmation.** The Critic Agent actively searches for
   evidence that disproves the hypothesis before a root cause is accepted.
4. **Selective execution.** The Orchestrator Agent decides which agents are
   necessary for a given investigation instead of blindly running all of them.

## Agent inventory

| Agent              | Responsibility                                                |
| ------------------ | ------------------------------------------------------------- |
| Orchestrator       | Parses the question, plans the investigation, selects agents, supervises lifecycle |
| Code Agent         | Analyzes source code structure, suspicious changes, patterns  |
| Git Agent          | Gathers commit history, blame, diffs, branches, and release context |
| Log Agent          | Collects and analyzes application/system logs for error signals |
| Metrics Agent      | Pulls metrics and identifies anomalies correlated in time     |
| Correlation Agent  | Joins evidence from multiple agents into coherent findings    |
| Critic Agent       | Challenges the working hypothesis, requests re-investigation   |
| Root Cause Agent   | Produces the root-cause assessment and final report            |

## Agent → Tool → Service flow

```
Orchestrator (LangGraph)
   │  selects
   ▼
Code Agent ──► Repository Tool ──► Repository
Git Agent ───► GitHub Tool ─────► GitHub API
Log Agent ───► Log Tool ─────────► Log sources
Metrics Agent─► Metrics Tool ─────► Metrics backend
```

Tools are implemented under `backend/app/tools/` and remain the **only** code
that touches external services.

## The critic / re-investigation loop

This is the core epistemic loop of ARGUS.

```
Generate Hypothesis
        │
        ▼
Critic Agent: "What evidence would disprove this?"
        │
        ├── evidence supports hypothesis → confirm → root cause
        ├── evidence contradicts it → reject hypothesis
        └── evidence is ambiguous/insufficient → request re-investigation
                │
                ▼
        Orchestrator re-selects agents / gathers more evidence
```

Requirements for this loop to be meaningful:

- Each hypothesis records the evidence that supports it and the evidence
  searched for that would disprove it.
- Each rejection must be traceable to specific evidence.
- The Critic must be able to *request new tool activity*, not just reason
  about existing evidence.

## Investigation state

Investigations are modeled as a state graph (LangGraph) carrying:

- The original user question
- The selected agent plan
- Discovered evidence (with sources)
- Findings and working hypothesis
- Critic verdicts and revision history
- The final root-cause report

## Executing the full agent set is opt-in

The Orchestrator builds a plan per investigation. Lightweight problems select
a small agent subset (e.g. `Git Agent` + `Code Agent`); full system incidents
may engage log, metrics, and correlation agents as well.