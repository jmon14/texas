#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getProjectState } from './tools/get-project-state.js';
import { getCodebaseSummary } from './tools/get-codebase-summary.js';
import { getUserPreferences } from './tools/get-user-preferences.js';

// Create MCP server
const server = new Server(
  {
    name: 'texas-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Define available tools
const TOOLS = [
  {
    name: 'get_project_state',
    description:
      'Get current project state including git branch and working tree status, uncommitted files, running Docker services, and unreleased changelog entries with latest version. Use this to understand the current development context.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_codebase_summary',
    description:
      'Get a summary of the codebase structure including key directories, services, and documentation pointers. This tool does not load any `.claude/*` persona definitions.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user_preferences',
    description:
      'Get lightweight user workflow preferences (e.g., commit policy and validation expectations). This tool does not include any persona-based workflow.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    switch (name) {
      case 'get_project_state': {
        const state = await getProjectState();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(state, null, 2),
            },
          ],
        };
      }

      case 'get_codebase_summary': {
        const summary = await getCodebaseSummary();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case 'get_user_preferences': {
        const preferences = await getUserPreferences();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(preferences, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Texas MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
