export type Role = 'admin' | 'owner' | 'employee' | 'client';

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
  token: string;
  refreshToken?: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
