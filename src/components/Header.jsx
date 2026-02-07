import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout, changeUserInfo } from '../store/auth/authActions';
import { 
  FaHome, 
  FaFileAlt, 
  FaUsers, 
  FaFolder, 
  FaChartLine,
  FaSignOutAlt,
  FaCoins,
  FaUserEdit,
  FaUserCog
} from 'react-icons/fa';
import { isHighman } from '../utils/roles';

export default function Header({ onPageChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, role } = useSelector((state) => state.auth);
  const userRole = role || sessionStorage.getItem("userRole");
  const isHighmanUser = isHighman(userRole);
  const [showChangeUserInfo, setShowChangeUserInfo] = useState(false);
  const [name, setName] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editRole, setEditRole] = useState('');
  const [error, setError] = useState('');
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleOpenChangeUserInfo = () => {
    setShowChangeUserInfo(true);
    setError('');
  };

  const handleCloseChangeUserInfo = () => {
    setShowChangeUserInfo(false);
    setName('');
    setUserID('');
    setPassword('');
    setConfirmPassword('');
    setEditRole('');
    setError('');
  };

  const handleChangeUserInfoSubmit = async (e) => {
    e.preventDefault();
    if (!name && !userID && !password) {
      setError('Please fill at least one field to update.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setError('');
    try {
      await dispatch(changeUserInfo({
        id: userId || sessionStorage.getItem('userId'),
        name: name || undefined,
        userID: userID || undefined,
        password: password || undefined,
        role: editRole || undefined,
      }));
      handleCloseChangeUserInfo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header className="top-header">
      <NavLink to="/dashboard" className="logo">
        <span className="logo-icon-wrap">
          <FaCoins className="logo-icon" aria-hidden="true" />
        </span>
        <span className="logo-text">Money Spinner</span>
      </NavLink>
      <nav className="top-nav">
        <NavLink to="/dashboard" className="nav-link">
          <FaHome className="nav-icon" />
          Dashboard
        </NavLink>
        <NavLink to="/daily-report" className="nav-link">
          <FaFileAlt className="nav-icon" />
          Daily Report
        </NavLink>
        <NavLink to="/clients" className="nav-link">
          <FaUsers className="nav-icon" />
          Clients
        </NavLink>
        <NavLink to="/projects" className="nav-link">
          <FaFolder className="nav-icon" />
          Projects
        </NavLink>
        <NavLink to="/profit" className="nav-link">
          <FaChartLine className="nav-icon" />
          Profit
        </NavLink>
        {isHighmanUser && (
          <NavLink to="/user-management" className="nav-link">
            <FaUserCog className="nav-icon" />
            User Management
          </NavLink>
        )}
        {!isHighmanUser && (
          <button onClick={handleOpenChangeUserInfo} className="nav-link change-userinfo-button" type="button">
            <FaUserEdit className="nav-icon" />
            Change UserInfo
          </button>
        )}
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </nav>

      {showChangeUserInfo && !isHighmanUser && createPortal(
        <div className="modal-overlay" onClick={handleCloseChangeUserInfo}>
          <div className="modal-content change-userinfo-modal" onClick={e => e.stopPropagation()}>
            <h3>Change User Info</h3>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleChangeUserInfoSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>User ID:</label>
                <input
                  type="text"
                  placeholder="Email or username"
                  value={userID}
                  onChange={e => setUserID(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                  <option value="">Keep current</option>
                  <option value="Developer">Developer</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={handleCloseChangeUserInfo}>Cancel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
