import React from 'react';
import { useClients } from './hooks/useClients';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import './ClientsPage.css';

const ClientsPage = () => {
  const {
    clients,
    editingIndex,
    addClient,
    updateClient,
    deleteClient,
    startEditing,
    cancelEditing,
  } = useClients();

  const handleSubmit = (data) => {
    if (editingIndex !== null) {
      updateClient(editingIndex, data);
    } else {
      addClient(data);
    }
  };

  const handleModify = (index) => {
    startEditing(index);
  };

  const handleCancel = () => {
    cancelEditing();
  };

  return (
    <div className="clients-page">
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        editingIndex={editingIndex}
        defaultValues={editingIndex !== null ? clients[editingIndex] : null}
      />

      <ClientList
        clients={clients}
        onModify={handleModify}
        onDelete={deleteClient}
      />
    </div>
  );
};

export default ClientsPage;
