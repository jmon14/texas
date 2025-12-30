# Claude Skills + MCP Workflow (Machine Contract)

This repo uses a **skills-based workflow**. Context and automation are provided via **MCP servers**.

## 0. Goals

- Keep the workflow lightweight and local-first.
- Prefer deterministic tools (MCP) for project state queries.
- Make minimal, targeted code changes aligned with the user request.
- Do not use planning loops, role simulation, or agent-style task orchestration unless explicitly requested.

## 1. Local Setup (Claude)

### 1.1 MCP configuration (repo root)

- The MCP configuration lives at **`.mcp.json`** (repo root).
- **Claude Code will auto-detect this file when run from the repo root.**
- Verify MCP servers are loaded with:

```bash
claude mcp list
```

- If Claude prompts you to approve tool access, approve the servers you want enabled for this project.

### 1.2 Build/install MCP servers

From repo root:

```bash
npm run install:tools
cd tools/texas-mcp-server && npm run build
cd ../clickup-mcp-server && npm run build
```

### 1.3 ClickUp credentials (optional)

If you want the ClickUp MCP server enabled, follow the setup in:
- `tools/clickup-mcp-server/README.md`

## 2. MCP Servers (reference docs)

- Project MCP server: `tools/texas-mcp-server/README.md`
- ClickUp MCP server: `tools/clickup-mcp-server/README.md`

## 3. Skills (how work is scoped)

Skills are “domains of work” the assistant can apply. A single task can require multiple skills.

- **backend**: NestJS API, auth, DB integration, migrations/seeders, backend config in `apps/backend/`
- **frontend**: React UI, state management, client API integration in `apps/frontend/`
- **devops**: Docker compose, infra, deployment scripts, nginx in `infrastructure/`
- **testing**: unit/integration/e2e tests (Playwright/Jest) across apps
- **docs**: READMEs, `docs/*`, `CHANGELOG.md`
- **tools**: MCP servers under `tools/*`

## 4. Default workflow rules

- **Prefer MCP for state**: branch status, what’s running, “where is X documented?”, etc.
- **Minimize scope**: change only what’s required to satisfy the request.
- **No architectural redesign** unless the user explicitly requests it.
- **After substantive edits**: run or suggest the closest relevant checks when feasible. Do not invent commands.

## 5. Contributing + Changelog

- **Contributing**: follow `CONTRIBUTING.md` for local dev workflow, formatting/lint expectations, and testing conventions.
- **Changelog**: when a change is user-visible, release-relevant, or alters behavior/API, add an entry to `CHANGELOG.md` (keep it concise and scoped to the change).

## 6. Documentation reference order

1. `README.md`
2. `CONTRIBUTING.md`
3. `CHANGELOG.md`
4. `docs/architecture.md`
5. `docs/troubleshooting.md`
6. Service docs: `apps/backend/README.md`, `apps/frontend/README.md`
7. Tool docs: `tools/texas-mcp-server/README.md`, `tools/clickup-mcp-server/README.md`

## 7. Response expectations

- Make changes directly.
- Briefly explain what changed and why.
- Avoid meta commentary or internal reasoning.