import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout, changeUserInfo } from '../store/auth/authActions';
import { 
  FaHome, 
  FaFileAlt, 
  FaUsers, 
  FaFolder, 
  FaChartLine,
  FaSignOutAlt,
  FaCoins,
  FaGem,
  FaUserEdit
} from 'react-icons/fa';

export default function Header({ onPageChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showChangeUserInfo, setShowChangeUserInfo] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleChangeUserInfoSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError('Please fill User ID, password and confirm password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setError('');
    try {
      await dispatch(changeUserInfo({ username, password, confirmPassword }));
      handleCloseChangeUserInfo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header className="top-header">
      <NavLink to="/dashboard" className="logo">
        <FaCoins className="logo-icon coin-1" />
        <FaGem className="logo-icon gem-icon" />
        <FaCoins className="logo-icon coin-2" />
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
        <button onClick={handleOpenChangeUserInfo} className="nav-link change-userinfo-button" type="button">
          <FaUserEdit className="nav-icon" />
          Change UserInfo
        </button>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </nav>

      {showChangeUserInfo && createPortal(
        <div className="modal-overlay" onClick={handleCloseChangeUserInfo}>
          <div className="modal-content change-userinfo-modal" onClick={e => e.stopPropagation()}>
            <h3>Change User Info</h3>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleChangeUserInfoSubmit}>
              <div className="form-group">
                <label>User ID:</label>
                <input
                  type="text"
                  placeholder="User ID"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
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
