import React, { useState, useEffect } from 'react';
import { useClients } from './hooks/useClients';
import { fetchUsers } from '../../store/users/userActions';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import './ClientsPage.css';

const ClientsPage = () => {
  const [filters, setFilters] = useState({ filterUserIDs: [], filterCountry: '' });
  const [countryInput, setCountryInput] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((p) => ({ ...p, filterCountry: countryInput.trim() }));
    }, 400);
    return () => clearTimeout(t);
  }, [countryInput]);

  const selectUserFilter = (userID) => {
    if (!userID) {
      setFilters((p) => ({ ...p, filterUserIDs: [] }));
      return;
    }
    setFilters((p) => {
      const ids = p.filterUserIDs || [];
      const has = ids.includes(userID);
      return { ...p, filterUserIDs: has ? ids.filter((x) => x !== userID) : [...ids, userID] };
    });
  };

  const {
    clients,
    editingId,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    startEditing,
    cancelEditing,
    isHighman,
  } = useClients(filters);

  useEffect(() => {
    if (isHighman) {
      fetchUsers().then(setUsers).catch(() => setUsers([]));
    }
  }, [isHighman]);

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await updateClient(editingId, data);
      } else {
        await addClient(data);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleModify = (id) => {
    startEditing(id);
  };

  const handleCancel = () => {
    cancelEditing();
  };

  const editingClient = editingId ? clients.find(c => c._id === editingId) : null;

  return (
    <div className="clients-page">
      {isHighman && (
        <div className="clients-filters">
          <div className="clients-filter-users">
            <span className="filter-label">User</span>
            <button
              type="button"
              className={`user-chip ${!filters.filterUserIDs?.length ? 'active' : ''}`}
              onClick={() => selectUserFilter()}
            >
              All
            </button>
            {users.map((u) => {
              const uid = u.userID || u.userId || u._id;
              const selected = filters.filterUserIDs?.includes(uid);
              return (
                <button
                  key={uid}
                  type="button"
                  className={`user-chip ${selected ? 'active' : ''}`}
                  onClick={() => selectUserFilter(uid)}
                >
                  {u.name || u.userID || '—'}
                </button>
              );
            })}
          </div>
          <label className="clients-filter-country">
            <span className="filter-label">Country</span>
            <input
              type="text"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              placeholder="Country"
              className="filter-input"
            />
          </label>
        </div>
      )}
      {error && <p className="clients-error">{error}</p>}
      <div className="clients-layout">
        <aside className="clients-form-col">
          <ClientForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingIndex={editingId}
            defaultValues={editingClient}
          />
        </aside>
        <main className="clients-list-col">
          {loading && clients.length === 0 ? (
            <p className="clients-loading">Loading clients...</p>
          ) : (
            <ClientList
              clients={clients}
              onModify={handleModify}
              onDelete={deleteClient}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientsPage;
