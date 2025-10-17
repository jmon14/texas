import { ClickUpClient } from '../clickup-client.js';
import { ClickUpTask } from '../types.js';

/**
 * Get detailed information about a specific task
 */
export async function getTask(client: ClickUpClient, taskId: string): Promise<any> {
  const task = await client.get<ClickUpTask>(`/task/${taskId}`);

  // Return comprehensive task details
  return {
    id: task.id,
    custom_id: task.custom_id,
    name: task.name,
    description: task.text_content,
    status: {
      name: task.status.status,
      color: task.status.color,
      type: task.status.type,
    },
    priority: task.priority
      ? {
          level: task.priority.priority,
          color: task.priority.color,
        }
      : null,
    assignees: task.assignees.map((a) => ({
      id: a.id,
      username: a.username,
      email: a.email,
    })),
    tags: task.tags.map((t) => t.name),
    due_date: task.due_date,
    start_date: task.start_date,
    time_estimate: task.time_estimate,
    time_spent: task.time_spent,
    list: task.list,
    folder: task.folder,
    space: task.space,
    creator: task.creator,
    date_created: task.date_created,
    date_updated: task.date_updated,
    date_closed: task.date_closed,
    parent: task.parent,
    url: task.url,
    custom_fields: task.custom_fields,
  };
}
