import React from 'react';
import { useProjects } from './hooks/useProjects';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { projects, addProject } = useProjects();

  return (
    <div className="projects-page">
      <ProjectForm onSubmit={addProject} />
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
