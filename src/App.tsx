import React, { useState, useEffect } from 'react';
import './App.css';
import { googleCalendarService, CalendarEvent } from './googleCalendar';
import { AuthService } from './authService';
import { User } from './supabase';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import ApostilleRequestForm from './ApostilleRequestForm';
import AssignClientPage from './AssignClientPage';
import ForgotPasswordPage from './ForgotPasswordPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'welcome' | 'login' | 'forgot-password' | 'apostille-request' | 'assign-client'>('welcome');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
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
      setIsAuthenticating(true);
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('welcome');
      }
      setIsAuthenticating(false);

      await googleCalendarService.initializeGapi();
      const isSignedIn = googleCalendarService.isUserSignedIn();
      if (isSignedIn) {
        setIsGoogleConnected(true);
        const events = await googleCalendarService.getEvents();
        setCalendarEvents(events);
      }
    };

    const handleNavigateToApostilleForm = () => {
      setCurrentPage('apostille-request');
    };

    window.addEventListener('navigateToApostilleForm', handleNavigateToApostilleForm);

    checkAuthStatus();

    return () => {
      window.removeEventListener('navigateToApostilleForm', handleNavigateToApostilleForm);
    };
  }, []);

  const handleSignUpSuccess = () => {
    // Reload user data after successful signup
    const loadUser = async () => {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
    setCurrentPage('dashboard');
  };

  const handleLoginSuccess = () => {
    // Reload user data after successful login
    const loadUser = async () => {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and number of days in the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Adjust for Monday start (0 = Sunday, 1 = Monday, etc.)
    const mondayStartOffset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < mondayStartOffset; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty">
        </div>
      );
    }
    
    // Days of the current month
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

    // Add next month's days to fill the remaining cells to complete 35 cells (5 rows × 7 columns)
    const totalCells = 35;
    const nextMonthDays = totalCells - mondayStartOffset - daysInMonth;
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day next-month">
          {day}
        </div>
      );
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    // Reset selected date when changing months
    setSelectedDate(1);
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
      onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
      onLoginSuccess={handleLoginSuccess}
    />;
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage 
      onNavigateToLogin={() => setCurrentPage('login')}
    />;
  }

  if (currentPage === 'apostille-request') {
    return <ApostilleRequestForm 
      onBack={() => setCurrentPage('dashboard')}
    />;
  }

  if (currentPage === 'assign-client') {
    return <AssignClientPage 
      onBack={() => setCurrentPage('dashboard')}
      onClose={() => setCurrentPage('dashboard')}
    />;
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-row">
          <div className="logo-icon">A</div>
          <span>Apostille.AI</span>
          <span className="beta">BETA</span>
          </div>
          <p className="powered-by">Powered by Apostille Technologies LLC</p>
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
              <span className="nav-icon">🔄</span>
              <span onClick={() => setCurrentPage('apostille-request')}>USCIS Translation</span>
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
              <div className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="welcome">Welcome, {currentUser?.full_name || 'Jane Doe'} of {currentUser?.company || 'XYZ Company'}</div>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Search" />
            </div>
            <button className="create-job-btn" onClick={() => setCurrentPage('assign-client')}>+ Create Job</button>
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
                <button onClick={() => navigateMonth('prev')}>‹</button>
                <span>{getMonthName(currentDate)}</span>
                <button onClick={() => navigateMonth('next')}>›</button>
              </div>
              <div className="calendar-weekdays">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
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
            <button className="create-new-job-btn" onClick={() => setCurrentPage('assign-client')}>+ Create New Job</button>
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