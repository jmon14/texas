// External libraries
import axios from 'axios';
import Cookies from 'js-cookie';

// Api
import { AuthApi, FilesApi, UsersApi } from '../../ultron-api/api';

// Create new axios instance
export const defaultInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

// Apply interceptors for refresh token flow
defaultInstance.interceptors.response.use(
  (response) => response,
  async (err) => {
    const refreshCookie = Cookies.get('RefreshExist');
    const originalConfig = err.config;
    // If it is a new request that failed with unauthorized status,
    // and a refresh cookie exists, fetch refresh token and try again
    if (
      originalConfig.url !== `${process.env.API_URL}/auth/refresh` &&
      err.response.status === 401 &&
      !originalConfig._retry &&
      refreshCookie
    ) {
      // Use retry flag to prevent infinite loop
      originalConfig._retry = true;
      try {
        // Fetch refresh token
        await defaultInstance.get(`${process.env.API_URL}/auth/refresh`);
        // Try request again
        return defaultInstance(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  },
);

export const authApi = new AuthApi(undefined, process.env.API_URL, defaultInstance);
export const userApi = new UsersApi(undefined, process.env.API_URL, defaultInstance);
export const filesApi = new FilesApi(undefined, process.env.API_URL, defaultInstance);
