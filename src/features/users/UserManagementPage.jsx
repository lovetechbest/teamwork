import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaUserPlus, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import { useUsers } from './hooks/useUsers';
import './UserManagementPage.css';

const ROLES = ['Developer', 'Guest', 'Manager', 'Team Leader'];

const UserFormModal = ({ title, initialValues = {}, onSubmit, onCancel, isEdit }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [userID, setUserID] = useState(initialValues.userID || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(initialValues.role || 'Developer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEdit && (!name || !userID || !password)) {
      setError('Name, User ID, and Password are required.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isEdit && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { name: name || undefined, role };
      if (!isEdit) payload.userID = userID || undefined;
      if (password) {
        payload.password = password;
        payload.confirmPassword = confirmPassword || password;
      }
      await onSubmit(payload);
      onCancel();
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content user-form-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>User ID (login)</label>
            <input type="text" value={userID} onChange={e => setUserID(e.target.value)} placeholder="Email or username" disabled={isEdit} />
            {isEdit && <span className="form-hint">User ID cannot be changed.</span>}
          </div>
          <div className="form-group">
            <label>Password {isEdit && '(leave blank to keep)'}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEdit ? 'New password' : 'Password'} />
          </div>
          {(!isEdit || password) && (
            <div className="form-group">
              <label>{isEdit ? 'Confirm New Password' : 'Confirm Password'}</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
            </div>
          )}
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'userID', label: 'User ID' },
  { value: 'role', label: 'Role' },
];

export default function UserManagementPage() {
  const { users, loading, error, refresh, createUser, deleteUser, updateUser } = useUsers();
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const sortedUsers = [...users].sort((a, b) => {
    const aVal = String(a[sortBy] || '').toLowerCase();
    const bVal = String(b[sortBy] || '').toLowerCase();
    return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
  });

  const handleCreate = async (payload) => {
    await createUser(payload);
    setShowCreate(false);
  };

  const handleEdit = async (payload) => {
    if (!editingUser) return;
    await updateUser(editingUser.id, payload);
    setEditingUser(null);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.name}" (${user.userID})? This cannot be undone.`)) return;
    await deleteUser(user.id);
  };

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div className="user-management-actions">
          <button onClick={refresh} disabled={loading} className="refresh-btn">
            <FaSync className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button onClick={() => setShowCreate(true)} className="create-btn">
            <FaUserPlus /> Create User
          </button>
        </div>
      </div>

      {error && <p className="error-msg">{error} <button onClick={refresh}>Retry</button></p>}

      {!loading && users.length > 0 && (
        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="loading-msg">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="no-users-msg">No users found. Create your first user.</div>
      ) : (
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.userID}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                  <td>
                    <button onClick={() => setEditingUser(user)} className="btn-edit" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(user)} className="btn-delete" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && createPortal(
        <UserFormModal
          title="Create User"
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          isEdit={false}
        />,
        document.body
      )}

      {editingUser && createPortal(
        <UserFormModal
          key={editingUser.id}
          title="Edit User"
          initialValues={editingUser}
          onSubmit={handleEdit}
          onCancel={() => setEditingUser(null)}
          isEdit={true}
        />,
        document.body
      )}
    </div>
  );
}
