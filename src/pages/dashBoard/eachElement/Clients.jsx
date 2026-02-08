import React from 'react';
import { useClientStats } from '../../../features/clients/hooks/useClientStats';

export default function Clients() {
  const { activeCount, needsContractCount, loading, error } = useClientStats();

  return (
    <div className="card">
      <h3>Clients Overview</h3>
      <div className="daily-report-content">
        <img src="/dash-board/clients.png" alt="Clients" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">{loading ? '—' : activeCount}</div>
            <div className="label">Active now</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">{loading ? '—' : needsContractCount}</div>
            <div className="label">Needs contract</div>
          </div>
        </div>
      </div>
    </div>
  );
}
