type EnvVars = {
  VITE_API_URL?: string;
};

const envVars = import.meta.env as EnvVars;

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');

const getEnv = (value: string | undefined, fallback = ''): string => {
  const rawValue = value && value.length > 0 ? value : fallback;
  return normalizeBaseUrl(rawValue);
};

export const env = {
  apiUrl: getEnv(envVars.VITE_API_URL, 'http://localhost:8080/api/v1')
} as const;
