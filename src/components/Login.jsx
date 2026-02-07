import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/auth/authActions';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, loading, error } = useSelector(
    state => state.auth
  );

  const [username, setUsername] = useState('');   // changed from username
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setLocalError('Please fill all fields');
      return;
    }

    setLocalError('');
    try {
      await dispatch(login(username, password));
    } catch (error) {
      // Error handled by auth action
    }
  };

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login-container">
      <h2>Login</h2>

      {(localError || error) && (
        <p className="error-text">{localError || error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="UserID"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="signup-link">
        If you are first,{' '}
        <span onClick={() => navigate('/sign-up')}>
          click here
        </span>
      </p>
    </div>
  );
}
