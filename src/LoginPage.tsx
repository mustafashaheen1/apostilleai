
import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onNavigateToWelcome: () => void;
}

export default function LoginPage({ onNavigateToWelcome }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
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
              Login With Google
            </button>
            <button className="social-btn apple-btn" onClick={handleAppleLogin}>
              <span className="social-icon apple-icon"></span>
              Login With Apple
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

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>

      <div className="login-right">
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
