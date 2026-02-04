import React from 'react';

export default function Clients() {
  return (
    <div className="card">
      <h3>Clients Overview</h3>
      <div className="daily-report-content">
        <img src="/dash-board/clients.png" alt="Daily Report" className="card-image" />
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">23</div>
            <div className="label">Active now</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">7</div>
            <div className="label">Needs contract</div>
          </div>
        </div>
      </div>
    </div>
  );
}
