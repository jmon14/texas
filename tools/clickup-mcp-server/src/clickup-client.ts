import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * ClickUp API Client
 * Handles authentication and API requests to ClickUp
 */
export class ClickUpClient {
  private client: AxiosInstance;
  private apiToken: string;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.CLICKUP_API_TOKEN || '';

    if (!this.apiToken) {
      throw new Error(
        'ClickUp API token is required. Set CLICKUP_API_TOKEN environment variable or pass it to the constructor.',
      );
    }

    this.client = axios.create({
      baseURL: 'https://api.clickup.com/api/v2',
      headers: {
        Authorization: this.apiToken,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Make a GET request to ClickUp API
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  /**
   * Make a POST request to ClickUp API
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  /**
   * Make a PUT request to ClickUp API
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  /**
   * Make a DELETE request to ClickUp API
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.client.delete(endpoint);
    return response.data;
  }

  /**
   * Test API connection and get authorized user info
   */
  async testConnection(): Promise<any> {
    return this.get('/user');
  }
}
