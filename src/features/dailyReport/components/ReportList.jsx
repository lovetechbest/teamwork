import React from 'react';
import ReportItem from './ReportItem';
import './ReportList.css';

const ReportList = ({ reports, today, onModify, showUserInfo = false }) => {
  if (reports.length === 0) {
    return (
      <div className="report-list">
        <p className="no-reports">No reports yet.</p>
      </div>
    );
  }

  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="report-list">
      {sortedReports.map((report) => (
        <ReportItem
          key={report.id}
          report={report}
          isToday={report.date === today}
          onModify={onModify}
          showUserInfo={showUserInfo}
        />
      ))}
    </div>
  );
};

export default ReportList;
