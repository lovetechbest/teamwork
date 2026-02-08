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
      {clients.map((client) => (
        <ClientCard
          key={client._id}
          client={client}
          onModify={() => onModify(client._id)}
          onDelete={() => onDelete(client._id)}
        />
      ))}
    </div>
  );
};

export default ClientList;
