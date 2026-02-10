import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Pages from './pages';
import LoginPage from './components/Login';
import SignInPage from './components/SignIn';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { refreshAccessToken } from './store/auth/authActions';

function AppContent() {
  const { isLoggedIn, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // On app load, try to refresh access token using refreshToken from cookie
    const initAuth = async () => {
      await dispatch(refreshAccessToken());
      // refreshAccessToken handles errors internally and dispatches LOGOUT
      // which sets loading to false, allowing the app to render
    };
    initAuth();
  }, [dispatch]);

  // Show loading state while checking refresh token
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
