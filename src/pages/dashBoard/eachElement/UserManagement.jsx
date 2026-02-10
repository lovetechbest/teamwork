import React from 'react';
import { FaUsers, FaUserCog, FaCrown } from 'react-icons/fa';
import { useUserCount } from '../../../features/users/hooks/useUserCount';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function UserManagement() {
  const { totalUsers, leaderCount, loading, error } = useUserCount();

  return (
    <div className="card">
      <h3>
        <FaUserCog className="card-title-icon" />
        User Management
      </h3>
      <div className="daily-report-content">
        <img src="/dash-board/clients.png" alt="User Management" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-status">
          <div className="status-indicator reported">
            <FaUsers className="status-icon check-icon" />
            <div className="label">{loading ? '—' : totalUsers} Team</div>
          </div>
          <div className="status-indicator not-reported">
            <FaCrown className="status-icon no-check-icon" />
            <div className="label">{loading ? '—' : leaderCount} Leaders</div>
          </div>
        </div>
      </div>
    </div>
  );
}
