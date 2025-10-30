#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ClickUpClient } from './clickup-client.js';
import { listTasks } from './tools/list-tasks.js';
import { getTask } from './tools/get-task.js';
import { createTask } from './tools/create-task.js';
import { updateTask } from './tools/update-task.js';
import { getLists } from './tools/get-lists.js';
import { getSpaces } from './tools/get-spaces.js';

// Load environment variables from .env file
// __dirname is tools/clickup-mcp-server/build/, so ../.env is tools/clickup-mcp-server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');

if (existsSync(envPath)) {
  config({ path: envPath });
} else if (!process.env.CLICKUP_API_TOKEN) {
  console.error(
    `Warning: .env file not found at ${envPath}\n` +
      'Please ensure CLICKUP_API_TOKEN is set as environment variable or create .env file.',
  );
}

// Create MCP server
const server = new Server(
  {
    name: 'clickup-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Initialize ClickUp client
let clickupClient: ClickUpClient;

try {
  clickupClient = new ClickUpClient();
} catch (error) {
  console.error('Failed to initialize ClickUp client:', error);
  process.exit(1);
}

// Define available tools
const TOOLS = [
  {
    name: 'get_spaces',
    description:
      'Get all spaces (workspaces) from a ClickUp team. Use this to discover space IDs for other operations. Team ID is read from CLICKUP_TEAM_ID in .env file.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_lists',
    description:
      'Get all lists from a ClickUp space or folder. Provide either space_id or folder_id to fetch lists.',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'string',
          description: 'The ClickUp space ID',
        },
        folder_id: {
          type: 'string',
          description: 'The ClickUp folder ID',
        },
      },
    },
  },
  {
    name: 'list_tasks',
    description:
      'List tasks from a ClickUp list. Supports filtering by status, assignees, tags, dates, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'The ClickUp list ID to fetch tasks from',
        },
        archived: {
          type: 'boolean',
          description: 'Include archived tasks',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
        order_by: {
          type: 'string',
          enum: ['created', 'updated', 'due_date'],
          description: 'Field to order by',
        },
        reverse: {
          type: 'boolean',
          description: 'Reverse the order',
        },
        subtasks: {
          type: 'boolean',
          description: 'Include subtasks',
        },
        statuses: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by status names',
        },
        include_closed: {
          type: 'boolean',
          description: 'Include closed tasks',
        },
        assignees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by assignee user IDs',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by tag names',
        },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'get_task',
    description:
      'Get detailed information about a specific task by its ID. Returns comprehensive task details including status, assignees, priority, dates, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ClickUp task ID',
        },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'create_task',
    description:
      'Create a new task in a ClickUp list. Supports setting name, description, assignees, tags, status, priority, and due dates.',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'The ClickUp list ID where the task will be created',
        },
        name: {
          type: 'string',
          description: 'Task name/title',
        },
        description: {
          type: 'string',
          description: 'Task description (supports markdown)',
        },
        assignees: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of assignee user IDs',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of tag names',
        },
        status: {
          type: 'string',
          description: 'Task status name',
        },
        priority: {
          type: 'number',
          enum: [1, 2, 3, 4],
          description: 'Priority: 1=Urgent, 2=High, 3=Normal, 4=Low',
        },
        due_date: {
          type: 'number',
          description: 'Due date (Unix timestamp in milliseconds)',
        },
        start_date: {
          type: 'number',
          description: 'Start date (Unix timestamp in milliseconds)',
        },
        notify_all: {
          type: 'boolean',
          description: 'Notify all assignees',
        },
        parent: {
          type: 'string',
          description: 'Parent task ID (for creating subtasks)',
        },
      },
      required: ['list_id', 'name'],
    },
  },
  {
    name: 'update_task',
    description:
      'Update an existing task. Can modify name, description, status, priority, dates, assignees, and archived state.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ClickUp task ID to update',
        },
        name: {
          type: 'string',
          description: 'New task name',
        },
        description: {
          type: 'string',
          description: 'New task description',
        },
        status: {
          type: 'string',
          description: 'New status name',
        },
        priority: {
          type: 'number',
          enum: [1, 2, 3, 4],
          description: 'New priority: 1=Urgent, 2=High, 3=Normal, 4=Low',
        },
        due_date: {
          type: ['number', 'null'],
          description: 'New due date (Unix timestamp in milliseconds) or null to remove',
        },
        start_date: {
          type: ['number', 'null'],
          description: 'New start date (Unix timestamp in milliseconds) or null to remove',
        },
        assignees: {
          type: 'object',
          properties: {
            add: {
              type: 'array',
              items: { type: 'number' },
              description: 'User IDs to add as assignees',
            },
            rem: {
              type: 'array',
              items: { type: 'number' },
              description: 'User IDs to remove as assignees',
            },
          },
          description: 'Add or remove assignees',
        },
        archived: {
          type: 'boolean',
          description: 'Archive or unarchive the task',
        },
      },
      required: ['task_id'],
    },
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case 'get_spaces': {
        result = await getSpaces(clickupClient);
        break;
      }

      case 'get_lists': {
        const params = args as { space_id?: string; folder_id?: string };
        result = await getLists(clickupClient, params);
        break;
      }

      case 'list_tasks': {
        const params = args as any;
        result = await listTasks(clickupClient, params);
        break;
      }

      case 'get_task': {
        const { task_id } = args as { task_id: string };
        result = await getTask(clickupClient, task_id);
        break;
      }

      case 'create_task': {
        const params = args as any;
        result = await createTask(clickupClient, params);
        break;
      }

      case 'update_task': {
        const params = args as any;
        result = await updateTask(clickupClient, params);
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails =
      error instanceof Error && 'response' in error
        ? JSON.stringify((error as any).response?.data)
        : '';

    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${errorMessage}${
            errorDetails ? '\nDetails: ' + errorDetails : ''
          }`,
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
  console.error('ClickUp MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
