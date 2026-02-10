import React from 'react';
import { FaArrowDown, FaChartLine } from 'react-icons/fa';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function Profit() {
  return (
    <div className="card">
      <h3>Profit Overview</h3>
      <div className="daily-report-content">
        <img src="/dash-board/profit.png" alt="Profit Overview" className="card-image" />
        <div className="daily-report-status">
          <div className="status-indicator reported">
            <FaArrowDown className="status-icon check-icon" />
            <div className="label">23 Incoming</div>
          </div>
          <div className="status-indicator not-reported">
            <FaChartLine className="status-icon no-check-icon" />
            <div className="label">7 Predict</div>
          </div>
        </div>
      </div>
    </div>
  );
}
