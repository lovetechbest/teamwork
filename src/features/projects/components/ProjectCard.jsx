import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.projectName}</h3>
      <p><strong>Company or Person:</strong> {project.companyOrPerson}</p>
      <p><strong>Budget:</strong> ${project.budget}</p>
      <p><strong>Deadline:</strong> {project.deadline}</p>
    </div>
  );
};

export default ProjectCard;
