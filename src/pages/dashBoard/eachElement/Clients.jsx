import React from 'react';
import { FaUsers, FaFileContract } from 'react-icons/fa';
import { useClientStats } from '../../../features/clients/hooks/useClientStats';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function Clients() {
  const { activeCount, needsContractCount, loading, error } = useClientStats();

  return (
    <div className="card">
      <h3>Clients Overview</h3>
      <div className="daily-report-content">
        <img src="/dash-board/clients.png" alt="Clients" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-status">
          <div className={`status-indicator reported`}>
            <FaUsers className="status-icon check-icon" />
            <div className="label">{loading ? '—' : activeCount} Active now</div>
          </div>
          <div className={`status-indicator not-reported`}>
            <FaFileContract className="status-icon no-check-icon" />
            <div className="label">{loading ? '—' : needsContractCount} Needs contract</div>
          </div>
        </div>
      </div>
    </div>
  );
}
