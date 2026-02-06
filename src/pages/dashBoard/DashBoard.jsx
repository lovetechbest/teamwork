import React from 'react';
import { Link } from 'react-router-dom';
import DailyReport from './eachElement/DailyReport';
import Clients from './eachElement/Clients';
import Projects from './eachElement/Projects';
import Profit from './eachElement/Profit';

export default function ManagerDashboard() {
  return (
    <section className="grid">
      <div className="column">
        <Link to="/daily-report" className="link-element">
          <DailyReport />
        </Link>
        <Link to="/projects" className="link-element">
          <Projects />
        </Link>
      </div>
      <div className="column">
        <Link to="/clients" className="link-element">
          <Clients />
        </Link>
        <Link to="/profit" className="link-element">
          <Profit />
        </Link>
      </div>
    </section>
  );
}


