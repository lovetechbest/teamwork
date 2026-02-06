import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './ClientForm.css';

const ClientForm = ({ onSubmit, onCancel, editingIndex, defaultValues }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: defaultValues || {}
  });

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach(key => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="client-form-container">
      <h2>{editingIndex !== null ? 'Modify Client' : 'Add Client'}</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-field">
          <label htmlFor="name">Client Name</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Client name is required' })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            {...register('company', { required: 'Company is required' })}
          />
          {errors.company && <span className="error">{errors.company.message}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            {...register('description', { required: 'Description is required' })}
            placeholder="Enter a brief description"
          />
          {errors.description && <span className="error">{errors.description.message}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editingIndex !== null ? 'Update Client' : 'Add Client'}
          </button>
          {editingIndex !== null && (
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
