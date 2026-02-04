import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Correct import of Routes and Route
import DashBoard from './dashBoard/DashBoard.jsx';
import ClientsPage from './clients/ClientsPage.jsx';
import DailyReportPage from './dailyReport/DailyReportPage.jsx';
import ProjectsPage from './projects/ProjectsPage.jsx';
import ProfitPage from './profit/ProfitPage.jsx';

const Pages = () => {
  return (
    <main className="main">
      <Routes> {/* Use Routes instead of Router */}
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/daily-report" element={<DailyReportPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profit" element={<ProfitPage />} />
      </Routes>
    </main>
  );
};

export default Pages;
