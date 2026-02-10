import api from "../../api";

/**
 * Create project. POST /projects/create
 * Request body: name, CompanyOrClientName, summary, stack (array), GitHubURL, communicationApp
 * Response includes _id (project id), userID, __v.
 * @param {Object} payload - Form data: projectName, companyOrPerson, summary, stack (string or array), githubUrl, communicationApp
 * @returns {Promise<Object>} Server response with _id as project id
 */
export const createProject = async (payload) => {
  const stack = Array.isArray(payload.stack)
    ? payload.stack
    : (payload.stack || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const res = await api.post("/projects/create", {
    name: payload.projectName,
    CompanyOrClientName: payload.companyOrPerson,
    summary: payload.summary,
    stack,
    GitHubURL: payload.githubUrl,
    communicationApp: payload.communicationApp,
  });
  return res.data;
};

/**
 * Get projects. GET /projects
 * Optional query params: name, CompanyOrClientName, userID, stack, communicationApp, summary
 * @param {Object} filters - { name?, CompanyOrClientName?, userID?, stack?, communicationApp?, summary? }
 * @returns {Promise<Object[]>} Array of project objects (each has _id, name, CompanyOrClientName, etc.)
 */
export const fetchProjects = async (filters = {}) => {
  const params = {};
  if (filters.name != null && filters.name !== "") params.name = filters.name;
  if (filters.CompanyOrClientName != null && filters.CompanyOrClientName !== "") params.CompanyOrClientName = filters.CompanyOrClientName;
  if (filters.userID != null && filters.userID !== "") params.userID = filters.userID;
  if (filters.stack != null && filters.stack !== "") params.stack = filters.stack;
  if (filters.communicationApp != null && filters.communicationApp !== "") params.communicationApp = filters.communicationApp;
  if (filters.summary != null && filters.summary !== "") params.summary = filters.summary;

  const res = await api.get("/projects", { params });
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data?.projects && Array.isArray(data.projects)) return data.projects;
  return [];
};

/**
 * Update project. PUT /projects/update/:id
 * @param {string} id - Project _id
 * @param {Object} payload - Same shape as create (projectName, companyOrPerson, summary, stack, githubUrl, communicationApp)
 * @returns {Promise<Object>} Updated project from server
 */
export const updateProject = async (id, payload) => {
  const stack = Array.isArray(payload.stack)
    ? payload.stack
    : (payload.stack || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const res = await api.put(`/projects/update/${id}`, {
    name: payload.projectName,
    CompanyOrClientName: payload.companyOrPerson,
    summary: payload.summary,
    stack,
    GitHubURL: payload.githubUrl,
    communicationApp: payload.communicationApp,
  });
  return res.data;
};

/**
 * Delete project. DELETE /projects/delete?projectIds=:id
 * @param {string} id - Project _id
 */
export const deleteProject = async (id) => {
  await api.delete("/projects/delete", { params: { projectIds: id } });
};
