import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProfitPage = () => {
  const [date, setDate] = useState(new Date());

  // Data for the chart (profit over time)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Months as labels
    datasets: [
      {
        label: 'Profit ($)',
        data: [5000, 4000, 6000, 7000, 8000, 9000], // Profit values
        borderColor: '#6c7cff', // Line color
        backgroundColor: 'rgba(108, 124, 255, 0.2)', // Background area color
        fill: true,
      },
    ],
  };

  // Options for the chart
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

  // Handle date selection on the calendar
  const onDateChange = (newDate) => {
    setDate(newDate);
    console.log('Selected Date:', newDate);
  };

  return (
    <div className="profit-page">
      <h1>Profit Overview</h1>

      {/* Chart */}
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      {/* Timeline/Calendar */}
      <div className="calendar-container">
        <h3>Select a Date</h3>
        <Calendar onChange={onDateChange} value={date} />
        <div className="selected-date">
          <p>Selected Date: {date.toDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfitPage;
