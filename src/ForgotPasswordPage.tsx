import React, { useState } from 'react';
import './ForgotPasswordPage.css';
import { supabase } from './supabase';
import { AuthService } from './authService';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Send password reset email directly - Supabase will handle user existence check
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `https://animated-beignet-b6ffd1.netlify.app/reset-password`
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('rate limit')) {
          setMessage({ 
            type: 'error', 
            text: 'Too many reset attempts. Please wait a few minutes before trying again.' 
          });
        } else if (error.message.includes('User not found')) {
          setMessage({ 
            type: 'error', 
            text: 'No account found with this email address. Please check your email or sign up for a new account.' 
          });
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        setIsSubmitted(true);
        setMessage({ 
          type: 'success', 
          text: 'Password reset email sent! Please check your inbox and follow the instructions to reset your password.' 
        });
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error message when user starts typing
    if (message?.type === 'error') {
      setMessage(null);
    }
  };

  if (isSubmitted && message?.type === 'success') {
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
            <div className="success-icon" aria-hidden="true">
              ✓
            </div>
            <h2>Check Your Email</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p>
              Didn't receive the email? Check your spam folder or wait a few minutes for the email to arrive.
            </p>
            <button 
              type="button" 
              onClick={onNavigateToLogin} 
              className="back-btn"
              aria-label="Return to login page"
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
        <h1>Forgot Password?</h1>
        <p className="forgot-password-subtitle">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
        <p className="back-to-login-prompt">
          Remember your password? <button onClick={onNavigateToLogin} className="back-to-login-link">Back to Login</button>
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
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
              aria-describedby={message?.type === 'error' ? 'email-error' : undefined}
              aria-invalid={message?.type === 'error' ? 'true' : 'false'}
              disabled={isLoading}
            />
            {message?.type === 'error' && (
              <span id="email-error" className="sr-only">
                {message.text}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading || !email.trim()}
            aria-describedby="submit-status"
          >
            {isLoading && (
              <>
                <div className="loading-spinner" aria-hidden="true"></div>
                <span className="sr-only">Sending reset email...</span>
              </>
            )}
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </button>

          <button 
            type="button" 
            onClick={onNavigateToLogin} 
            className="back-btn"
            disabled={isLoading}
            aria-label="Cancel and return to login page"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}