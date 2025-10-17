import { ClickUpClient } from '../clickup-client.js';

/**
 * Get spaces (workspaces) from a ClickUp team
 */
export async function getSpaces(client: ClickUpClient, teamId: string): Promise<any> {
  const response = await client.get<{ spaces: any[] }>(`/team/${teamId}/space`);

  return {
    total: response.spaces.length,
    spaces: response.spaces.map((space) => ({
      id: space.id,
      name: space.name,
      private: space.private,
      statuses: space.statuses,
      multiple_assignees: space.multiple_assignees,
      features: space.features,
    })),
  };
}
