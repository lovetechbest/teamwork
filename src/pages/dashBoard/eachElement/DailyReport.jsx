import React from 'react';

export default function DailyReport() {
  return (
    <div className="card">
      <h3>Daily Report</h3>
      <div className="daily-report-content">
        <img src="/dash-board/daily_report.png" alt="Daily Report" className="card-image" />
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">23</div>
            <div className="label">Reported</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">7</div>
            <div className="label">Not Reported</div>
          </div>
        </div>
      </div>
    </div>
  );
}
