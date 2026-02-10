import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../../store/projects/projectActions';
import { isHighman } from '../../../utils/roles';

export const useProjects = (customFilters = null) => {
  const dispatch = useDispatch();
  const { userId, role } = useSelector(state => state.auth);
  const userRole = role || localStorage.getItem("userRole");
  const isManager = isHighman(userRole);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects on mount and when userId changes
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      
      // Build filters: developers see only their projects, managers see all
      let filters = {};
      
      // Merge custom filters with role-based filters
      if (customFilters) {
        filters = { ...customFilters };
      }
      
      // Developers: always filter by their userID (unless explicitly filtered by another userID)
      if (!isManager && userId && !filters.userID) {
        filters.userID = userId;
      }
      // Managers: no userID filter by default = see all projects
      
      const fetchedProjects = await dispatch(fetchProjects(filters));
      
      if (fetchedProjects) {
        setProjects(fetchedProjects);
      } else {
        setError("Failed to load projects");
      }
      
      setLoading(false);
    };

    loadProjects();
  }, [dispatch, userId, isManager, customFilters]);

  const addProject = async (projectData) => {
    try {
      const result = await dispatch(createProject(projectData));
      if (result) {
        // Refresh projects list after creating with same filters
        let filters = {};
        if (customFilters) {
          filters = { ...customFilters };
        }
        if (!isManager && userId && !filters.userID) {
          filters.userID = userId;
        }
        
        const fetchedProjects = await dispatch(fetchProjects(filters));
        if (fetchedProjects) {
          setProjects(fetchedProjects);
        }
        return result;
      }
      return null;
    } catch (err) {
      setError(err.message || "Failed to create project");
      return null;
    }
  };

  const updateProjectData = async (id, projectData) => {
    try {
      const result = await dispatch(updateProject(id, projectData));
      if (result) {
        // Refresh projects list after updating with same filters
        let filters = {};
        if (customFilters) {
          filters = { ...customFilters };
        }
        if (!isManager && userId && !filters.userID) {
          filters.userID = userId;
        }
        
        const fetchedProjects = await dispatch(fetchProjects(filters));
        if (fetchedProjects) {
          setProjects(fetchedProjects);
        }
        return result;
      }
      return null;
    } catch (err) {
      setError(err.message || "Failed to update project");
      return null;
    }
  };

  const removeProject = async (id) => {
    try {
      const success = await dispatch(deleteProject(id));
      if (success) {
        // Refresh projects list after deleting with same filters
        let filters = {};
        if (customFilters) {
          filters = { ...customFilters };
        }
        if (!isManager && userId && !filters.userID) {
          filters.userID = userId;
        }
        
        const fetchedProjects = await dispatch(fetchProjects(filters));
        if (fetchedProjects) {
          setProjects(fetchedProjects);
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || "Failed to delete project");
      return false;
    }
  };

  const refreshProjects = async (additionalFilters = {}) => {
    setLoading(true);
    setError(null);
    
    let filters = {};
    if (customFilters) {
      filters = { ...customFilters, ...additionalFilters };
    } else if (!isManager && userId) {
      filters = { userID: userId, ...additionalFilters };
    } else {
      filters = additionalFilters;
    }
    
    const fetchedProjects = await dispatch(fetchProjects(filters));
    if (fetchedProjects) {
      setProjects(fetchedProjects);
    } else {
      setError("Failed to refresh projects");
    }
    setLoading(false);
  };

  return {
    projects,
    addProject,
    updateProject: updateProjectData,
    deleteProject: removeProject,
    refreshProjects,
    loading,
    error,
  };
};
