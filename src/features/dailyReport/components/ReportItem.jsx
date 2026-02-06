import React from 'react';
import './ReportItem.css';

const formatDateTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const ReportItem = ({ report, isToday, onModify, showUserInfo = false, showTimestamps = false }) => {
  const created = formatDateTime(report.createdAt);
  const updated = formatDateTime(report.updatedAt);
  const wasUpdated = report.updatedAt && report.createdAt &&
    new Date(report.updatedAt).getTime() !== new Date(report.createdAt).getTime();

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
      {showTimestamps && (created || updated) && (
        <div className="report-timestamps">
          {created && <span className="report-created">Created: {created}</span>}
          {wasUpdated && updated && <span className="report-updated">Updated: {updated}</span>}
        </div>
      )}
      <p className="report-text">{report.text}</p>
    </div>
  );
};

export default ReportItem;
