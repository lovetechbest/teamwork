import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserId, getUserRole } from '../../../store/auth/authStorage';
import { createClient as apiCreateClient, updateClient as apiUpdateClient, deleteClient as apiDeleteClient, fetchClients } from '../../../store/clients/clientActions';
import { isHighman } from '../../../utils/roles';

export const useClients = (filters = {}) => {
  const { userId, role } = useSelector((state) => state.auth);
  const currentUserId = userId || getUserId();
  const userRole = role || getUserRole();
  const highman = isHighman(userRole);

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filterUserIDs = [], filterCountry } = filters;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        if (highman) {
          if (filterUserIDs?.length) params.userID = filterUserIDs;
          if (filterCountry) params.country = filterCountry;
        } else {
          if (currentUserId) params.userID = currentUserId;
        }
        const data = await fetchClients(params);
        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || 'Failed to load clients');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [highman, currentUserId, filterUserIDs, filterCountry]);

  const addClient = async (clientData) => {
    try {
      setError(null);
      const created = await apiCreateClient(clientData);
      setClients(prev => [...prev, created]);
      setEditingId(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '';
      const isDuplicateEmail = [400, 409].includes(err?.response?.status) ||
        /email|duplicate|already|exist|server error/i.test(msg);
      setError(isDuplicateEmail ? "Client with same email already exist in the server. You don't need to add." : (msg || 'Failed to create client'));
      throw err;
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      setError(null);
      const updated = await apiUpdateClient(id, clientData);
      setClients(prev => prev.map(c => (c._id === id ? { ...c, ...updated } : c)));
      setEditingId(null);
    } catch (err) {
      setError(err?.message || 'Failed to update client');
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      setError(null);
      await apiDeleteClient(id);
      setClients(prev => prev.filter(c => c._id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err?.message || 'Failed to delete client');
      throw err;
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
    return clients.find(c => c._id === id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return {
    clients,
    editingId,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    startEditing,
    cancelEditing,
    isHighman: highman,
  };
};
