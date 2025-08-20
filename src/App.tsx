import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Bell, LayoutDashboard, Users, Package, Library, Stamp, Building, Shield, Bot, Fingerprint, Settings, CreditCard, BookOpen, HelpCircle, LogOut } from 'lucide-react';
import './App.css';
import { googleCalendarService, CalendarEvent } from './googleCalendar';
import { AuthService } from './authService';
import { User } from './supabase';
import LandingPage from './LandingPage';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import ApostilleRequestForm from './ApostilleRequestForm';
import AssignClientPage from './AssignClientPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
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
    // Handle password reset tokens in URL (for when user visits deployed site directly)
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(urlHash.substring(1));
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const type = urlParams.get('type') || hashParams.get('type');
    
    // Handle localhost redirects for password reset
    if (window.location.hostname === 'localhost' && type === 'recovery' && accessToken) {
      const deployedUrl = 'https://animated-beignet-b6ffd1.netlify.app/reset-password' + window.location.hash;
      window.location.replace(deployedUrl);
      return;
    }
    
    if (type === 'recovery' && accessToken && window.location.pathname !== '/reset-password') {
      // Redirect to reset password page with tokens
      navigate('/reset-password' + window.location.hash);
      return;
    }

    const checkAuthStatus = async () => {
      setIsAuthenticating(true);
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // Only navigate to dashboard if we're on the root path
        if (location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // Only navigate to welcome if we're on a protected route
        const protectedRoutes = ['/dashboard', '/apostille-request', '/assign-client'];
        if (protectedRoutes.includes(location.pathname)) {
          navigate('/welcome', { replace: true });
        }
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

    checkAuthStatus();

  }, [navigate, location.pathname]);

  const handleSignUpSuccess = () => {
    // Reload user data after successful signup
    const loadUser = async () => {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        navigate('/dashboard');
      }
    };
    loadUser();
  };

  const handleLoginSuccess = () => {
    // Reload user data after successful login and navigate
    const loadUser = async () => {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        navigate('/dashboard');
      }
    };
    loadUser();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    navigate('/welcome');
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

  // Show loading screen while authenticating
  if (isAuthenticating) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      }}>
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
          <p style={{ color: '#7f8c8d' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage onNavigateToSignUp={() => navigate('/welcome')} onNavigateToLogin={() => navigate('/login')} />
      } />
      
      <Route path="/welcome" element={
        <WelcomePage 
          onNavigateToLogin={() => navigate('/login')} 
          onSignUpSuccess={handleSignUpSuccess}
        />
      } />
      
      <Route path="/login" element={
        <LoginPage 
          onNavigateToWelcome={() => navigate('/welcome')} 
          onNavigateToForgotPassword={() => navigate('/forgot-password')}
          onLoginSuccess={handleLoginSuccess}
        />
      } />
      
      <Route path="/forgot-password" element={
        <ForgotPasswordPage 
          onNavigateToLogin={() => navigate('/login')}
        />
      } />
      
      <Route path="/reset-password" element={
        <ResetPasswordPage 
          onNavigateToLogin={() => navigate('/login')}
        />
      } />
      
      <Route path="/apostille-request" element={
        currentUser ? (
          <ApostilleRequestForm 
            onBack={() => navigate('/dashboard')}
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/assign-client" element={
        currentUser ? (
          <AssignClientPage 
            onBack={() => navigate('/dashboard')}
            onClose={() => navigate('/dashboard')}
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/dashboard" element={
        currentUser ? (
          <DashboardContent 
            currentUser={currentUser}
            currentDate={currentDate}
            selectedDate={selectedDate}
            isGoogleConnected={isGoogleConnected}
            calendarEvents={calendarEvents}
            isConnecting={isConnecting}
            handleGoogleConnect={handleGoogleConnect}
            renderCalendar={renderCalendar}
            getMonthName={getMonthName}
            navigateMonth={navigateMonth}
            handleLogout={handleLogout}
            navigate={navigate}
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

// Separate dashboard component to keep the routing clean
function DashboardContent({ 
  currentUser, 
  currentDate, 
  selectedDate, 
  isGoogleConnected, 
  calendarEvents, 
  isConnecting, 
  handleGoogleConnect, 
  renderCalendar, 
  getMonthName, 
  navigateMonth, 
  handleLogout,
  navigate 
}: {
  currentUser: User;
  currentDate: Date;
  selectedDate: number;
  isGoogleConnected: boolean;
  calendarEvents: CalendarEvent[];
  isConnecting: boolean;
  handleGoogleConnect: () => void;
  renderCalendar: () => React.ReactNode[];
  getMonthName: (date: Date) => string;
  navigateMonth: (direction: 'prev' | 'next') => void;
  handleLogout: () => void;
  navigate: (path: string) => void;
}) {
  const jobs = [
    { id: '#167952', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Shipped' },
    { id: '#315061', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Certified' },
    { id: '#495740', retrieved: 'Completed', notarized: 'Completed', translated: 'Completed', status: 'Delivered' },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText size={24} color="white" />
            </div>
            <span className="text-lg font-bold text-white">Apostille.AI</span>
            <span className="bg-blue-900 text-blue-400 text-xs px-2 py-1 rounded ml-1">BETA</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">Powered by Apostille Developers LLC</p>
        </div>

        {/* Notifications Section */}
        <div className="p-4">
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center">
              <Bell size={16} className="mr-2" />
              <span className="text-sm">Notifications</span>
            </div>
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">4</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          {/* MENU Section */}
          <div className="nav-section">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-4">MENU</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors bg-blue-600 text-white">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Dashboard
              </button>
              <button 
                className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => navigate('/apostille-request')}
              >
                <Users className="h-4 w-4 mr-3" />
                USCIS Translation
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Package className="h-4 w-4 mr-3" />
                Generate Shipping Label
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <FileText className="h-4 w-4 mr-3" />
                Vital Records Retrieval
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <FileText className="h-4 w-4 mr-3" />
                Court Document Retrieval
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Library className="h-4 w-4 mr-3" />
                Library
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Stamp className="h-4 w-4 mr-3" />
                Initialise Notarisation
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Building className="h-4 w-4 mr-3" />
                Embassy Legalisation
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Shield className="h-4 w-4 mr-3" />
                USDOS Authentication
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Bot className="h-4 w-4 mr-3" />
                Ask AI (BETA)
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Fingerprint className="h-4 w-4 mr-3" />
                Fingerprints (Coming Soon)
              </button>
            </div>
          </div>

          {/* OTHERS Section */}
          <div className="nav-section">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-4 mt-8">OTHERS</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <CreditCard className="h-4 w-4 mr-3" />
                Billings
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <BookOpen className="h-4 w-4 mr-3" />
                Guide & Resources
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                <HelpCircle className="h-4 w-4 mr-3" />
                Help Desk
              </button>
              <button 
                className="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
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
            <button className="create-job-btn" onClick={() => navigate('/assign-client')}>+ Create Job</button>
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
            <button className="create-new-job-btn" onClick={() => navigate('/assign-client')}>+ Create New Job</button>
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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}