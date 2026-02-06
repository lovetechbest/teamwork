import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectList.css';

const ProjectList = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="projects-list">
        <p className="no-projects">No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className="projects-list">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
