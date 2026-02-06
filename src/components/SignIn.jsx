import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../store/auth/authActions';

const SignInPage = ({ onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Developer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !username || !role || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');

    try {
      // Send all 5 fields to server
      await dispatch(
        signUp({ name, username, role, password, confirmPassword })
      );

      // Mark user as logged in
      onSignUpSuccess?.();

      // Redirect based on role
      if (role === 'TeamLeader' || role === 'Manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/developer-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* UserID */}
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            placeholder="Favourite name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Developer">Developer</option>
            <option value="TeamLeader">Team Leader</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <button type="submit">Sign Up</button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-button"
        >
          &larr; Back
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
