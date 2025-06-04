import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.css'; // Your styles

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      console.log('save token to localStorage', res.data.token);

      localStorage.setItem('token', res.data.token);

      console.log('Login success:', res.data);

   
      // Navigate according to role
      const userRole = res.data.user.role;

      console.log('User role:', userRole);

      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'student') {
        navigate('/student');
      } else if (userRole === 'lecturer') {
        navigate('/lecturer');
      } else {
        alert('Unknown role. Please contact admin.');
      }

    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login failed: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your email if account exists');
  };

  return (
    <div className="login-container">
      <div className="bg-bubbles">
        {[...Array(10)].map((_, i) => (
          <li key={i}></li>
        ))}
      </div>

      <div className="login-box">
        <h1>Welcome Back</h1>
        <div className="login-form">
          <h2>Login Now</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="fas fa-envelope"></i>
            </div>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fas fa-lock"></i>
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
            <div className="options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <span
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="social-login">
              <p>Or login with</p>
              <div className="social-icons">
                <i className="fab fa-google"></i>
                <i className="fab fa-facebook-f"></i>
                <i className="fab fa-twitter"></i>
              </div>
            </div>
          </form>
        </div>
        <div className="footer-login">
          <p>Copyright © 2025 Ministry of Education (Higher Education). All Rights Reserved.
            Designed and Developed by IT Department
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
