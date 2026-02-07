import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from '../../../store/users/userActions';

const normalizeUser = (u) => ({
  id: u._id || u.id || u.uniqueID,
  name: u.name || u.userName || '',
  userID: u.userID || u.userId || u.username || '',
  role: u.role || u.userRole || '',
});

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers((Array.isArray(data) ? data : []).map(normalizeUser));
    } catch (err) {
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (payload) => {
    await createUser(payload);
    await loadUsers();
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    await loadUsers();
  };

  const handleUpdateUser = async (userId, payload) => {
    await updateUser(userId, payload);
    await loadUsers();
  };

  return {
    users,
    loading,
    error,
    refresh: loadUsers,
    createUser: handleCreateUser,
    deleteUser: handleDeleteUser,
    updateUser: handleUpdateUser,
  };
};
