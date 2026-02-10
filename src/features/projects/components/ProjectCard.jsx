import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onModify, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.projectName}"?`)) {
      onDelete(project._id);
    }
  };

  return (
    <div className="project-card">
      <div className="project-card__header">
        <h3>{project.projectName}</h3>
        <div className="project-card__actions">
          {onModify && (
            <button type="button" onClick={() => onModify(project)} className="project-card__btn project-card__btn--modify">
              Modify
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={handleDelete} className="project-card__btn project-card__btn--delete">
              Delete
            </button>
          )}
        </div>
      </div>
      <p><strong>Company or Person:</strong> {project.companyOrPerson}</p>
      {project.summary && <p><strong>Summary:</strong> {project.summary}</p>}
      {project.stack && (
        <p><strong>Stack:</strong> {Array.isArray(project.stack) ? project.stack.join(', ') : project.stack}</p>
      )}
      {project.githubUrl && (
        <p><strong>GitHub URL:</strong> <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">{project.githubUrl}</a></p>
      )}
      {project.communicationApp && <p><strong>Communication App:</strong> {project.communicationApp}</p>}
    </div>
  );
};

export default ProjectCard;
