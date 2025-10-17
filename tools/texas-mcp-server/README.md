# Texas MCP Server

An MCP (Model Context Protocol) server providing AI agents with automatic context about the Texas Poker Application.

## What It Does

Gives Claude automatic access to:
- **Project State**: Git status, uncommitted files, running services
- **Codebase Summary**: Project structure, tech stack, services
- **Agent Info**: Available agents and their capabilities
- **User Preferences**: Development standards and preferences

## Setup

```bash
# Install and build
cd tools/texas-mcp-server
npm install
npm run build
```

### Cursor Configuration

The `.cursor/mcp.json` file (in project root) should contain:

```json
{
  "mcpServers": {
    "texas-project": {
      "command": "node",
      "args": ["./tools/texas-mcp-server/build/index.js"]
    }
  }
}
```

**Restart Cursor** after configuration changes (Cmd+Q, reopen).

## Testing

### Manual Test
```bash
node test-manual.js  # Should show project info
```

### In Cursor
Ask Claude: `"What's my current git branch?"` - Should answer without asking for context.

## Available Tools

| Tool | Purpose |
|------|---------|
| `get_user_preferences` | Your coding standards and how to address you |
| `get_project_state` | Git branch, uncommitted files, recent commits |
| `get_codebase_summary` | Tech stack, services, documentation |
| `get_agent_info` | Available agents and their specializations |

## Troubleshooting

**MCP not connecting?**
1. Verify `build/index.js` exists: `ls -la build/index.js`
2. Test manually: `node build/index.js` (should output "Texas MCP Server running on stdio")
3. Check absolute path is correct in `.cursor/mcp.json`
4. Restart Cursor completely

**Tools not working?**
- Check Cursor Developer Tools (Help → Toggle Developer Tools) for MCP errors
- Ensure `process.cwd()` resolves to project root when MCP runs

## Development

```bash
npm run watch  # Auto-rebuild on changes
```

### Project Structure
```
src/
├── index.ts              # MCP server entry point
└── tools/                # Tool implementations
    ├── get-user-preferences.ts
    ├── get-project-state.ts
    ├── get-codebase-summary.ts
    └── get-agent-info.ts
```

### Adding New Tools
1. Create tool file in `src/tools/`
2. Register in `src/index.ts` (TOOLS array + switch case)
3. Rebuild: `npm run build`
4. Test: `node test-manual.js`
