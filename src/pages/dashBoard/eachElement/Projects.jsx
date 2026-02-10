import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../../../store/projects/projectActions';

export default function Projects() {
  const [createdCount, setCreatedCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProjects({})
      .then((list) => {
        if (!cancelled) setCreatedCount(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => {
        if (!cancelled) setCreatedCount(0);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="card">
      <h3>Projects</h3>
      <div className="daily-report-content">
        <img src="/dash-board/project.png" alt="Projects" className="card-image" />
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">{createdCount ?? '—'}</div>
            <div className="label">Created</div>
          </div>
        </div>
      </div>
    </div>
  );
}
