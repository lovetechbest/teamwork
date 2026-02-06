import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useManagerProfits } from './hooks/useManagerProfits';
import { FaChartLine, FaUsers, FaDollarSign } from 'react-icons/fa';
import './ProfitPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ManagerProfitPage = () => {
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({});
  const { groupedByUser, totalProfit, loading, error, refreshProfits } = useManagerProfits(dateRange);

  const onDateChange = (newDate) => {
    setDate(newDate);
    const startDate = new Date(newDate);
    startDate.setMonth(startDate.getMonth() - 1);
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: newDate.toISOString().split('T')[0],
    });
  };

  const chartData = {
    labels: groupedByUser.map(user => user.userName),
    datasets: [
      {
        label: 'Profit ($)',
        data: groupedByUser.map(user => user.total),
        borderColor: '#6c7cff',
        backgroundColor: 'rgba(108, 124, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Team Profit Summary',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="profit-page">
        <h1>
          <FaChartLine /> Profit Overview
        </h1>
        <div className="loading-message">Loading profits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profit-page">
        <h1>
          <FaChartLine /> Profit Overview
        </h1>
        <div className="error-message">
          {error}
          <button onClick={refreshProfits} className="refresh-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profit-page">
      <div className="profit-header">
        <h1>
          <FaChartLine /> Team Profit Overview
        </h1>
        <button onClick={refreshProfits} className="refresh-button">
          Refresh
        </button>
      </div>

      <div className="total-profit-card">
        <div className="total-profit-content">
          <FaDollarSign className="total-profit-icon" />
          <div>
            <div className="total-profit-label">Total Team Profit</div>
            <div className="total-profit-amount">${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <div className="user-profits-section">
        <h2>
          <FaUsers /> Individual Profit Summary
        </h2>
        <div className="user-profits-grid">
          {groupedByUser.map((user) => (
            <div key={user.userId} className="user-profit-card">
              <div className="user-profit-header">
                <h3>{user.userName}</h3>
                <span className="user-profit-count">
                  {user.profits.length} record{user.profits.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="user-profit-amount">
                ${user.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-container">
        <h3>Select a Date Range</h3>
        <Calendar onChange={onDateChange} value={date} />
        <div className="selected-date">
          <p>Selected Date: {date.toDateString()}</p>
          {dateRange.startDate && dateRange.endDate && (
            <p>Range: {dateRange.startDate} to {dateRange.endDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfitPage;
