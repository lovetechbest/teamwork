import React from 'react';
import { Link } from 'react-router-dom';
import DeveloperDailyReport from './eachElement/DeveloperDailyReport';
import Clients from './eachElement/Clients';
import Projects from './eachElement/Projects';
import Profit from './eachElement/Profit';

export default function DeveloperDashboard() {
  return (
    <section className="grid">
      <div className="column">
        <Link to="/daily-report" className="link-element">
          <DeveloperDailyReport />
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
