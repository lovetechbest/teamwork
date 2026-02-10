import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './ProjectForm.css';

const ProjectForm = ({ onSubmit, editingProject, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Pre-fill form when editing
  useEffect(() => {
    if (editingProject) {
      const stackValue = Array.isArray(editingProject.stack) 
        ? editingProject.stack.join(', ') 
        : editingProject.stack || '';
      
      reset({
        name: editingProject.name || '',
        CompanyOrClientName: editingProject.CompanyOrClientName || '',
        summary: editingProject.summary || '',
        stack: stackValue,
        GitHubURL: editingProject.GitHubURL || '',
        communicationApp: editingProject.communicationApp || '',
      });
    } else {
      reset();
    }
  }, [editingProject, reset]);

  const handleFormSubmit = (data) => {
    // Transform form data to match API structure
    const apiPayload = {
      name: data.name,
      CompanyOrClientName: data.CompanyOrClientName,
      summary: data.summary,
      stack: data.stack ? data.stack.split(',').map(s => s.trim()).filter(s => s) : [],
      GitHubURL: data.GitHubURL,
      communicationApp: data.communicationApp,
    };
    
    onSubmit(apiPayload);
    if (!editingProject) {
      reset();
    }
  };

  return (
    <div className="project-form-container">
      <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-field">
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Project name is required' })}
            placeholder="Enter project name"
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="CompanyOrClientName">Company or Client Name</label>
          <input
            type="text"
            id="CompanyOrClientName"
            {...register('CompanyOrClientName', { required: 'Company or client name is required' })}
            placeholder="Enter company or client name"
          />
          {errors.CompanyOrClientName && <span className="error">{errors.CompanyOrClientName.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            rows="4"
            {...register('summary', { required: 'Summary is required' })}
            placeholder="Enter project summary"
          />
          {errors.summary && <span className="error">{errors.summary.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="stack">Stack</label>
          <input
            type="text"
            id="stack"
            {...register('stack', { required: 'Stack is required' })}
            placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
          />
          {errors.stack && <span className="error">{errors.stack.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="GitHubURL">GitHub URL</label>
          <input
            type="url"
            id="GitHubURL"
            {...register('GitHubURL', { 
              required: 'GitHub URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            placeholder="https://github.com/username/repo"
          />
          {errors.GitHubURL && <span className="error">{errors.GitHubURL.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="communicationApp">Communication App</label>
          <input
            type="text"
            id="communicationApp"
            {...register('communicationApp', { required: 'Communication app is required' })}
            placeholder="e.g., Slack, Discord, Teams, Zoom"
          />
          {errors.communicationApp && <span className="error">{errors.communicationApp.message}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit">{editingProject ? 'Update' : 'Submit'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
