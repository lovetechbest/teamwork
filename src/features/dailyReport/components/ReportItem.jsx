import React, { useState } from 'react';
import './ReportItem.css';

const formatDateTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const MAX_PREVIEW_LENGTH = 300;

const ReportItem = ({ report, isToday, onModify, onDelete, showUserInfo = false, showTimestamps = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const created = formatDateTime(report.createdAt);
  const updated = formatDateTime(report.updatedAt);
  const wasUpdated = report.updatedAt && report.createdAt &&
    new Date(report.updatedAt).getTime() !== new Date(report.createdAt).getTime();
  
  const text = report.text || '';
  const isLong = text.length > MAX_PREVIEW_LENGTH;
  const displayText = isExpanded || !isLong ? text : text.substring(0, MAX_PREVIEW_LENGTH) + '...';

  return (
    <div className="report-item">
      <div className="report-header">
        <div className="report-header-left">
          <span className="report-date">{report.date}</span>
          {showUserInfo && report.userName && (
            <span className="report-user">by {report.userName}</span>
          )}
        </div>
        <div className="report-header-actions">
          {isToday && onModify && (
            <button
              className="modify-btn"
              onClick={onModify}
            >
              ✏️ Modify
            </button>
          )}
          {!isToday && onDelete && (report.reportId || report._id || report.id) && (
            <button
              className="delete-btn"
              onClick={() => {
                if (window.confirm(`Delete report from ${report.date}?`)) {
                  onDelete(report.reportId || report._id || report.id);
                }
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
      {showTimestamps && (created || updated) && (
        <div className="report-timestamps">
          {created && <span className="report-created">Created: {created}</span>}
          {wasUpdated && updated && <span className="report-updated">Updated: {updated}</span>}
        </div>
      )}
      <p className={`report-text ${isExpanded ? 'expanded' : ''}`}>{displayText}</p>
      {isLong && (
        <button
          className="expand-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ReportItem;
