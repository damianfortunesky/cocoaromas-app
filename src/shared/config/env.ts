type EnvVars = {
  VITE_API_URL?: string;
};

const envVars = import.meta.env as EnvVars;

const getEnv = (value: string | undefined, fallback = ''): string => (value && value.length > 0 ? value : fallback);

export const env = {
  apiUrl: getEnv(envVars.VITE_API_URL, 'http://localhost:8080/api')
} as const;
