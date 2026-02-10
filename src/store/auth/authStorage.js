/**
 * Persisted auth storage so login survives browser close.
 * Uses localStorage (not sessionStorage) for accessToken, userId, userRole.
 */
const KEY_ACCESS = "accessToken";
const KEY_USER_ID = "userId";
const KEY_USER_ROLE = "userRole";

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const getAccessToken = () => safe(() => localStorage.getItem(KEY_ACCESS));
export const setAccessToken = (token) => { if (token != null) safe(() => localStorage.setItem(KEY_ACCESS, token)); };
export const getUserId = () => safe(() => localStorage.getItem(KEY_USER_ID));
export const setUserId = (id) => { if (id != null) safe(() => localStorage.setItem(KEY_USER_ID, id)); };
export const getUserRole = () => safe(() => localStorage.getItem(KEY_USER_ROLE));
export const setUserRole = (role) => { if (role != null) safe(() => localStorage.setItem(KEY_USER_ROLE, role)); };

export const clearAuth = () => {
  safe(() => {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_USER_ID);
    localStorage.removeItem(KEY_USER_ROLE);
  });
};
