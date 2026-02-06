import React from 'react';
import ClientCard from './ClientCard';
import './ClientList.css';

const ClientList = ({ clients, onModify, onDelete }) => {
  if (clients.length === 0) {
    return (
      <div className="clients-list">
        <p className="no-clients">No clients yet. Add your first client!</p>
      </div>
    );
  }

  return (
    <div className="clients-list">
      {clients.map((client, index) => (
        <ClientCard
          key={index}
          client={client}
          onModify={() => onModify(index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
};

export default ClientList;
