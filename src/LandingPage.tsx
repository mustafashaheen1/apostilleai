import React from 'react';
import { Zap, Shield, Globe, CheckCircle, Star, Check, FileText, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';
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
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">AI-Powered Processing</h3>
            <p className="text-gray-600 text-center">Our advanced AI analyzes documents instantly, identifying requirements and ensuring compliance automatically.</p>
          </div>
          
          <div className="feature-card">
            <div className="icon-container">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="card-heading">Secure & Compliant</h3>
            <p className="card-description">Enterprise-grade security with full compliance to international apostille conventions and regulations.</p>
          </div>
          
          <div className="feature-card">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Global Coverage</h3>
            <p className="text-gray-600 text-center">Process apostilles for documents from 190+ countries with local expertise and legal requirements.</p>
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
          <div className="plans-include max-w-4xl mx-auto mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="include-header">
              <Zap size={20} color="#2563eb" />
              All plans include:
            </div>
            <div className="include-features">
              <div className="include-item">
                <Check size={20} color="#10b981" />
                Bank-level security
              </div>
              <div className="include-item">
                <Check size={20} color="#10b981" />
                190+ countries supported
              </div>
              <div className="include-item">
                <Check size={20} color="#10b981" />
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
                  <FileText size={24} color="white" />
                </div>
                <span>Apostille.ai™</span>
              </div>
              <p className="footer-description">
                The world's most advanced AI-powered apostille service. 
                Streamline your document authentication process with 
                cutting-edge technology and global compliance.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Twitter" className="social-icon">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="social-icon">
                  <Linkedin size={20} />
                </a>
                <a href="#" aria-label="Facebook" className="social-icon">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
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
                  <Mail size={16} />
                  support@apostille.ai
                </li>
                <li>
                  <Phone size={16} />
                  +1 (555) 123-4567
                </li>
                <li>
                  <MapPin size={16} />
                  <span>123 Innovation Drive<br />San Francisco, CA 94105</span>
                </li>
              </ul>
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