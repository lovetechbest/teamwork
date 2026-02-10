import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProfitPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProfitPage = () => {
  const [date, setDate] = useState(new Date());

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit ($)',
        data: [5000, 4000, 6000, 7000, 8000, 9000],
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
        text: 'Monthly Profit',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="profit-page">
      <h1>Profit Overview</h1>

      <div className="profit-layout">
        <div className="profit-chart-col">
          <div className="chart-container">
            <Line data={data} options={options} />
          </div>
        </div>
        <div className="profit-calendar-col">
          <div className="calendar-container">
            <h3>Select a Date</h3>
            <Calendar onChange={onDateChange} value={date} />
            <div className="selected-date">
              <p>Selected Date: {date.toDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitPage;
