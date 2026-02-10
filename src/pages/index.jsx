import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ManagerDashboard from './dashBoard/DashBoard';
import DeveloperDashboard from './dashBoard/DeveloperDashboard';
import ClientsPage from '../features/clients/ClientsPage';
import DailyReportPage from '../features/dailyReport/DailyReportPage';
import ManagerDailyReportPage from '../features/dailyReport/ManagerDailyReportPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import ProfitPage from '../features/profit/ProfitPage';
import ManagerProfitPage from '../features/profit/ManagerProfitPage';
import UserManagementPage from '../features/users/UserManagementPage';
import { getUserRole } from '../store/auth/authStorage';
import { isHighman } from '../utils/roles';

import Header from '../components/Header';
import FooterCards from '../components/FooterCards';
import ErrorBoundary from '../components/ErrorBoundary';

const Pages = () => {
  const { role } = useSelector(state => state.auth);
  const userRole = role || getUserRole();
  const isManager = isHighman(userRole);

  return (
    <div>
      <Header />
      <div className="main">
        <Routes>
          <Route 
            path="/developer-dashboard" 
            element={<DeveloperDashboard />} 
          />
          <Route 
            path="/manager-dashboard" 
            element={<ManagerDashboard />} 
          />
          <Route 
            path="/dashboard" 
            element={
              isManager ? 
                <Navigate to="/manager-dashboard" replace /> : 
                <Navigate to="/developer-dashboard" replace />
            } 
          />
          <Route 
            path="/daily-report" 
            element={
              <ErrorBoundary>
                {isManager ? 
                  <ManagerDailyReportPage /> : 
                  <DailyReportPage />}
              </ErrorBoundary>
            } 
          />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route 
            path="/profit" 
            element={
              isManager ? 
                <ManagerProfitPage /> : 
                <ProfitPage />
            } 
          />
          <Route 
            path="/user-management" 
            element={
              isManager ? 
                <UserManagementPage /> : 
                <Navigate to="/developer-dashboard" replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate to={isManager ? "/manager-dashboard" : "/developer-dashboard"} replace />
            } 
          />
        </Routes>
      </div>
      <FooterCards />
    </div>
  );
};

export default Pages;
