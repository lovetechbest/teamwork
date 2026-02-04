import React from 'react';
import Header from './components/Header.jsx';
import MainDisplay from './pages/index.jsx'; // Your Pages component
import FooterCards from './components/FooterCards.jsx';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter should wrap the entire app

export default function App() {
  return (
    <BrowserRouter>
      <div id="app">
        <Header />
        <main className="main">
          <MainDisplay /> {/* MainDisplay will render the pages */}
        </main>
        <FooterCards />
      </div>
    </BrowserRouter>
  );
}
