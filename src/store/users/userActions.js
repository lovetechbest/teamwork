import api from "../../api";

/**
 * Fetch users. GET /users/get-users with optional filters.
 * @param {Object} filters - Optional { role, userID, name }
 */
export const fetchUsers = async (filters = {}) => {
  const params = {};
  if (filters.role) params.role = filters.role;
  if (filters.userID) params.userID = filters.userID;
  if (filters.name) params.name = filters.name;

  const paths = ["/users/get-users/", "/users/get-users"];
  let lastErr;
  for (const path of paths) {
    try {
      const res = await api.get(path, { params });
      const data = res?.data;
      if (Array.isArray(data)) return data;
      if (data?.users && Array.isArray(data.users)) return data.users;
      return [];
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 403) {
        throw new Error("Access denied (403). Backend may restrict Team Leader from get-users.");
      }
      if (status === 401) throw err;
    }
  }
  const status = lastErr?.response?.status;
  const msg = lastErr?.response?.data?.message || lastErr?.message || "Failed to fetch users";
  throw new Error(status ? `get-users ${status}: ${msg}` : msg);
};

/**
 * Create user. POST /users/create
 */
export const createUser = async (payload) => {
  const res = await api.post("/users/create", {
    name: payload.name,
    userID: payload.userID,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    role: payload.role,
  });
  return res.data;
};

/**
 * Delete user. DELETE /users/delete/:id
 */
export const deleteUser = async (userId) => {
  await api.delete(`/users/delete/${userId}`);
};

/**
 * Update user (highman editing another user). PUT /users/update/:id
 */
export const updateUser = async (userId, payload) => {
  const body = {};
  if (payload.name != null && payload.name !== '') body.name = payload.name;
  if (payload.userID != null && payload.userID !== '') body.userID = payload.userID;
  if (payload.password) body.password = payload.password;
  if (payload.role != null && payload.role !== '') body.role = payload.role;

  const res = await api.put(`/users/update/${userId}`, body);
  return res.data;
};
