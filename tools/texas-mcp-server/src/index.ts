#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getProjectState } from './tools/get-project-state.js';
import { getCodebaseSummary } from './tools/get-codebase-summary.js';
import { getAgentInfo } from './tools/get-agent-info.js';
import { getUserPreferences } from './tools/get-user-preferences.js';
import { planTaskWithAgents } from './tools/plan-task-with-agents.js';
import { getAgentContext } from './tools/get-agent-context.js';

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
      'Get a summary of the codebase structure including key directories, services, and technology stack. Use this to understand the project architecture.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_agent_info',
    description:
      'Get information about available agents, their roles, and capabilities. Use this to understand which agents to coordinate for specific tasks.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user_preferences',
    description:
      'Get user preferences including how to address them, coding standards, and workflow preferences. ALWAYS call this first when starting a conversation.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'plan_task_with_agents',
    description:
      'Analyze a task and determine which agents should be involved for planning purposes. This is optional and intended for high-level agent selection during planning phases only.',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: {
          type: 'string',
          description: 'Description of the task to plan',
        },
      },
      required: ['taskDescription'],
    },
  },
  {
    name: 'get_agent_context',
    description:
      'Load the complete context and instructions for a specific agent. Use this to adopt an agent persona and follow their patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: {
          type: 'string',
          description: 'Name of the agent (e.g., "backend-architect", "frontend-developer")',
        },
      },
      required: ['agentName'],
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

      case 'get_agent_info': {
        const agentInfo = await getAgentInfo();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(agentInfo, null, 2),
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

      case 'plan_task_with_agents': {
        const { taskDescription } = request.params.arguments as { taskDescription: string };
        const plan = planTaskWithAgents(taskDescription);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(plan, null, 2),
            },
          ],
        };
      }

      case 'get_agent_context': {
        const { agentName } = request.params.arguments as { agentName: string };
        const context = getAgentContext(agentName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(context, null, 2),
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
