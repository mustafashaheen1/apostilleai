import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AccountTypePage.css';

interface AccountTypePageProps {
  onNavigateToLanding: () => void;
}

export default function AccountTypePage({ onNavigateToLanding }: AccountTypePageProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'company' | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (type: 'individual' | 'company') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      navigate('/welcome', { state: { accountType: selectedType } });
    }
  };

  const handleBack = () => {
    onNavigateToLanding();
  };

  return (
    <div className="account-type-page">
      <div className="account-type-header">
        <div className="account-type-logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="white"/>
              <path d="M8 12h8M8 8h8M8 16h5" stroke="#2562EB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span>Apostille.ai™</span>
          <span className="beta">BETA</span>
        </div>
        <p className="powered-by">Powered by Apostille Technologies LLC</p>
      </div>

      <div className="account-type-container">
        <h1>Choose Your Account Type</h1>
        <p className="account-type-subtitle">
          Select the type of account that best describes how you'll be using Apostille.ai
        </p>

        <div className="account-type-cards">
          <div 
            className={`account-type-card ${selectedType === 'individual' ? 'selected' : ''}`}
            onClick={() => handleCardClick('individual')}
          >
            <div className="card-icon">
              <User size={24} />
            </div>
            <h3 className="card-title">Individual</h3>
            <p className="card-description">
              Personal use for individual document authentication and apostille services
            </p>
          </div>

          <div 
            className={`account-type-card ${selectedType === 'company' ? 'selected' : ''}`}
            onClick={() => handleCardClick('company')}
          >
            <div className="card-icon">
              <Building2 size={24} />
            </div>
            <h3 className="card-title">Company</h3>
            <p className="card-description">
              Business use for corporate document processing and team collaboration
            </p>
          </div>
        </div>

        <div className="account-type-actions">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <button 
            className="continue-btn" 
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}