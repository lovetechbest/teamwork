import React, { useState, useMemo } from 'react';
import ReportItem from './ReportItem';
import './ReportList.css';

const ReportList = ({ reports, today, onModify, onDelete, showUserInfo = false, showTimestamps = false }) => {
  const [filterDate, setFilterDate] = useState('');
  const [showPreviousReports, setShowPreviousReports] = useState(false);

  const filteredReports = useMemo(() => {
    let filtered = [...reports];
    
    // Hide previous reports if showPreviousReports is false (only show today's report)
    if (!showPreviousReports && today) {
      filtered = filtered.filter(r => r.date === today);
    }
    
    if (filterDate) {
      filtered = filtered.filter(r => r.date === filterDate);
    }
    
    return filtered.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  }, [reports, filterDate, showPreviousReports, today]);
  
  const hasPreviousReports = reports.some(r => r.date !== today);

  if (reports.length === 0) {
    return (
      <div className="report-list">
        <p className="no-reports">No reports yet.</p>
      </div>
    );
  }

  return (
    <div className="report-list">
      <div className="report-list-header">
        {hasPreviousReports && (
          <button
            className="toggle-previous-btn"
            onClick={() => setShowPreviousReports(!showPreviousReports)}
          >
            {showPreviousReports ? 'Hide Previous Reports' : 'Show Previous Reports'}
          </button>
        )}
        <label className="report-filter-label">
          <span>Filter by date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="report-filter-input"
          />
          {filterDate && (
            <button
              className="clear-filter-btn"
              onClick={() => setFilterDate('')}
            >
              Clear
            </button>
          )}
        </label>
      </div>
      {filteredReports.length === 0 ? (
        <p className="no-reports">No reports found{filterDate ? ' for selected date' : ''}.</p>
      ) : (
        filteredReports.map((report) => (
          <ReportItem
            key={report.id}
            report={report}
            isToday={report.date === today}
            onModify={onModify}
            onDelete={onDelete}
            showUserInfo={showUserInfo}
            showTimestamps={showTimestamps}
          />
        ))
      )}
    </div>
  );
};

export default ReportList;
