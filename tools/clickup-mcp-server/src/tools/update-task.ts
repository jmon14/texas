import { ClickUpClient } from '../clickup-client.js';
import { UpdateTaskParams } from '../types.js';

/**
 * Update an existing task
 */
export async function updateTask(client: ClickUpClient, params: UpdateTaskParams): Promise<any> {
  const { task_id, ...updateData } = params;

  const response = await client.put(`/task/${task_id}`, updateData);

  return {
    id: response.id,
    name: response.name,
    status: response.status?.status,
    updated_fields: Object.keys(updateData),
    message: 'Task updated successfully',
  };
}
