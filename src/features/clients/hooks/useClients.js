import { useState } from 'react';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addClient = (clientData) => {
    setClients(prev => [...prev, clientData]);
    setEditingIndex(null);
  };

  const updateClient = (index, clientData) => {
    setClients(prev => prev.map((client, i) => 
      i === index ? clientData : client
    ));
    setEditingIndex(null);
  };

  const deleteClient = (index) => {
    setClients(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    return clients[index];
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  return {
    clients,
    editingIndex,
    addClient,
    updateClient,
    deleteClient,
    startEditing,
    cancelEditing,
  };
};
