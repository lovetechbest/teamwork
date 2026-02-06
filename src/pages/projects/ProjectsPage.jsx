import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ProjectsPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [projects, setProjects] = useState([]);

    const onSubmit = (data) => {
        if (!Array.isArray(data.techStack)) {
            data.techStack = [data.techStack];
        }
        setProjects(prev => [...prev, data]);
        reset();
    };

    return (
        <div className="projects-page">
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
                            {...register('budget', { 
                                required: 'Budget is required', 
                                min: { value: 0, message: 'Budget must be positive' } 
                            })}
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

            <div className="projects-list">
                {projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <h3>{project.projectName}</h3>
                        <p><strong>Country:</strong> {project.country}</p>
                        <p><strong>Budget:</strong> ${project.budget}</p>
                        <p><strong>Tech Stack:</strong> {project.techStack.join(', ')}</p>
                        <p><strong>Deadline:</strong> {project.deadline}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
