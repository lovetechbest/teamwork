import React from 'react';
import DailyReport from './eachElement/DailyReport.jsx';
import Clients from './eachElement/Clients.jsx';
import Projects from './eachElement/Projects.jsx';
import Profit from './eachElement/Profit.jsx';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

export default function DashBoard() {
  const [whichPage, setWhichPage] = React.useState("dashboard");
  return (
    <section className="grid">
      <div className="column">
        <Link to = 'daily-report' className="link-element"><DailyReport /></Link>
        <Link to = 'projects' className='link-element'><Projects/></Link>
      </div>
      <div className="column">
        <Link to = 'clients' className='link-element'><Clients/></Link>
        <Link to = 'profit' className='link-element'><Profit/></Link>
      </div>
    </section>
  );
}


