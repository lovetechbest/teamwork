// Token manager - stores accessToken in memory (not localStorage)
// RefreshToken is stored in httpOnly cookie by server

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};
