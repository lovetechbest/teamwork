import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { useProjectStats } from '../../../features/projects/hooks/useProjectStats';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function Projects() {
  const { createdCount, loading, error } = useProjectStats();

  return (
    <div className="card">
      <h3>Projects</h3>
      <div className="daily-report-content">
        <img src="/dash-board/project.png" alt="Projects" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-status">
          <div className="status-indicator reported">
            <FaFolderOpen className="status-icon check-icon" />
            <div className="label">{loading ? '—' : createdCount} Created</div>
          </div>
        </div>
      </div>
    </div>
  );
}
