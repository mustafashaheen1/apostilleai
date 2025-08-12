
import React, { useState } from 'react';
import './WelcomePage.css';
import { AuthService } from './authService';

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

export default function WelcomePage({ onNavigateToLogin, onSignUpSuccess }: WelcomePageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms & Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await AuthService.signUp({
        fullName: formData.fullName,
        company: formData.company,
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setError(error);
      } else if (user) {
        // Clear form data on successful signup
        setFormData({
          fullName: '',
          company: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setAgreeToTerms(false);
        onSignUpSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      alert('Failed to initiate Google sign up. Please try again.');
    }
  };

  const handleAppleSignUp = async () => {
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
      alert('Failed to initiate Apple sign up. Please try again.');
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-left">
        <div className="welcome-header">
          <div className="welcome-logo">
            <div className="logo-icon">A</div>
            <span>Apostille.AI</span>
            <span className="beta">BETA</span>
          </div>
          <p className="powered-by">Powered by Apostille Technologies LLC</p>
        </div>

        <div className="signup-form-container">
          <h1>Get Started</h1>
          <p className="signup-subtitle">Enter your details to sign up</p>
          <p className="login-prompt">
            If you already have an account <button onClick={onNavigateToLogin} className="login-link">Login</button>
          </p>

          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={handleGoogleSignUp}>
              <span className="social-icon google-icon"></span>
              Sign Up With Google
            </button>
            <button className="social-btn apple-btn" onClick={handleAppleSignUp}>
              <span className="social-icon apple-icon"></span>
              Sign Up With Apple
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <span className="checkmark"></span>
                I agree to the Terms & Privacy Policy
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>

      <div className="welcome-right">
        <div className="preview-content">
          <h2>Apostille AI is the best way to suspendisse eu sed euismod nibh lectus pellentesque velit leo condimentum.</h2>
        </div>
      </div>
    </div>
  );
}