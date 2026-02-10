import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectList.css';

const ProjectList = ({ projects, onEdit, onDelete, editingId }) => {
  if (projects.length === 0) {
    return (
      <div className="projects-list">
        <p className="no-projects">No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className="projects-list">
      {projects.map((project) => {
        const projectId = project._id || project.id;
        return (
          <ProjectCard 
            key={projectId || project.name} 
            project={project}
            onEdit={onEdit ? () => onEdit(projectId) : null}
            onDelete={onDelete ? () => onDelete(projectId) : null}
            isEditing={editingId === projectId}
          />
        );
      })}
    </div>
  );
};

export default ProjectList;
