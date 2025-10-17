# ClickUp MCP Server

Model Context Protocol (MCP) server for ClickUp API integration. This server enables AI assistants to interact with ClickUp tasks, lists, and spaces programmatically.

## Features

- 🔍 **List and fetch tasks** from ClickUp lists
- ✨ **Create new tasks** with rich metadata (assignees, tags, priority, dates)
- ✏️ **Update existing tasks** (status, description, assignees, etc.)
- 📋 **Browse lists and spaces** to discover workspace structure
- 🔐 **Secure authentication** via Personal API Token with environment variables

## Prerequisites

- Node.js 18+ 
- ClickUp account with API access
- ClickUp Personal API Token

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your ClickUp API Token

1. Open ClickUp and log in
2. Click your **profile picture** (bottom-left)
3. Select **Settings** → **Apps**
4. Scroll to **API Token** section
5. Click **Generate** (or **Regenerate** if you have one)
6. **Copy the token** - it starts with `pk_`

### Step 2: Get Your ClickUp Team ID

1. In ClickUp, click your **workspace name** (top-left)
2. Go to **Settings**
3. Look at the URL: `https://app.clickup.com/{TEAM_ID}/settings`
4. **Copy the TEAM_ID** (it's a number like `123456`)

### Step 3: Install Dependencies

```bash
cd tools/clickup-mcp-server
npm install
npm run build
```

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env` in the **tools/clickup-mcp-server** directory:
   ```bash
   cd tools/clickup-mcp-server
   cp .env.example .env
   ```

2. Edit `.env` and add your ClickUp API token:
   ```bash
   CLICKUP_API_TOKEN=pk_12345_YOUR_ACTUAL_TOKEN_HERE
   ```

3. The `.env` file is already in `.gitignore` so your token won't be committed.

### Step 5: Enable the MCP Server

1. Open `.cursor/mcp.json`
2. Find the `"clickup"` section
3. Change `"disabled": true` to `"disabled": false`
4. Save the file

The configuration should look like this:
```json
{
  "mcpServers": {
    "clickup": {
      "command": "node",
      "args": ["./tools/clickup-mcp-server/build/index.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

Note: The MCP server loads its configuration from `tools/clickup-mcp-server/.env` automatically using dotenv.

### Step 6: Restart Cursor

1. **Completely close** Cursor (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Reopen** Cursor
3. The ClickUp MCP server will now run automatically in the background!

**Important**: Cursor automatically launches MCP servers configured in `.cursor/mcp.json`. You don't need to manually run any commands - it happens automatically when Cursor starts.

## ✅ Test the Integration

Once Cursor is restarted, try these commands with your AI assistant:

1. **Discover your workspace structure:**
   ```
   "Get all spaces from my ClickUp team 123456"
   ```

2. **See lists in a space:**
   ```
   "Show me all lists in space 789012"
   ```

3. **View tasks:**
   ```
   "List all tasks in ClickUp list 345678"
   ```

4. **Create a test task:**
   ```
   "Create a task called 'Test ClickUp Integration' in list 345678 with high priority"
   ```

## 📋 Getting Your List ID

To work with tasks, you need a **List ID**:

1. In ClickUp, navigate to the list you want to use
2. Look at the URL: `https://app.clickup.com/{TEAM_ID}/v/li/{LIST_ID}`
3. The **LIST_ID** is after `/li/`

OR use the AI once integrated:
```
"Show me all lists in space {YOUR_SPACE_ID}"
```

## Available Tools

### 1. `get_spaces`
Get all spaces (workspaces) from your ClickUp team.

**Parameters:**
- `team_id` (required): Your ClickUp team ID

**Example:**
```typescript
{
  "team_id": "123456"
}
```

### 2. `get_lists`
Get all lists from a space or folder.

**Parameters:**
- `space_id` (optional): Space ID to fetch lists from
- `folder_id` (optional): Folder ID to fetch lists from

**Example:**
```typescript
{
  "space_id": "789012"
}
```

### 3. `list_tasks`
List tasks from a ClickUp list with optional filtering.

**Parameters:**
- `list_id` (required): The list ID
- `statuses` (optional): Filter by status names
- `assignees` (optional): Filter by assignee user IDs
- `tags` (optional): Filter by tag names
- `include_closed` (optional): Include closed tasks
- `order_by` (optional): Sort field ('created', 'updated', 'due_date')
- `page` (optional): Page number for pagination

**Example:**
```typescript
{
  "list_id": "345678",
  "statuses": ["in progress", "review"],
  "include_closed": false
}
```

### 4. `get_task`
Get detailed information about a specific task.

**Parameters:**
- `task_id` (required): The ClickUp task ID

**Example:**
```typescript
{
  "task_id": "abc123"
}
```

### 5. `create_task`
Create a new task in a ClickUp list.

**Parameters:**
- `list_id` (required): The list ID where task will be created
- `name` (required): Task name/title
- `description` (optional): Task description (supports markdown)
- `assignees` (optional): Array of assignee user IDs
- `tags` (optional): Array of tag names
- `status` (optional): Initial status name
- `priority` (optional): 1=Urgent, 2=High, 3=Normal, 4=Low
- `due_date` (optional): Unix timestamp in milliseconds
- `start_date` (optional): Unix timestamp in milliseconds

**Example:**
```typescript
{
  "list_id": "345678",
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication with refresh tokens",
  "priority": 2,
  "tags": ["backend", "security"],
  "due_date": 1700000000000
}
```

### 6. `update_task`
Update an existing task.

**Parameters:**
- `task_id` (required): The task ID to update
- `name` (optional): New task name
- `description` (optional): New task description
- `status` (optional): New status name
- `priority` (optional): New priority (1-4)
- `due_date` (optional): New due date or null to remove
- `assignees` (optional): Object with `add` and `rem` arrays
- `archived` (optional): Archive/unarchive the task

**Example:**
```typescript
{
  "task_id": "abc123",
  "status": "completed",
  "priority": 3
}
```

## 🎯 Common Use Cases

### Create tasks for testing improvement
```
"Create tasks in ClickUp list 345678 for:
1. Audit backend test coverage
2. Add unit tests for Files module
3. Add unit tests for Ranges module"
```

### Check task status
```
"Show me all 'in progress' tasks in list 345678"
```

### Move task to completed
```
"Update task abc123 to status 'completed'"
```

### View task details
```
"Get details for task abc123"
```

## Workflow for Testing Improvement

This MCP server enables the following workflow for your testing initiative:

1. **Create Epic in ClickUp** (manual or via AI)
2. **AI creates tasks** using `create_task` for each deliverable
3. **AI fetches tasks** using `list_tasks` to see what needs to be done
4. **Work on tasks** with AI assistance
5. **AI updates status** using `update_task` as work progresses
6. **Track progress** by querying task status

## 🔐 Security Notes

- ✅ **API token stored in `tools/clickup-mcp-server/.env`** (not committed to git)
- ✅ **`.cursor/mcp.json` can be committed** (no secrets)
- ⚠️ **Never commit `.env` file** to version control
- ⚠️ **Keep your token secure** - it has full access to your ClickUp workspace
- 🔄 **Rotate your token periodically** from ClickUp settings

### For Teams

Each team member should:
1. Copy `tools/clickup-mcp-server/.env.example` to `tools/clickup-mcp-server/.env`
2. Add their own ClickUp API token
3. Never commit their `.env` file

The `.cursor/mcp.json` file is safe to commit because it contains no secrets. The MCP server loads credentials from its own `.env` file automatically.

## 🔧 Troubleshooting

### Server not starting
- Ensure dependencies are installed: `npm install`
- Rebuild the server: `npm run build`
- Check your API token is valid
- Verify `.env` file exists in project root

### "API token is required" error
- Make sure `.env` file exists in `tools/clickup-mcp-server/`
- Verify `CLICKUP_API_TOKEN` is set correctly in `.env`
- Check there are no extra spaces around the token
- Restart Cursor after creating/modifying `.env`

### Authentication errors
- Verify your API token is correct in `.env`
- Check token hasn't been revoked in ClickUp
- Generate a new token if needed

### Cannot find lists/tasks
- Verify your Team ID is correct
- Use `get_spaces` and `get_lists` to discover IDs
- Check permissions for your API token

### Server not working after restart
- Check for typos in `.cursor/mcp.json`
- Make sure `"disabled": false` (not true)
- Verify `.env` file has the token
- Try rebuilding: `cd tools/clickup-mcp-server && npm run build`

## Development

To modify the server:

1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Restart Cursor to load changes

Watch mode for development:
```bash
npm run watch
```

## How MCP Servers Work

MCP servers run automatically when Cursor starts:
- Cursor reads `.cursor/mcp.json` on startup
- Launches each enabled MCP server as a background process
- Servers communicate via stdio (standard input/output)
- No manual commands needed - fully automatic!

## API Reference

Full ClickUp API documentation: https://clickup.com/api

## License

MIT
