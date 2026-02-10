import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete, isEditing }) => {
  // Handle both API format (name, CompanyOrClientName, GitHubURL) and form format (projectName, companyOrPerson, githubUrl)
  const projectName = project.name || project.projectName;
  const companyName = project.CompanyOrClientName || project.companyOrPerson;
  const githubUrl = project.GitHubURL || project.githubUrl;
  const stack = Array.isArray(project.stack) ? project.stack.join(', ') : project.stack;

  return (
    <div className={`project-card ${isEditing ? 'editing' : ''}`}>
      <h3>{projectName}</h3>
      <p><strong>Company or Client:</strong> {companyName}</p>
      {project.summary && <p><strong>Summary:</strong> {project.summary}</p>}
      {stack && <p><strong>Stack:</strong> {stack}</p>}
      {githubUrl && (
        <p><strong>GitHub URL:</strong> <a href={githubUrl} target="_blank" rel="noopener noreferrer">{githubUrl}</a></p>
      )}
      {project.communicationApp && <p><strong>Communication App:</strong> {project.communicationApp}</p>}
      
      {(onEdit || onDelete) && (
        <div className="card-buttons">
          {onEdit && (
            <button 
              type="button" 
              onClick={onEdit} 
              className="modify-button"
              disabled={isEditing}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete} 
              className="delete-button"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
