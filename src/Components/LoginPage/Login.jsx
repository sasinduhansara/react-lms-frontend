import React, { useState } from 'react';
import './Login.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt with:', { username, password });
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your email if account exists');
  };

  return (
    <div className="login-container">
      {/* Animated background elements */}
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
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className="fas fa-user"></i>
            </div>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
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
          Designed and Developed by IT Department</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;