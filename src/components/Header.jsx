import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth/authActions';
import { 
  FaHome, 
  FaFileAlt, 
  FaUsers, 
  FaFolder, 
  FaChartLine,
  FaSignOutAlt,
  FaCoins,
  FaGem
} from 'react-icons/fa';

export default function Header({ onPageChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </nav>
    </header>
  );
}
