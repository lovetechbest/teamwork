import React from 'react';
import './ReportItem.css';

const ReportItem = ({ report, isToday, onModify, showUserInfo = false }) => {
  return (
    <div className="report-item">
      <div className="report-header">
        <div className="report-header-left">
          <span className="report-date">{report.date}</span>
          {showUserInfo && report.userName && (
            <span className="report-user">by {report.userName}</span>
          )}
        </div>
        {isToday && onModify && (
          <button
            className="modify-btn"
            onClick={onModify}
          >
            ✏️ Modify
          </button>
        )}
      </div>
      <p className="report-text">{report.text}</p>
    </div>
  );
};

export default ReportItem;
