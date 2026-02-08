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
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            {...register('budget', { 
              required: 'Budget is required', 
              min: { value: 0, message: 'Budget must be positive' } 
            })}
            placeholder="Enter project budget"
          />
          {errors.budget && <span className="error">{errors.budget.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            {...register('deadline', { required: 'Deadline is required' })}
          />
          {errors.deadline && <span className="error">{errors.deadline.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;
