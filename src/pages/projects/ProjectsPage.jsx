import React from 'react';
import { useForm } from 'react-hook-form';

const ProjectForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        // Here you can add logic to handle the form submission (e.g., send data to your server)
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="project-name">Project Name</label>
                    <input
                        type="text"
                        id="project-name"
                        {...register('projectName', { required: 'Project name is required' })}
                        placeholder="Enter project name"
                    />
                    {errors.projectName && <span className="error">{errors.projectName.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        {...register('country', { required: 'Country is required' })}
                        placeholder="Enter country"
                    />
                    {errors.country && <span className="error">{errors.country.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="budget">Budget</label>
                    <input
                        type="number"
                        id="budget"
                        {...register('budget', { required: 'Budget is required', min: { value: 0, message: 'Budget must be a positive number' } })}
                        placeholder="Enter project budget"
                    />
                    {errors.budget && <span className="error">{errors.budget.message}</span>}
                </div>

                <div className="form-group">
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

                <div className="form-group">
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
