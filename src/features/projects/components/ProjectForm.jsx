import React from 'react';
import { useForm } from 'react-hook-form';
import './ProjectForm.css';

const ProjectForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = (data) => {
    if (!Array.isArray(data.techStack)) {
      data.techStack = [data.techStack];
    }
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
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            {...register('country', { required: 'Country is required' })}
            placeholder="Enter country"
          />
          {errors.country && <span className="error">{errors.country.message}</span>}
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
          <label htmlFor="tech-stack">Technology Stack</label>
          <select
            id="tech-stack"
            {...register('techStack', { required: 'At least one technology is required' })}
            multiple
          >
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Vue">Vue</option>
            <option value="Angular">Angular</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
          </select>
          {errors.techStack && <span className="error">{errors.techStack.message}</span>}
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
