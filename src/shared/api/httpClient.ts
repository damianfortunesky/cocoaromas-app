import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import { authStorage } from '@/modules/auth/infrastructure/authStorage';

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 8000
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      window.location.href = '/login?reason=session-expired';
    }
    return Promise.reject(error);
  }
);
