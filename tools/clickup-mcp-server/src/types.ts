/**
 * ClickUp API Type Definitions
 */

export interface ClickUpTask {
  id: string;
  custom_id: string | null;
  name: string;
  text_content: string;
  description: string;
  status: {
    status: string;
    color: string;
    orderindex: number;
    type: string;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  creator: {
    id: number;
    username: string;
    email: string;
  };
  assignees: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  watchers: any[];
  checklists: any[];
  tags: Array<{
    name: string;
    tag_fg: string;
    tag_bg: string;
  }>;
  parent: string | null;
  priority: {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  } | null;
  due_date: string | null;
  start_date: string | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: any[];
  list: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
  };
  space: {
    id: string;
    name: string;
  };
  url: string;
}

export interface ListTasksParams {
  list_id: string;
  archived?: boolean;
  page?: number;
  order_by?: 'created' | 'updated' | 'due_date';
  reverse?: boolean;
  subtasks?: boolean;
  statuses?: string[];
  include_closed?: boolean;
  assignees?: string[];
  tags?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
}

export interface CreateTaskParams {
  list_id: string;
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: 1 | 2 | 3 | 4; // 1: Urgent, 2: High, 3: Normal, 4: Low
  due_date?: number; // Unix timestamp in milliseconds
  start_date?: number; // Unix timestamp in milliseconds
  notify_all?: boolean;
  parent?: string; // Parent task ID for subtasks
  links_to?: string; // Link to another task
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}

export interface UpdateTaskParams {
  task_id: string;
  name?: string;
  description?: string;
  status?: string;
  priority?: 1 | 2 | 3 | 4;
  due_date?: number | null;
  start_date?: number | null;
  assignees?: {
    add?: number[];
    rem?: number[];
  };
  archived?: boolean;
}
