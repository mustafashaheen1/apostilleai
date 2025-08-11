
import React, { useState } from 'react';
import './WelcomePage.css';

interface WelcomePageProps {
  onNavigateToLogin: () => void;
}

export default function WelcomePage({ onNavigateToLogin }: WelcomePageProps) {
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
                <div className="map-header">
                  <h3>Map</h3>
                  <span className="map-date">May 2023</span>
                </div>
                <div className="world-map-svg">
                  <svg viewBox="0 0 400 200" className="map-svg">
                    {/* World Map Simplified Paths */}
                    <path d="M50 80 Q60 70 80 75 L120 70 Q140 65 160 70 L200 75 Q220 80 240 75 L280 80 Q300 85 320 80 L360 85 Q380 90 390 85" 
                          fill="#5a67d8" opacity="0.8"/>
                    <path d="M60 90 Q80 85 100 90 L140 95 Q160 90 180 95 L220 100 Q240 95 260 100 L300 105 Q320 100 340 105" 
                          fill="#5a67d8" opacity="0.9"/>
                    <path d="M40 120 Q60 115 80 120 L120 125 Q140 120 160 125 L200 130 Q220 125 240 130 L280 135 Q300 130 320 135 L360 140" 
                          fill="#5a67d8" opacity="0.7"/>
                    <path d="M70 140 Q90 135 110 140 L150 145 Q170 140 190 145 L230 150 Q250 145 270 150 L310 155 Q330 150 350 155" 
                          fill="#5a67d8" opacity="0.6"/>
                    {/* Additional map elements */}
                    <circle cx="100" cy="90" r="2" fill="#ffffff" opacity="0.8"/>
                    <circle cx="200" cy="110" r="2" fill="#ffffff" opacity="0.8"/>
                    <circle cx="300" cy="130" r="2" fill="#ffffff" opacity="0.8"/>
                  </svg>
                </div>
              </div>
              
              <div className="calendar-section">
                <div className="calendar-header">
                  <span>May 2023</span>
                </div>
                <div className="mini-calendar">
                  <div className="calendar-grid">
                    <div className="calendar-day">17</div>
                    <div className="calendar-day selected">18</div>
                    <div className="calendar-day">19</div>
                    <div className="calendar-day">20</div>
                    <div className="calendar-day">21</div>
                    <div className="calendar-day">22</div>
                    <div className="calendar-day">23</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="jobs-tracker-preview">
              <div className="jobs-header">
                <h3>Jobs Tracker</h3>
              </div>
              <div className="jobs-table">
                <div className="table-header">
                  <span>JOB #</span>
                  <span>DOCUMENT RETRIEVED</span>
                  <span>DOCUMENT NOTARIZED</span>
                  <span>STATUS</span>
                </div>
                <div className="job-row">
                  <span className="job-id">#167962</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                </div>
                <div className="job-row">
                  <span className="job-id">#315061</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                </div>
                <div className="job-row">
                  <span className="job-id">#565740</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                  <span className="status">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
