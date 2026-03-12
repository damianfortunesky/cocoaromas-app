import type { UserSession } from '@/shared/types/common';

const KEY = 'cocoaromas_session';

export const authStorage = {
  save(session: UserSession) {
    localStorage.setItem(KEY, JSON.stringify(session));
  },
  get(): UserSession | null {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  },
  getToken() {
    return authStorage.get()?.token ?? null;
  },
  clear() {
    localStorage.removeItem(KEY);
  }
};
