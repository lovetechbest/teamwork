import api from "../../api";
import { getAccessToken } from "../../utils/tokenManager";

export const FETCH_PROJECTS_START = "FETCH_PROJECTS_START";
export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
export const FETCH_PROJECTS_FAIL = "FETCH_PROJECTS_FAIL";

export const CREATE_PROJECT_START = "CREATE_PROJECT_START";
export const CREATE_PROJECT_SUCCESS = "CREATE_PROJECT_SUCCESS";
export const CREATE_PROJECT_FAIL = "CREATE_PROJECT_FAIL";

export const UPDATE_PROJECT_START = "UPDATE_PROJECT_START";
export const UPDATE_PROJECT_SUCCESS = "UPDATE_PROJECT_SUCCESS";
export const UPDATE_PROJECT_FAIL = "UPDATE_PROJECT_FAIL";

export const DELETE_PROJECT_START = "DELETE_PROJECT_START";
export const DELETE_PROJECT_SUCCESS = "DELETE_PROJECT_SUCCESS";
export const DELETE_PROJECT_FAIL = "DELETE_PROJECT_FAIL";

/**
 * Fetch projects from server with filters
 * @param {Object} filters - Filter query parameters: name, CompanyOrClientName, userID, stack, communicationApp, summary
 *                           All parameters are optional filters. Empty/undefined values are not included in the request.
 */
export const fetchProjects = (filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_PROJECTS_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: FETCH_PROJECTS_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    // Build query params - only include non-empty filter values
    const params = {};
    if (filters.name && filters.name.trim()) params.name = filters.name.trim();
    if (filters.CompanyOrClientName && filters.CompanyOrClientName.trim()) params.CompanyOrClientName = filters.CompanyOrClientName.trim();
    if (filters.userID && filters.userID.trim()) params.userID = filters.userID.trim();
    if (filters.stack && filters.stack.trim()) params.stack = filters.stack.trim();
    if (filters.communicationApp && filters.communicationApp.trim()) params.communicationApp = filters.communicationApp.trim();
    if (filters.summary && filters.summary.trim()) params.summary = filters.summary.trim();

    const res = await api.get("/projects/", { params });

    // Handle array or object response
    const projects = Array.isArray(res.data) ? res.data : res.data?.projects || res.data?.data || [];

    dispatch({
      type: FETCH_PROJECTS_SUCCESS,
      payload: projects,
    });

    return projects;
  } catch (err) {
    let message = "Failed to fetch projects";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to fetch projects";
    }

    dispatch({
      type: FETCH_PROJECTS_FAIL,
      payload: message,
    });

    return null;
  }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data: name, CompanyOrClientName, summary, stack, GitHubURL, communicationApp
 */
export const createProject = (projectData) => async (dispatch) => {
  dispatch({ type: CREATE_PROJECT_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: CREATE_PROJECT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    const res = await api.post("/projects/create", projectData);

    dispatch({
      type: CREATE_PROJECT_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to create project";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to create project";
    }

    dispatch({
      type: CREATE_PROJECT_FAIL,
      payload: message,
    });

    return null;
  }
};

/**
 * Update an existing project
 * @param {string} id - Project _id from server
 * @param {Object} projectData - Project data: name, CompanyOrClientName, summary, stack, GitHubURL, communicationApp
 */
export const updateProject = (id, projectData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROJECT_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: UPDATE_PROJECT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    const res = await api.put(`/projects/update/${id}`, projectData);

    dispatch({
      type: UPDATE_PROJECT_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to update project";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to update project";
    }

    dispatch({
      type: UPDATE_PROJECT_FAIL,
      payload: message,
    });

    return null;
  }
};

/**
 * Delete a project
 * @param {string} id - Project _id from server
 */
export const deleteProject = (id) => async (dispatch) => {
  dispatch({ type: DELETE_PROJECT_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: DELETE_PROJECT_FAIL,
        payload: errorMsg,
      });
      return false;
    }

    await api.delete(`/projects/${id}`);

    dispatch({
      type: DELETE_PROJECT_SUCCESS,
      payload: id,
    });

    return true;
  } catch (err) {
    let message = "Failed to delete project";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to delete project";
    }

    dispatch({
      type: DELETE_PROJECT_FAIL,
      payload: message,
    });

    return false;
  }
};
