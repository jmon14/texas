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
import { trackAgentWork, getWorkLog, clearWorkLog } from './tools/track-agent-work.js';

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
      'Get current project state including git branch, uncommitted files, and running services. Use this to understand the current development context.',
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
      'Analyze a task and determine which agents should be involved, in what order, and with what workflow. Use this to automatically coordinate multi-agent work.',
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
  {
    name: 'track_agent_work',
    description:
      'Record work done by an agent for coordination and progress tracking.',
    inputSchema: {
      type: 'object',
      properties: {
        agent: {
          type: 'string',
          description: 'Name of the agent doing the work',
        },
        task: {
          type: 'string',
          description: 'Brief description of the task',
        },
        status: {
          type: 'string',
          enum: ['started', 'in-progress', 'completed', 'blocked'],
          description: 'Current status of the work',
        },
        details: {
          type: 'string',
          description: 'Optional details about the work',
        },
        filesModified: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of files modified',
        },
      },
      required: ['agent', 'task', 'status'],
    },
  },
  {
    name: 'get_work_log',
    description:
      'Get the current work log showing all agent activity in this session.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'clear_work_log',
    description:
      'Clear the work log and start a new coordination session.',
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

      case 'track_agent_work': {
        const { agent, task, status, details, filesModified } = request.params.arguments as {
          agent: string;
          task: string;
          status: 'started' | 'in-progress' | 'completed' | 'blocked';
          details?: string;
          filesModified?: string[];
        };
        const log = trackAgentWork(agent, task, status, details, filesModified);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(log, null, 2),
            },
          ],
        };
      }

      case 'get_work_log': {
        const log = getWorkLog();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(log, null, 2),
            },
          ],
        };
      }

      case 'clear_work_log': {
        clearWorkLog();
        return {
          content: [
            {
              type: 'text',
              text: 'Work log cleared. New session started.',
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
