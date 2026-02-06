import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ClientsPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [clients, setClients] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const onSubmit = (data) => {
        if (editingIndex !== null) {
            setClients(prev => prev.map((client, index) => 
                index === editingIndex ? data : client
            ));
            setEditingIndex(null);
        } else {
            setClients(prev => [...prev, data]);
        }
        reset();
    };

    const handleDelete = (index) => {
        setClients(prev => prev.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            reset();
        }
    };

    const handleModify = (index) => {
        const client = clients[index];
        setValue('name', client.name);
        setValue('email', client.email);
        setValue('company', client.company);
        setValue('description', client.description);
        setEditingIndex(index);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        reset();
    };

    return (
        <div className="clients-page">
            <div className="client-form-container">
                <h2>{editingIndex !== null ? 'Modify Client' : 'Add Client'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name">Client Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Client name is required' })}
                        />
                        {errors.name && <span className="error">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            {...register('company', { required: 'Company is required' })}
                        />
                        {errors.company && <span className="error">{errors.company.message}</span>}
                    </div>

                    <div>
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
                        <button type="submit">{editingIndex !== null ? 'Update Client' : 'Add Client'}</button>
                        {editingIndex !== null && (
                            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="clients-list">
                {clients.map((client, index) => (
                    <div key={index} className="client-card">
                        <h3>{client.name}</h3>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Company:</strong> {client.company}</p>
                        <p><strong>Description:</strong> {client.description}</p>
                        <div className="card-buttons">
                            <button 
                                type="button" 
                                onClick={() => handleModify(index)} 
                                className="modify-button"
                            >
                                Modify
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleDelete(index)} 
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientsPage;
