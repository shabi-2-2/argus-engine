# Security

Security principles are established now and apply to every later phase.

> Phase 01 note: there is no authentication and no credential handling yet.
> These principles govern how those features will be built.

## Principles

1. **Never expose credentials to LLM prompts.** Tokens, secrets, and keys are
   resolved by tools at the point of use and are never placed in agent context.
2. **Store external credentials securely.** Use a managed secret store /
   environment-level secrets. Credentials referenced by database records but
   the values live outside the application database.
3. **Agents access external services only through controlled tools.** The
   Tool layer (`backend/app/tools/`) is the sole path to external systems.
4. **Treat repository code as untrusted input.** Anything read from a
   repository may be hostile. Never feed repository content into a context
   that can influence tool selection without escaping/sanitizing it; treat
   embedded instructions in repo content like data, not commands.
5. **Tool execution is permission-controlled.** Tools declare required scopes;
   the runtime enforces them before execution.
6. **Never allow an LLM to arbitrarily execute shell commands.** There is no
   general shell tool. Any shell-like capability must be a narrowly scoped,
   allow-listed tool with its own permissions.
7. **Separate read-only tools from write/action tools.** Read-only
   investigation tools (repo read, log read, metrics read) are distinct from
   potential write tools (create PR, post comment, change config). Writes are
   opt-in, reviewed, and logged.
8. **Keep secrets out of Git.** `.env` and other secret files are ignored; only
   `.env.example` template is committed.
9. **Use environment variables for configuration.** No hard-coded
   configuration in source. See `.env.example`.
10. **Log security-relevant events.** Authentication, authorization decisions,
    tool executions (who/what/scope), and credential lifecycle events are
    logged with enough detail for audit but never credentials themselves.

## Environment configuration

Copy `.env.example` to `.env` and fill values locally. The backend reads
configuration from environment variables via `backend/app/core/config.py`
(Pydantic Settings). E.g.:

```bash
cp .env.example .env
```

## Threat model (summary)

| Asset              | Primary risk                       | Mitigation                              |
| ------------------ | ---------------------------------- | --------------------------------------- |
| GitHub credentials | Exfiltration to prompt/logs        | Tool-layer resolution, secret store     |
| Repository content | Prompt-injection / malicious input | Untrusted-input handling, escape policy |
| Tool execution     | Unauthorized / destructive action  | Permission control, read/write split    |
| Investigation data | Leakage across projects            | Project-scoped access (Phase 02+)       |
| Environment config | Secrets committed to Git           | Ignore rules, `.env.example` only       |

## Open items (later phases)

- GitHub OAuth flow and token storage (keep-access tokens out of LLM context)
- Project-scoped authorization on API routes
- Audit log persistence for tool executions
- Rate limiting and abuse protection