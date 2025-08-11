
import React, { useState } from 'react';
import './WelcomePage.css';

export default function WelcomePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  const handleAppleSignUp = () => {
    console.log('Apple sign up clicked');
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
            If you already have an account <a href="#" className="login-link">Login</a>
          </p>

          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={handleGoogleSignUp}>
              <span className="social-icon">G</span>
              Sign Up With Google
            </button>
            <button className="social-btn apple-btn" onClick={handleAppleSignUp}>
              <span className="social-icon">🍎</span>
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
                  👁️
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Re-enter Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <a href="#" className="terms-link">Terms & Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="signup-btn" disabled={!agreeToTerms}>
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="welcome-right">
        <div className="promo-content">
          <h2>Apostille AI is the best way to suspendisse eu sed euismod nibh lectus pellentesque velit leo condimentum.</h2>
          
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-logo">
                <div className="logo-icon">A</div>
                <span>Apostille.AI</span>
                <span className="beta">BETA</span>
              </div>
              <div className="preview-user">Welcome, Jane Doe of XYZ Company</div>
            </div>
            
            <div className="preview-sidebar">
              <div className="sidebar-item">🔔 Notifications <span className="notification-badge">4</span></div>
              <div className="sidebar-section">MENU</div>
              <div className="sidebar-item active">📊 Dashboard</div>
              <div className="sidebar-item">📄 UCC3 Termination</div>
              <div className="sidebar-item">🏷️ Generate Shipping Label</div>
              <div className="sidebar-item">📁 Vital Records Retrieval</div>
              <div className="sidebar-item">📋 Court Document Retrieval</div>
              <div className="sidebar-item">📚 Library</div>
              <div className="sidebar-item">✅ Initialize Notarization</div>
              <div className="sidebar-item">🏛️ Embassy Legalization</div>
              <div className="sidebar-item">🔐 USCIS Authentication</div>
              <div className="sidebar-item">🤖 Ask AI (BETA)</div>
              <div className="sidebar-item">👆 Fingerprints (Coming Soon)</div>
              <div className="sidebar-section">OTHERS</div>
              <div className="sidebar-item">⚙️ Settings</div>
              <div className="sidebar-item">💳 Billing</div>
              <div className="sidebar-item">📖 Guide & Resources</div>
              <div className="sidebar-item">❓ Help Desk</div>
              <div className="sidebar-item">🚪 Logout</div>
            </div>

            <div className="preview-main">
              <div className="world-map">
                <div className="map-placeholder">🗺️ World Map View</div>
              </div>
              
              <div className="jobs-preview">
                <h3>Jobs Tracker</h3>
                <div className="job-row">
                  <span className="job-id">#167962</span>
                  <span>Completed</span>
                  <span>Completed</span>
                  <span>Completed</span>
                </div>
                <div className="job-row">
                  <span className="job-id">#315061</span>
                  <span>Completed</span>
                  <span>Completed</span>
                  <span>Completed</span>
                </div>
                <div className="job-row">
                  <span className="job-id">#565740</span>
                  <span>Completed</span>
                  <span>Completed</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
