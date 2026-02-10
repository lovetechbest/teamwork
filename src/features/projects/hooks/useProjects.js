import { useState, useEffect } from 'react';
import { createProject as apiCreateProject, fetchProjects as apiFetchProjects, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '../../../store/projects/projectActions';

/** Normalize API response to UI shape; response._id is the project id. */
const normalizeProject = (res) => ({
  _id: res._id,
  projectName: res.name,
  companyOrPerson: res.CompanyOrClientName,
  summary: res.summary,
  stack: res.stack,
  githubUrl: res.GitHubURL,
  communicationApp: res.communicationApp,
});

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const loadProjects = async () => {
    setFetchError(null);
    setFetchLoading(true);
    try {
      const data = await apiFetchProjects(filters);
      setProjects(data.map(normalizeProject));
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch projects';
      setFetchError(message);
      setProjects([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [JSON.stringify(filters)]);

  const addProject = async (projectData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiCreateProject(projectData);
      const project = normalizeProject(data);
      setProjects((prev) => [...prev, project]);
      return project;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create project';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiUpdateProject(id, projectData);
      const project = normalizeProject(data);
      setProjects((prev) => prev.map((p) => (p._id === id ? project : p)));
      return project;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update project';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    setError(null);
    setLoading(true);
    try {
      await apiDeleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete project';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    loadProjects,
    error,
    loading,
    fetchError,
    fetchLoading,
  };
};
