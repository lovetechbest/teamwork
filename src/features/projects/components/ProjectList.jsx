import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import './ProjectList.css';

const ProjectList = ({ projects, updateProject, deleteProject, loading }) => {
  const [editingProject, setEditingProject] = useState(null);

  const handleEditSubmit = async (data) => {
    if (!editingProject?._id) return;
    await updateProject(editingProject._id, data);
    setEditingProject(null);
  };

  if (projects.length === 0) {
    return (
      <div className="projects-list">
        <p className="no-projects">No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <>
      <div className="projects-list">
        {projects.map((project) => (
          <ProjectCard
            key={project._id ?? project.projectName}
            project={project}
            onModify={updateProject ? () => setEditingProject(project) : undefined}
            onDelete={deleteProject}
          />
        ))}
      </div>
      {editingProject && (
        <div className="modal-overlay project-edit-modal-overlay" onClick={() => setEditingProject(null)}>
          <div className="modal-content project-edit-modal" onClick={(e) => e.stopPropagation()}>
            <ProjectForm
              defaultValues={editingProject}
              title="Edit Project"
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingProject(null)}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;
