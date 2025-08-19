import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './ForgotPasswordPage.css'; // Reusing the same styles

interface ResetPasswordPageProps {
  onNavigateToLogin: () => void;
}

export default function ResetPasswordPage({ onNavigateToLogin }: ResetPasswordPageProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlHash = new URLSearchParams(window.location.hash.substring(1));
    
    // Check both URL params and hash for tokens (Supabase can use either)
    const accessToken = urlParams.get('access_token') || urlHash.get('access_token');
    const refreshToken = urlParams.get('refresh_token') || urlHash.get('refresh_token');
    const type = urlParams.get('type') || urlHash.get('type');

    if (type === 'recovery' && accessToken) {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      }).then(({ error }) => {
        if (error) {
          setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new password reset.' });
          setIsTokenValid(false);
        } else {
          setIsTokenValid(true);
        }
      });
    } else {
      setMessage({ type: 'error', text: 'Invalid reset link. Please request a new password reset.' });
      setIsTokenValid(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error message when user starts typing
    if (message?.type === 'error') {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in both password fields' });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password updated successfully! Redirecting to login...' 
        });
        
        // Sign out the user and redirect to login after a short delay
        setTimeout(async () => {
          await supabase.auth.signOut();
          onNavigateToLogin();
        }, 2000);
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking token validity
  if (isTokenValid === null) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-header">
          <div className="forgot-password-logo">
            <div className="logo-icon">A</div>
            <span>Apostille.AI</span>
            <span className="beta">BETA</span>
          </div>
          <p className="powered-by">Powered by Apostille Technologies LLC</p>
        </div>

        <div className="forgot-password-form-container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#7f8c8d' }}>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-header">
          <div className="forgot-password-logo">
            <div className="logo-icon">A</div>
            <span>Apostille.AI</span>
            <span className="beta">BETA</span>
          </div>
          <p className="powered-by">Powered by Apostille Technologies LLC</p>
        </div>

        <div className="forgot-password-form-container">
          <div className="success-container">
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#dc2626', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px'
            }}>
              ✕
            </div>
            <h2>Invalid Reset Link</h2>
            <p>
              This password reset link is invalid or has expired. 
              Please request a new password reset to continue.
            </p>
            <button 
              type="button" 
              onClick={onNavigateToLogin} 
              className="back-btn"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-header">
        <div className="forgot-password-logo">
          <div className="logo-icon">A</div>
          <span>Apostille.AI</span>
          <span className="beta">BETA</span>
        </div>
        <p className="powered-by">Powered by Apostille Technologies LLC</p>
      </div>

      <div className="forgot-password-form-container">
        <h1>Reset Your Password</h1>
        <p className="forgot-password-subtitle">
          Enter your new password below. Make sure it's at least 8 characters long.
        </p>

        {message && (
          <div 
            className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}
            role={message.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form" noValidate>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading || !formData.password || !formData.confirmPassword}
          >
            {isLoading && (
              <>
                <div className="loading-spinner" aria-hidden="true"></div>
                <span className="sr-only">Updating password...</span>
              </>
            )}
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </button>

          <button 
            type="button" 
            onClick={onNavigateToLogin} 
            className="back-btn"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}