import { ClickUpClient } from '../clickup-client.js';
import { ListTasksParams, ClickUpTask } from '../types.js';

/**
 * List tasks from a ClickUp list
 */
export async function listTasks(client: ClickUpClient, params: ListTasksParams): Promise<any> {
  const { list_id, ...queryParams } = params;

  // Convert arrays to comma-separated strings for API
  const apiParams: Record<string, any> = { ...queryParams };

  if (params.statuses) {
    apiParams.statuses = params.statuses.join(',');
  }
  if (params.assignees) {
    apiParams.assignees = params.assignees.join(',');
  }
  if (params.tags) {
    apiParams.tags = params.tags.join(',');
  }

  const response = await client.get<{ tasks: ClickUpTask[] }>(`/list/${list_id}/task`, apiParams);

  // Return formatted task summary
  return {
    total: response.tasks.length,
    tasks: response.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      status: task.status.status,
      priority: task.priority?.priority || 'none',
      assignees: task.assignees.map((a) => a.username),
      tags: task.tags.map((t) => t.name),
      due_date: task.due_date,
      url: task.url,
      description: task.text_content?.substring(0, 200) || '',
    })),
  };
}
