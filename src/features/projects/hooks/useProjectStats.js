import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../store/projects/projectActions';
import { isHighman } from '../../../utils/roles';

export const useProjectStats = () => {
  const dispatch = useDispatch();
  const { userId, role } = useSelector(state => state.auth);
  const userRole = role || localStorage.getItem("userRole");
  const isManager = isHighman(userRole);
  
  const [createdCount, setCreatedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build filters: developers see only their projects, managers see all
        const filters = {};
        if (!isManager && userId) {
          filters.userID = userId;
        }
        // Managers: no filter = see all projects
        
        const projects = await dispatch(fetchProjects(filters));
        
        if (projects && Array.isArray(projects)) {
          setCreatedCount(projects.length);
        } else {
          setCreatedCount(0);
        }
      } catch (err) {
        setError(err.message || "Failed to load project stats");
        setCreatedCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadProjectStats();
  }, [dispatch, userId, isManager]);

  return {
    createdCount,
    loading,
    error,
  };
};
