import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { env } from '@/shared/config/env';
import { toHttpError } from '@/shared/api/httpErrors';

export type AuthTokenProvider = () => string | null;

type UnauthorizedHandler = () => void;

let authTokenProvider: AuthTokenProvider | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

const PUBLIC_ENDPOINT_PREFIXES = ['/products', '/categories', '/auth/login', '/auth/register'];

export const setAuthTokenProvider = (provider: AuthTokenProvider) => {
  authTokenProvider = provider;
};

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = authTokenProvider?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onResponseError = (error: AxiosError) => {
  const requestUrl = error.config?.url ?? '';
  const isPublicEndpoint = PUBLIC_ENDPOINT_PREFIXES.some((prefix) => requestUrl.startsWith(prefix));

  if (error.response?.status === 401 && !isPublicEndpoint) {
    unauthorizedHandler?.();
  }

  return Promise.reject(toHttpError(error));
};

httpClient.interceptors.request.use(onRequest);
httpClient.interceptors.response.use((response: AxiosResponse) => response, onResponseError);

export const attachHttpInterceptors = (client: AxiosInstance = httpClient) => ({
  onRequestFulfilled: (handler: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>) =>
    client.interceptors.request.use(handler),
  onResponseRejected: (handler: (error: AxiosError) => unknown) => client.interceptors.response.use(undefined, handler)
});
