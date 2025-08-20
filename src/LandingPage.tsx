import React from 'react';
import { Zap, Shield, Globe, CheckCircle, Star, Check } from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onNavigateToSignUp: () => void;
  onNavigateToLogin: () => void;
}

export default function LandingPage({ onNavigateToSignUp, onNavigateToLogin }: LandingPageProps) {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="3" fill="white"/>
                <path d="M8 12h8M8 8h8M8 16h5" stroke="#2562EB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Apostille.ai™</span>
          </div>
          
          <div className="nav-links">
            <a href="#dashboard">Dashboard</a>
            <a href="#documents">Documents</a>
            <a href="#pricing">Pricing</a>
            <a href="#support">Support</a>
          </div>
          
          <div className="nav-actions">
            <button className="sign-in-btn" onClick={onNavigateToLogin}>Sign In</button>
            <button className="get-started-btn" onClick={onNavigateToSignUp}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#2562EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            AI-Powered Document Authentication
          </div>
          
          <h1 className="hero-title">
            Generate state-specific forms in <span className="hero-highlight">minutes</span>
          </h1>
          
          <p className="hero-subtitle">
            All-in-one Apostille & Embassy Legalization Platform
          </p>
          
          <div className="hero-actions">
            <button className="try-free-btn" onClick={onNavigateToSignUp}>
              Try for Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="watch-demo-btn">Watch Demo</button>
          </div>
          
          <div className="hero-features">
            <div className="feature-item">
              <CheckCircle size={16} color="#10b981" />
              SOC 2 Compliant
            </div>
            <div className="feature-item">
              <Shield size={16} color="#10b981" />
              Bank-Level Security
            </div>
            <div className="feature-item">
              <Globe size={16} color="#10b981" />
              190+ Countries Supported
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} color="#2563eb" />
            </div>
            <h3>AI-Powered Processing</h3>
            <p>Our advanced AI analyzes documents instantly, identifying requirements and ensuring compliance automatically.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} color="#2563eb" />
            </div>
            <h3>Secure & Compliant</h3>
            <p>Enterprise-grade security with full compliance to international apostille conventions and regulations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={32} color="#2563eb" />
            </div>
            <h3>Global Coverage</h3>
            <p>Process apostilles for documents from 190+ countries with local expertise and legal requirements.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the perfect plan for your apostille needs. All plans include our AI-powered processing and secure document handling.</p>
          </div>
          
          <div className="pricing-cards">
            {/* Starter Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3>Starter</h3>
                <p>Perfect for individuals and small<br />businesses</p>
              </div>
              <div className="card-price">
                <span className="price">$29</span>
                <span className="period">/month</span>
              </div>
              <ul className="card-features">
                <li>
                  <Check size={20} color="#10b981" />
                  5 documents per month
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Basic AI processing
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Email support
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Standard processing time
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Basic document types
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Mobile app access
                </li>
              </ul>
              <button className="card-button secondary">Start Free Trial</button>
            </div>

            {/* Professional Plan */}
            <div className="pricing-card featured">
              <div className="popular-badge">
                <Star size={16} color="#ffffff" className="mr-1" />
                Most Popular
              </div>
              <div className="card-header">
                <h3>Professional</h3>
                <p>Ideal for growing businesses and professionals</p>
              </div>
              <div className="card-price">
                <span className="price">$79</span>
                <span className="period">/month</span>
              </div>
              <ul className="card-features">
                <li>
                  <Check size={20} color="#10b981" />
                  25 documents per month
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Advanced AI processing
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Priority support
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Faster processing time
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  All document types
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  API access
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Bulk processing
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Custom workflows
                </li>
              </ul>
              <button className="card-button primary" onClick={onNavigateToSignUp}>Start Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3>Enterprise</h3>
                <p>For large organizations with high volume needs</p>
              </div>
              <div className="card-price">
                <span className="price">$199</span>
                <span className="period">/month</span>
              </div>
              <ul className="card-features">
                <li>
                  <Check size={20} color="#10b981" />
                  Unlimited documents
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Premium AI processing
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  24/7 phone support
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Fastest processing time
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  All document types
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Full API access
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Advanced analytics
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Custom integrations
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  Dedicated account manager
                </li>
                <li>
                  <Check size={20} color="#10b981" />
                  SLA guarantee
                </li>
              </ul>
              <button className="card-button secondary">Contact Sales</button>
            </div>
          </div>
          
          {/* All Plans Include */}
          <div className="plans-include">
            <div className="include-header">
              <Zap size={20} color="#2563eb" />
              All plans include:
            </div>
            <div className="include-features">
              <div className="include-item">
                <CheckCircle size={16} color="#10b981" />
                Bank-level security
              </div>
              <div className="include-item">
                <CheckCircle size={16} color="#10b981" />
                190+ countries supported
              </div>
              <div className="include-item">
                <CheckCircle size={16} color="#10b981" />
                30-day money-back guarantee
              </div>
            </div>
          </div>
          
          <div className="pricing-faq">
            <p>Have questions about our pricing? <a href="#faq">Check our FAQ</a></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="3" fill="white"/>
                    <path d="M8 12h8M8 8h8M8 16h5" stroke="#2562EB" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span>Apostille.ai™</span>
              </div>
              <p className="footer-description">
                The world's most advanced AI-powered apostille service. 
                Streamline your document authentication process with 
                cutting-edge technology and global compliance.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#dashboard">Dashboard</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#api">API Documentation</a></li>
                  <li><a href="#support">Support Center</a></li>
                  <li><a href="#status">System Status</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Contact</h4>
                <ul>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    support@apostille.ai
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    +1 (555) 123-4567
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    123 Innovation Drive<br />San Francisco, CA 94105
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2024 Apostille.ai™. All rights reserved.
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}