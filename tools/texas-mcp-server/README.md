# Texas MCP Server

This MCP (Model Context Protocol) server provides structured access to project state for the Texas Poker Application.

It is designed to support a lightweight MCP workflow focused on deterministic project state queries.

---

## Core Responsibilities

The Texas MCP Server provides:

### Project State
- Git branch and working tree status
- Uncommitted files
- Running services (Docker)
- Unreleased changelog entries and latest version

### Codebase Summary
- Project structure (services + paths)
- Pointers to key documentation (README, architecture, troubleshooting, service READMEs)
- Note: intentionally excludes any `.claude/*` persona definitions

### User Preferences
- Lightweight workflow preferences (e.g., commit policy and validation expectations)
- Note: intentionally excludes any persona-based workflow

---

## Installation & Build

```bash
cd tools/texas-mcp-server
npm install
npm run build
