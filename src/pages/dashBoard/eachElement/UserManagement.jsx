import React from 'react';
import { FaUsers, FaUserCog, FaUserPlus } from 'react-icons/fa';
import { useUserCount } from '../../../features/users/hooks/useUserCount';

export default function UserManagement() {
  const { totalUsers, leaderCount, loading, error } = useUserCount();

  return (
    <div className="card user-management-card">
      <h3>
        <FaUserCog className="card-title-icon" />
        User Management
      </h3>
      <div className="user-management-content">
        <div className="user-management-visual">
          <div className="user-icons-stack">
            <FaUsers className="icon-main" />
            <FaUserPlus className="icon-accent" />
          </div>
        </div>
        {error && <p className="user-management-error">{error}</p>}
        <div className="daily-report-announcements user-management-announcements">
          <div className="announcement reported">
            <div className="count">{loading ? '—' : totalUsers}</div>
            <div className="label">Team</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">{loading ? '—' : leaderCount}</div>
            <div className="label">Leaders</div>
          </div>
        </div>
      </div>
    </div>
  );
}
