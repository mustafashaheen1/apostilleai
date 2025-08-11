import React, { useState, useEffect } from 'react';
import './App.css';
import { googleCalendarService, CalendarEvent } from './googleCalendar';
import { OAuthService, OAuthUser } from './oauthService';
// Database service removed
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'welcome' | 'login'>('welcome');
  const [selectedDate, setSelectedDate] = useState(18);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthUser, setOauthUser] = useState<OAuthUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleConnect = async () => {
    if (isGoogleConnected) {
      // Sign out
      await googleCalendarService.signOut();
      setIsGoogleConnected(false);
      setCalendarEvents([]);
      return;
    }

    setIsConnecting(true);
    try {
      const success = await googleCalendarService.signIn();
      if (success) {
        setIsGoogleConnected(true);
        // Fetch calendar events
        const events = await googleCalendarService.getEvents();
        setCalendarEvents(events);
      }
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if user is already signed in on component mount and handle OAuth callbacks
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const idToken = urlParams.get('id_token');

      if (code) {
        setIsAuthenticating(true);

        if (window.location.pathname.includes('/auth/google/callback')) {
          const user = await OAuthService.handleGoogleCallback(code);
          if (user) {
            OAuthService.saveUserSession(user);
            setOauthUser(user);
            setCurrentPage('dashboard');
          }
        } else if (window.location.pathname.includes('/auth/apple/callback')) {
          const user = await OAuthService.handleAppleCallback(code, idToken || undefined);
          if (user) {
            OAuthService.saveUserSession(user);
            setOauthUser(user);
            setCurrentPage('dashboard');
          }
        }

        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsAuthenticating(false);
      }
    };

    const checkSignInStatus = async () => {
      // Database initialization removed

      // Check for existing OAuth session
      const existingUser = OAuthService.getUserSession();
      if (existingUser) {
        setOauthUser(existingUser);
        setCurrentPage('dashboard');
      }

      await googleCalendarService.initializeGapi();
      const isSignedIn = googleCalendarService.isUserSignedIn();
      if (isSignedIn) {
        setIsGoogleConnected(true);
        const events = await googleCalendarService.getEvents();
        setCalendarEvents(events);
      }
    };

    handleOAuthCallback();
    checkSignInStatus();
  }, []);

  // Sample job data
  const jobs = [
    { id: '#167962', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Shipped' },
    { id: '#315061', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Certified' },
    { id: '#565740', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Delivered' },
  ];

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = 31;
    const startDay = 1; // Monday start

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${day === selectedDate ? 'selected' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (currentPage === 'welcome') {
    return <WelcomePage onNavigateToLogin={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigateToWelcome={() => setCurrentPage('welcome')} />;
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">A</div>
          <span>Apostille.AI</span>
          <span className="beta">BETA</span>
        </div>

        <div className="user-info">
          <div className="avatar">
            {oauthUser?.picture ? (
              <img src={oauthUser.picture} alt="Profile" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
            ) : (
              <div>{oauthUser?.name?.charAt(0) || 'JD'}</div>
            )}
          </div>
          <div className="user-details">
            <div className="welcome">Welcome, {oauthUser?.name || 'Jane Doe of XYZ Company'}</div>
            <div className="date">Thursday, May 18, 2023</div>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <div className="nav-item">
              <span className="nav-icon">🔔</span>
              Notifications
              <span className="badge">4</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="section-title">MENU</div>
            <div className="nav-item active">
              <span className="nav-icon">📊</span>
              Dashboard
            </div>
            <div className="nav-item">
              <span className="nav-icon">📄</span>
              UCC3 Termination
            </div>
            <div className="nav-item">
              <span className="nav-icon">🏷️</span>
              Generate Shipping Label
            </div>
            <div className="nav-item">
              <span className="nav-icon">📁</span>
              Vital Records Retrieval
            </div>
            <div className="nav-item">
              <span className="nav-icon">📋</span>
              Court Document Retrieval
            </div>
            <div className="nav-item">
              <span className="nav-icon">📚</span>
              Library
            </div>
            <div className="nav-item">
              <span className="nav-icon">✅</span>
              Initialize Notarization
            </div>
            <div className="nav-item">
              <span className="nav-icon">🏛️</span>
              Embassy Legalization
            </div>
            <div className="nav-item">
              <span className="nav-icon">🔐</span>
              USCIS Authentication
            </div>
            <div className="nav-item">
              <span className="nav-icon">🤖</span>
              Ask AI (BETA)
            </div>
            <div className="nav-item">
              <span className="nav-icon">👆</span>
              Fingerprints (Coming Soon)
            </div>
          </div>

          <div className="nav-section">
            <div className="section-title">OTHERS</div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span>
              Settings
            </div>
            <div className="nav-item">
              <span className="nav-icon">💳</span>
              Billing
            </div>
            <div className="nav-item">
              <span className="nav-icon">📖</span>
              Guide & Resources
            </div>
            <div className="nav-item">
              <span className="nav-icon">❓</span>
              Help Desk
            </div>
            <div className="nav-item" onClick={() => setCurrentPage('welcome')}>
              <span className="nav-icon">👋</span>
              Welcome Page
            </div>
            <div className="nav-item" onClick={() => setCurrentPage('login')}>
              <span className="nav-icon">🔐</span>
              Login Page
            </div>
            <div className="nav-item" onClick={() => {
              OAuthService.clearUserSession();
              setOauthUser(null);
              setCurrentPage('welcome');
              setIsGoogleConnected(false);
              setCalendarEvents([]);
            }}>
              <span className="nav-icon">🚪</span>
              Logout
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <button className="create-job-btn">+ Create Job</button>
        </div>

        <div className="content-grid">
          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="section-header">
              <h2>Calendar</h2>
              <button 
                className="connect-google-btn" 
                onClick={handleGoogleConnect}
                disabled={isConnecting}
              >
                {isConnecting 
                  ? 'Connecting...' 
                  : isGoogleConnected 
                    ? 'Disconnect Google' 
                    : 'Connect Google'
                }
              </button>
            </div>
            <div className="calendar">
              <div className="calendar-header">
                <button>‹</button>
                <span>May 2023</span>
                <button>›</button>
              </div>
              <div className="calendar-weekdays">
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
                <div>Su</div>
              </div>
              <div className="calendar-grid">
                {renderCalendar()}
              </div>
            </div>

            {isGoogleConnected && (
              <div className="calendar-events">
                <h3>Upcoming Events</h3>
                {calendarEvents.length > 0 ? (
                  <div className="events-list">
                    {calendarEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="event-item">
                        <div className="event-title">{event.summary || 'No title'}</div>
                        <div className="event-time">
                          {event.start?.dateTime 
                            ? new Date(event.start.dateTime).toLocaleString()
                            : event.start?.date 
                              ? new Date(event.start.date).toLocaleDateString()
                              : 'No time'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-events">No upcoming events found</div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h2>Quick Stats</h2>
            <div className="stat-item">
              <span>Active Jobs</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span>Completed This Month</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span>Pending Review</span>
              <span className="stat-value">1</span>
            </div>
          </div>
        </div>

        {/* Jobs Tracker */}
        <div className="jobs-tracker">
          <div className="section-header">
            <h2>Jobs Tracker</h2>
            <button className="create-new-job-btn">+ Create New Job</button>
          </div>

          <div className="jobs-table">
            <div className="table-header">
              <div>JOB #</div>
              <div>DOCUMENT RETRIEVED</div>
              <div>DOCUMENT NOTARIZED</div>
              <div>DOCUMENT TRANSLATED</div>
              <div>STATUS</div>
            </div>

            {jobs.map((job, index) => (
              <div key={index} className="table-row">
                <div className="job-id">{job.id}</div>
                <div className="status-cell">{job.retrieved}</div>
                <div className="status-cell">{job.notarized}</div>
                <div className="status-cell">{job.translated}</div>
                <div className={`status-badge ${job.status.toLowerCase()}`}>
                  {job.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn virtual-assistant">
            💼 Hire Virtual Assistant
          </button>
          <div className="help-banner">
            ⚠️ Need Help With Delivery? Contact Support
            <div className="premium-feature">Premium feature</div>
          </div>
          <button className="action-btn hire-courier">
            🚗 Hire An On-Demand Apostille Courier Same-day service where available
          </button>
        </div>
      </div>
    </div>
  );
}