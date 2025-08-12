import React, { useState, useEffect } from 'react';
import './App.css';
import { googleCalendarService, CalendarEvent } from './googleCalendar';
import { AuthService } from './authService';
import { User } from './supabase';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'welcome' | 'login'>('welcome');
  const [selectedDate, setSelectedDate] = useState(18);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleConnect = async () => {
    if (isGoogleConnected) {
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
        const events = await googleCalendarService.getEvents();
        setCalendarEvents(events);
      }
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
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

    checkAuthStatus();
  }, []);

  const handleSignUpSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    setCurrentPage('welcome');
    setIsGoogleConnected(false);
    setCalendarEvents([]);
  };

  const jobs = [
    { id: '#167952', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Shipped' },
    { id: '#315061', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Certified' },
    { id: '#495740', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Delivered' },
  ];

  const renderCalendar = () => {
    const days = [];
    
    // May 1, 2023 was a Monday, so we need to start from the first column
    // Add empty cells for days before the 1st if needed
    const firstDayOfWeek = 1; // Monday = 1, Tuesday = 2, etc.
    
    // Add empty cells for days before May 1st (none needed since May 1st is Monday)
    for (let i = 0; i < firstDayOfWeek - 1; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the current month (May 2023: 31 days)
    const daysInMonth = 31;
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

    // Add next month's days to fill the remaining cells (need 4 more to complete 35 cells)
    const nextMonthDays = 4;
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day next-month">
          {day}
        </div>
      );
    }

    return days;
  };

  if (currentPage === 'welcome') {
    return <WelcomePage 
      onNavigateToLogin={() => setCurrentPage('login')} 
      onSignUpSuccess={handleSignUpSuccess}
    />;
  }

  if (currentPage === 'login') {
    return <LoginPage 
      onNavigateToWelcome={() => setCurrentPage('welcome')} 
      onLoginSuccess={handleLoginSuccess}
    />;
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
        <div className="powered-by">Powered by Apostille Developers LLC</div>

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
              <span className="nav-icon">🔄</span>
              USCIS Translation
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
              Initialise Notarisation
            </div>
            <div className="nav-item">
              <span className="nav-icon">🏛️</span>
              Embassy Legalisation
            </div>
            <div className="nav-item">
              <span className="nav-icon">🔐</span>
              USDOS Authentication
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
              Billings
            </div>
            <div className="nav-item">
              <span className="nav-icon">📖</span>
              Guide & Resources
            </div>
            <div className="nav-item">
              <span className="nav-icon">❓</span>
              Help Desk
            </div>
            <div className="nav-item" onClick={() => {
              handleLogout();
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
          <div className="header-left">
            <div className="user-avatar">
              {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'JD'}
            </div>
            <div className="header-info">
              <div className="date">Thursday, May 18, 2023</div>
              <div className="welcome">Welcome, {currentUser?.full_name || 'Jane Doe'} of XYZ Company</div>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Search" />
            </div>
            <button className="create-job-btn">+ Create Job</button>
          </div>
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
              <span className="stat-value">3</span>
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
            🚗 Hire An On-Demand Apostille Courier
            <div className="courier-subtitle">Same-day service where available</div>
          </button>
        </div>
      </div>
    </div>
  );
}