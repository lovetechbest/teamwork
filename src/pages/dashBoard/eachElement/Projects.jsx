import React from 'react';

export default function Projects() {
  return (
    <div className="card">
      <h3>Projects</h3>
      <div className="daily-report-content">
        <img src="/dash-board/project.png" alt="Projects" className="card-image" />
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">8</div>
            <div className="label">Completed</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">5</div>
            <div className="label">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}
