
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(18);
  
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
          <div className="avatar">JD</div>
          <div className="user-details">
            <div className="welcome">Welcome, Jane Doe of XYZ Company</div>
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
            <div className="nav-item">
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
              <button className="connect-google-btn">Connect Google</button>
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
