import React from 'react';
import { useManagerDailyReports } from './hooks/useManagerDailyReports';
import ReportList from './components/ReportList';
import { FaFileAlt, FaUsers } from 'react-icons/fa';
import './DailyReportPage.css';

const ManagerDailyReportPage = () => {
  const { reports, loading, error, refreshReports } = useManagerDailyReports();
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="daily-report">
        <h2>
          <span className="title-icon">
            <FaFileAlt />
          </span>
          Team Daily Reports
        </h2>
        <div className="loading-message">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-report">
        <h2>
          <span className="title-icon">
            <FaFileAlt />
          </span>
          Team Daily Reports
        </h2>
        <div className="error-message">
          {error}
          <button onClick={refreshReports} className="refresh-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const groupedReports = reports.reduce((acc, report) => {
    const userId = report.userId || report.user_id || report.id;
    const userName = report.userName || report.user_name || `User ${userId}`;
    
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        userName,
        reports: [],
      };
    }
    
    acc[userId].reports.push({
      id: report.id || report._id,
      date: report.date,
      text: report.main_content || report.content || report.text,
      userId,
      userName,
    });
    
    return acc;
  }, {});

  const sortedUsers = Object.values(groupedReports).sort((a, b) => 
    a.userName.localeCompare(b.userName)
  );

  return (
    <div className="daily-report">
      <div className="report-header">
        <h2>
          <span className="title-icon">
            <FaUsers />
          </span>
          Team Daily Reports
        </h2>
        <button onClick={refreshReports} className="refresh-button">
          Refresh
        </button>
      </div>

      {sortedUsers.length === 0 ? (
        <div className="no-reports">
          <p>No team reports found.</p>
        </div>
      ) : (
        <div className="team-reports-container">
          {sortedUsers.map((userGroup) => (
            <div key={userGroup.userId} className="user-report-section">
              <h3 className="user-name-header">
                {userGroup.userName}
                <span className="report-count">
                  ({userGroup.reports.length} report{userGroup.reports.length !== 1 ? 's' : ''})
                </span>
              </h3>
              <ReportList
                reports={userGroup.reports}
                today={today}
                onModify={null}
                showUserInfo={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDailyReportPage;
