import React from 'react';
import { NavLink } from "react-router-dom";

export default function Header({ onPageChange }) {
  return (
    <header className="top-header">
      <div className="logo">DEV•DASH</div>
      <nav className="top-nav">
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/daily-report" className="nav-link">Daily Report</NavLink>
        <NavLink to="/clients" className="nav-link">Clients</NavLink>
        <NavLink to="/projects" className="nav-link">Projects</NavLink>
        <NavLink to="/profit" className="nav-link">Profit</NavLink>
      </nav>
    </header>
  );
}
