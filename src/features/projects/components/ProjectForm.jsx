import React from 'react';
import { useForm } from 'react-hook-form';
import './ProjectForm.css';

const ProjectForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="project-form-container">
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-field">
          <label htmlFor="project-name">Project Name</label>
          <input
            type="text"
            id="project-name"
            {...register('projectName', { required: 'Project name is required' })}
            placeholder="Enter project name"
          />
          {errors.projectName && <span className="error">{errors.projectName.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="companyOrPerson">Company or Person</label>
          <input
            type="text"
            id="companyOrPerson"
            {...register('companyOrPerson', { required: 'Company or person is required' })}
            placeholder="Enter company or person name"
          />
          {errors.companyOrPerson && <span className="error">{errors.companyOrPerson.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            rows="4"
            {...register('summary', { required: 'Summary is required' })}
            placeholder="Enter project summary (milestones or budget or any other details)"
          />
          {errors.summary && <span className="error">{errors.summary.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="stack">Stack</label>
          <input
            type="text"
            id="stack"
            {...register('stack', { required: 'Stack is required' })}
            placeholder="Enter technology stack"
          />
          {errors.stack && <span className="error">{errors.stack.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="githubUrl">GitHub URL</label>
          <input
            type="url"
            id="githubUrl"
            {...register('githubUrl', { 
              required: 'GitHub URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            placeholder="https://github.com/username/repo"
          />
          {errors.githubUrl && <span className="error">{errors.githubUrl.message}</span>}
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;
