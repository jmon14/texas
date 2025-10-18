import { ClickUpClient } from '../clickup-client.js';
import { CreateTaskParams } from '../types.js';

/**
 * Create a new task in a ClickUp list
 */
export async function createTask(client: ClickUpClient, params: CreateTaskParams): Promise<any> {
  const { list_id, ...taskData } = params;

  const response = await client.post(`/list/${list_id}/task`, taskData);

  return {
    id: response.id,
    name: response.name,
    status: response.status?.status || 'created',
    url: response.url,
    message: 'Task created successfully',
  };
}
