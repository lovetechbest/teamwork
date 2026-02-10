import React, { useState, useEffect, useMemo } from 'react';
import { useClients } from './hooks/useClients';
import { fetchUsers } from '../../store/users/userActions';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import { useSelector } from 'react-redux';
import { isHighman } from '../../utils/roles';
import './ClientsPage.css';

const ClientsPage = () => {
  const [filters, setFilters] = useState({ filterUserIDs: [], filterCountry: '' });
  const [countryInput, setCountryInput] = useState('');
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  
  const { role } = useSelector((state) => state.auth);
  const userRole = role || localStorage.getItem('userRole');

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

  // Group clients by user (for highman only)
  // Since clients may not have userID field, we group by email
  // (business rule: one user can't create two clients with same email)
  const groupClientsByUser = (clientsList) => {
    if (!isHighman || !clientsList || clientsList.length === 0) {
      return [];
    }
    
    // Create a map of userID to user name for quick lookup
    const userMap = new Map();
    users.forEach(u => {
      const uid = u.userID || u.userId || u._id;
      if (uid) userMap.set(uid, u.name || u.userID || 'Unknown');
    });
    
    // Group by email (since same email = same user per business rules)
    // If we have active user filters, all clients belong to those users
    const activeFilterUserIDs = filters.filterUserIDs || [];
    
    const grouped = clientsList.reduce((acc, client) => {
      if (!client || !client._id) return acc; // Skip invalid clients
      
      // Try to get userID from client first
      let userId = client.userID || client.userId || client.user_id || 
                   client.createdBy || client.createdByUser || 
                   client.user?._id || client.user?.userID || client.user?.userId;
      
      // If we're filtering by a single user, all clients belong to that user
      if (!userId && activeFilterUserIDs.length === 1) {
        userId = activeFilterUserIDs[0];
      }
      
      // If still no userId, group by email (normalized)
      // Same email = same user, so we can use email as grouping key
      if (!userId) {
        const email = (client.email || '').toLowerCase().trim();
        userId = email || `unknown-${client._id}`;
      }
      
      // Get user name
      let userName = userMap.get(userId);
      if (!userName) {
        // Try to get from client object
        userName = client.userName || client.user_name ||
                   client.user?.name || client.user?.userID;
        
        // If still no name, derive from email or use fallback
        if (!userName) {
          if (typeof userId === 'string' && userId.includes('@')) {
            userName = userId.split('@')[0];
          } else if (userId && !userId.startsWith('unknown')) {
            userName = `User ${String(userId).slice(-8)}`;
          } else {
            userName = 'Unknown User';
          }
        }
      }
      
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName,
          clients: []
        };
      }
      acc[userId].clients.push(client);
      return acc;
    }, {});

    const result = Object.values(grouped);
    if (result.length === 0 && clientsList.length > 0) {
      // If grouping failed but we have clients, return a fallback group
      return [{
        userId: 'all',
        userName: 'All Clients',
        clients: clientsList
      }];
    }
    
    return result.sort((a, b) => {
      const aName = a.userName.toLowerCase();
      const bName = b.userName.toLowerCase();
      return aName.localeCompare(bName);
    });
  };

  const groupedClients = useMemo(() => {
    if (!isHighman) return null;
    try {
      // Group clients by user (for highman only)
      if (!clients || clients.length === 0) return [];
      
      // Create a map of userID to user name for quick lookup
      const userMap = new Map();
      users.forEach(u => {
        const uid = u.userID || u.userId || u._id;
        if (uid) userMap.set(uid, u.name || u.userID || 'Unknown');
      });
      
      // Group by email (since same email = same user per business rules)
      const activeFilterUserIDs = filters.filterUserIDs || [];
      
      const grouped = clients.reduce((acc, client) => {
        if (!client || !client._id) return acc;
        
        let userId = client.userID || client.userId || client.user_id || 
                     client.createdBy || client.createdByUser || 
                     client.user?._id || client.user?.userID || client.user?.userId;
        
        if (!userId && activeFilterUserIDs.length === 1) {
          userId = activeFilterUserIDs[0];
        }
        
        if (!userId) {
          const email = (client.email || '').toLowerCase().trim();
          userId = email || `unknown-${client._id}`;
        }
        
        let userName = userMap.get(userId);
        if (!userName) {
          userName = client.userName || client.user_name ||
                     client.user?.name || client.user?.userID;
          
          if (!userName) {
            if (typeof userId === 'string' && userId.includes('@')) {
              userName = userId.split('@')[0];
            } else if (userId && !userId.startsWith('unknown')) {
              userName = `User ${String(userId).slice(-8)}`;
            } else {
              userName = 'Unknown User';
            }
          }
        }
        
        if (!acc[userId]) {
          acc[userId] = { userId, userName, clients: [] };
        }
        acc[userId].clients.push(client);
        return acc;
      }, {});

      const result = Object.values(grouped);
      if (result.length === 0 && clients.length > 0) {
        return [{
          userId: 'all',
          userName: 'All Clients',
          clients: clients
        }];
      }
      
      return result.sort((a, b) => {
        return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase());
      });
    } catch (error) {
      console.error('Error grouping clients:', error);
      return null;
    }
  }, [isHighman, clients, users, filters.filterUserIDs]);

  const toggleUserExpanded = (userId) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

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
          ) : error ? (
            <div className="clients-list">
              <p className="no-clients">Error: {error}</p>
            </div>
          ) : isHighman && groupedClients !== null && groupedClients.length > 0 ? (
            <div className="clients-list grouped">
              {groupedClients.map((userGroup) => {
                const isExpanded = expandedUsers.has(userGroup.userId);
                const clientCount = userGroup.clients.length;
                return (
                  <div key={userGroup.userId} className="user-client-group">
                    <div
                      className="user-client-header"
                      onClick={() => toggleUserExpanded(userGroup.userId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && toggleUserExpanded(userGroup.userId)}
                    >
                      <span className="user-client-name">{userGroup.userName}</span>
                      <span className="user-client-count">{clientCount} client{clientCount !== 1 ? 's' : ''}</span>
                      <span className="user-client-toggle">{isExpanded ? '▼' : '▶'}</span>
                    </div>
                    {isExpanded && (
                      <div className="user-clients-list">
                        {userGroup.clients.map((client) => (
                          <div key={client._id} className="client-card">
                            <h3>{client.name}</h3>
                            <p><strong>Email:</strong> {client.email}</p>
                            <p><strong>Country:</strong> {client.country}</p>
                            <p><strong>Status:</strong> {client.status === 'Active' ? 'Active now' : client.status === 'Pending' ? 'Needs care' : client.status || 'Active now'}</p>
                            <p><strong>Description:</strong> {client.description}</p>
                            <div className="card-buttons">
                              <button 
                                type="button" 
                                onClick={() => handleModify(client._id)} 
                                className="modify-button"
                              >
                                Modify
                              </button>
                              <button 
                                type="button" 
                                onClick={() => deleteClient(client._id)} 
                                className="delete-button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : clients.length === 0 ? (
            <div className="clients-list">
              <p className="no-clients">No clients yet.</p>
            </div>
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
