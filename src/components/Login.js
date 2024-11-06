import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import image from "./d1.png";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://group01.onrender.com/api/users/login', { email, password });
      const { username, _id, token } = res.data; // Make sure to include the token from the response

      // Fetch user settings after successful login
      const settingsRes = await axios.get(`http://localhost:5000/api/users/account-settings/${_id}`, {
        headers: { 'Authorization': token } // Include the token for authorization
      });

      const userSettings = settingsRes.data; // Get the user settings

      console.log('Login successful:', res.data);

      // Save both user data and settings to local storage
      const user = { id: _id, username, token, ...userSettings };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user); // Update user state in App
      navigate('/workouts');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Login to FitTrack</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
      <div className="image-wrapper">
        <img src={image} alt="Abstract red background" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
