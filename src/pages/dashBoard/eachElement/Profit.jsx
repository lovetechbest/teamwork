import React from 'react';

export default function Profit() {
  return (
    <div className="card">
      <h3>Profit Overview</h3>
      <div className="daily-report-content">
        <img src="/dash-board/profit.png" alt="Daily Report" className="card-image" />
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">23</div>
            <div className="label">Incoming</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">7</div>
            <div className="label">Predict</div>
          </div>
        </div>
      </div>
    </div>
  );
}
