// External libraries
import axios from 'axios';
import Cookies from 'js-cookie';

// Api
import { AuthApi, FilesApi, UsersApi, RangesApi } from '../../ultron-api/api';

// Create new axios instance
export const ultronInstance = axios.create({
  baseURL: process.env.REACT_APP_ULTRON_API_URL,
  withCredentials: true,
});

// Apply interceptors for refresh token flow
ultronInstance.interceptors.response.use(
  (response) => response,
  async (err) => {
    const refreshCookie = Cookies.get('RefreshExist');
    const originalConfig = err.config;
    // If it is a new request that failed with unauthorized status,
    // and a refresh cookie exists, fetch refresh token and try again
    if (
      originalConfig.url !== `${process.env.REACT_APP_ULTRON_API_URL}/auth/refresh` &&
      err.response.status === 401 &&
      !originalConfig._retry &&
      refreshCookie
    ) {
      // Use retry flag to prevent infinite loop
      originalConfig._retry = true;
      try {
        // Fetch refresh token
        await ultronInstance.get(`${process.env.REACT_APP_ULTRON_API_URL}/auth/refresh`);
        // Try request again
        return ultronInstance(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  },
);

export const authApi = new AuthApi(undefined, process.env.REACT_APP_ULTRON_API_URL, ultronInstance);
export const userApi = new UsersApi(
  undefined,
  process.env.REACT_APP_ULTRON_API_URL,
  ultronInstance,
);
export const filesApi = new FilesApi(
  undefined,
  process.env.REACT_APP_ULTRON_API_URL,
  ultronInstance,
);
export const rangeApi = new RangesApi(
  undefined,
  process.env.REACT_APP_ULTRON_API_URL,
  ultronInstance,
);
