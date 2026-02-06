import { useState } from 'react';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  const addProject = (projectData) => {
    setProjects(prev => [...prev, projectData]);
  };

  return {
    projects,
    addProject,
  };
};
