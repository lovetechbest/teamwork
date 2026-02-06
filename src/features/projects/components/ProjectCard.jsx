import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.projectName}</h3>
      <p><strong>Country:</strong> {project.country}</p>
      <p><strong>Budget:</strong> ${project.budget}</p>
      <p><strong>Tech Stack:</strong> {project.techStack.join(', ')}</p>
      <p><strong>Deadline:</strong> {project.deadline}</p>
    </div>
  );
};

export default ProjectCard;
