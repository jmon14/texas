# Texas MCP Server

This MCP (Model Context Protocol) server provides structured, deterministic access to project state, agents, and orchestration context for the Texas Poker Application.

It is designed to support a dual-AI workflow:

- **Claude Code** → Planning, phase creation, ClickUp syncing, orchestration.
- **Cursor** → Implementation, code changes, tests, and documentation.

This server acts as the shared context layer between both.

---

## Core Responsibilities

The Texas MCP Server provides:

### Project State
- Git branch and working tree status
- Uncommitted files
- Running services (Docker)
- Unreleased changelog entries and latest version

### Codebase Summary
- Project structure
- Technology stack
- Services overview
- Structured extraction from:
  - `README.md`
  - `docs/architecture.md`
  - Service READMEs

### Agent System Access
- List of available agents
- Load full agent definitions from `.claude/agents/*.md`
- Agents MUST conform to `.claude/templates/agent-template.md`

### User Preferences
- Coding standards
- Workflow preferences
- Addressing preferences

### Optional Planning Support
- High-level agent selection for new features (planning only)

---

## Installation & Build

```bash
cd tools/texas-mcp-server
npm install
npm run build
