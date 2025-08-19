import React, { useState } from 'react';
import './LoginPage.css';
import { AuthService } from './authService';

interface LoginPageProps {
  onNavigateToWelcome: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onNavigateToWelcome, onNavigateToForgotPassword, onLoginSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await AuthService.login({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setError(error);
      } else if (user) {
        // Clear form data on successful login
        setFormData({
          email: '',
          password: ''
        });
        // Call success callback which will handle navigation
        onLoginSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Google OAuth 2.0 flow
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
      const redirectUri = `${window.location.origin}/auth/google/callback`;

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      });

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (error) {
      console.error('Google OAuth error:', error);
      alert('Failed to initiate Google login. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // Apple Sign In flow
      const clientId = process.env.REACT_APP_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID';
      const redirectUri = `${window.location.origin}/auth/apple/callback`;

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'name email',
        response_mode: 'form_post'
      });

      window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
    } catch (error) {
      console.error('Apple OAuth error:', error);
      alert('Failed to initiate Apple login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">A</div>
            <span>Apostille.AI</span>
            <span className="beta">BETA</span>
          </div>
          <p className="powered-by">Powered by Apostille Technologies LLC</p>
        </div>

        <div className="login-form-container">
          <h1>Login</h1>
          <p className="login-subtitle">Enter your details to Login up</p>
          <p className="signup-prompt">
            If you don't have an account <button onClick={onNavigateToWelcome} className="signup-link">Sign Up</button>
          </p>

          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={handleGoogleLogin}>
              <span className="social-icon google-icon"></span>
              Login with Google
            </button>
            <button className="social-btn apple-btn" onClick={handleAppleLogin}>
              <span className="social-icon apple-icon"></span>
              Login with Apple
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: '#e74c3c', fontSize: '14px', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4285f4',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0'
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}