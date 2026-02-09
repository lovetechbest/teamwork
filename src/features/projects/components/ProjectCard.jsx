import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.projectName}</h3>
      <p><strong>Company or Person:</strong> {project.companyOrPerson}</p>
      {project.summary && <p><strong>Summary:</strong> {project.summary}</p>}
      {project.stack && <p><strong>Stack:</strong> {project.stack}</p>}
      {project.githubUrl && (
        <p><strong>GitHub URL:</strong> <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">{project.githubUrl}</a></p>
      )}
      {project.communicationApp && <p><strong>Communication App:</strong> {project.communicationApp}</p>}
    </div>
  );
};

export default ProjectCard;
