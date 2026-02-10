/**
 * Persisted auth storage so login survives browser close.
 * Uses localStorage (not sessionStorage) for accessToken, userId, userRole.
 * Safe when localStorage is missing (SSR, tests, private mode).
 */
const KEY_ACCESS = "accessToken";
const KEY_USER_ID = "userId";
const KEY_USER_ROLE = "userRole";

const hasStorage = () => typeof window !== "undefined" && typeof window.localStorage === "object";

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const getAccessToken = () => (hasStorage() ? safe(() => localStorage.getItem(KEY_ACCESS)) : null);
export const setAccessToken = (token) => { if (token != null && hasStorage()) safe(() => localStorage.setItem(KEY_ACCESS, token)); };
export const getUserId = () => (hasStorage() ? safe(() => localStorage.getItem(KEY_USER_ID)) : null);
export const setUserId = (id) => { if (id != null && hasStorage()) safe(() => localStorage.setItem(KEY_USER_ID, id)); };
export const getUserRole = () => (hasStorage() ? safe(() => localStorage.getItem(KEY_USER_ROLE)) : null);
export const setUserRole = (role) => { if (role != null && hasStorage()) safe(() => localStorage.setItem(KEY_USER_ROLE, role)); };

export const clearAuth = () => {
  if (!hasStorage()) return;
  safe(() => {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_USER_ID);
    localStorage.removeItem(KEY_USER_ROLE);
  });
};
