import React from 'react';
import './ClientCard.css';

const ClientCard = ({ client, onModify, onDelete }) => {
  return (
    <div className="client-card">
      <h3>{client.name}</h3>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Country:</strong> {client.country}</p>
      <p><strong>Status:</strong> {client.status === 'Active' ? 'Active now' : client.status === 'Pending' ? 'Needs care' : client.status || 'Active now'}</p>
      <p><strong>Description:</strong> {client.description}</p>
      <div className="card-buttons">
        <button 
          type="button" 
          onClick={onModify} 
          className="modify-button"
        >
          Modify
        </button>
        <button 
          type="button" 
          onClick={onDelete} 
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
