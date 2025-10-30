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

## How Automatic Coordination Works

When you request a task, Claude will:
1. **Analyze** the task using `plan_task_with_agents` to determine domains (backend, frontend, etc.)
2. **Load** relevant agent context using `get_agent_context` 
3. **Execute** work by adopting each agent's persona and following their patterns
4. **Track** progress using `track_agent_work` for coordination
5. **Report** back with a summary of what each agent accomplished

You just describe what you want, Claude handles the multi-agent orchestration automatically.

## Testing

### In Cursor
Ask Claude: `"What's my current git branch?"` - Should answer without asking for context.

## Available Tools

### Context Tools
| Tool | Purpose |
|------|---------|
| `get_user_preferences` | Your coding standards, workflow preferences, and how to address you |
| `get_project_state` | Git branch, uncommitted files, recent commits, Docker services, and changelog info (unreleased items, latest version) |
| `get_codebase_summary` | Project structure, tech stack, services, extracts summaries from documentation files (README.md, architecture.md, service READMEs) |
| `get_agent_info` | Available agents and their specializations |

### Agent Coordination Tools
| Tool | Purpose |
|------|---------|
| `plan_task_with_agents` | Analyze task and determine which agents to use |
| `get_agent_context` | Load full context/instructions for a specific agent |
| `track_agent_work` | Record agent work for coordination tracking |
| `get_work_log` | View all agent activity in current session |
| `clear_work_log` | Start a new coordination session |

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
├── index.ts                      # MCP server entry point
└── tools/                        # Tool implementations
    ├── get-user-preferences.ts   # User preferences and workflow rules
    ├── get-project-state.ts      # Git status, Docker services, changelog
    ├── get-codebase-summary.ts   # Codebase overview from documentation
    ├── get-agent-info.ts         # Available agents and capabilities
    ├── plan-task-with-agents.ts  # Task analysis and agent planning
    ├── get-agent-context.ts      # Load agent documentation
    └── track-agent-work.ts       # Work tracking and coordination
```

### Adding New Tools
1. Create tool file in `src/tools/`
2. Register in `src/index.ts` (TOOLS array + switch case)
3. Rebuild: `npm run build`
4. Restart Cursor to test
