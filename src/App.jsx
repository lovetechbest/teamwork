import React from 'react';
import { useSelector } from 'react-redux';
import Pages from './pages';
import LoginPage from './components/Login';
import SignInPage from './components/SignIn';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/sign-up"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignInPage />}
        />

        <Route
          path="/*"
          element={isLoggedIn ? <Pages /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
