import api from "../../api";

/**
 * Create client. POST /clients/create
 * Returns created client with _id from server.
 */
export const createClient = async (payload) => {
  const res = await api.post("/clients/create", {
    name: payload.name,
    email: payload.email,
    country: payload.country,
    status: payload.status || "Active",
    description: payload.description,
  });
  return res.data;
};

/**
 * Update client. PUT /clients/update/:id
 * @param {string} id - Client _id from server
 * @param {Object} payload - { name, email, country, status, description }
 */
export const updateClient = async (id, payload) => {
  const res = await api.put(`/clients/update/${id}`, payload);
  return res.data;
};

/**
 * Delete client. DELETE /clients/delete?clientIds=:id
 * @param {string} id - Client _id from server
 */
export const deleteClient = async (id) => {
  await api.delete("/clients/delete", { params: { clientIds: id } });
};

/**
 * Fetch clients. GET /clients with optional filters.
 * userID and country: comma-separated for multiple values.
 * @param {Object} filters - { userID?: string, userIDs?: string[], country?: string }
 */
export const fetchClients = async (filters = {}) => {
  const params = {};
  const uid = filters.userIDs?.length ? filters.userIDs : (filters.userID ? [filters.userID] : null);
  if (uid?.length) params.userID = Array.isArray(uid) ? uid.join(",") : uid;
  if (filters.country) params.country = filters.country;

  try {
    const res = await api.get("/clients", { params });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data?.clients && Array.isArray(data.clients)) return data.clients;
    return [];
  } catch (err) {
    if (err?.response?.status === 404 && err?.response?.data?.message === "No clients found") {
      return [];
    }
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err?.message || "Failed to fetch clients";
    throw new Error(status ? `fetch clients ${status}: ${msg}` : msg);
  }
};
