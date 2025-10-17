import { ClickUpClient } from '../clickup-client.js';

/**
 * Get lists from a ClickUp space or folder
 */
export async function getLists(
  client: ClickUpClient,
  params: { space_id?: string; folder_id?: string },
): Promise<any> {
  let endpoint: string;

  if (params.folder_id) {
    endpoint = `/folder/${params.folder_id}/list`;
  } else if (params.space_id) {
    endpoint = `/space/${params.space_id}/list`;
  } else {
    throw new Error('Either space_id or folder_id is required');
  }

  const response = await client.get<{ lists: any[] }>(endpoint);

  return {
    total: response.lists.length,
    lists: response.lists.map((list) => ({
      id: list.id,
      name: list.name,
      orderindex: list.orderindex,
      content: list.content,
      status: list.status,
      priority: list.priority,
      assignee: list.assignee,
      task_count: list.task_count,
      due_date: list.due_date,
      start_date: list.start_date,
      folder: list.folder,
      space: list.space,
    })),
  };
}
