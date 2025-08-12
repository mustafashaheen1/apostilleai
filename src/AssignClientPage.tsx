import React, { useState } from 'react';
import './AssignClientPage.css';

interface Client {
  id: string;
  name: string;
  company: string;
  website: string;
  phone: string;
  initials: string;
  color: string;
}

interface AssignClientPageProps {
  onBack: () => void;
  onClose: () => void;
}

export default function AssignClientPage({ onBack, onClose }: AssignClientPageProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    fullName: '',
    company: '',
    website: '',
    officeEmail: '',
    officePhone: '',
    mobilePhone: '',
    address: ''
  });

  const clients: Client[] = [
    {
      id: '1',
      name: 'Randy Dias',
      company: 'Louis Vuitton',
      website: 'investor.thyrocare.com',
      phone: '(217) 555-0113',
      initials: 'RD',
      color: '#4ECDC4'
    },
    {
      id: '2',
      name: 'Emerson Korsgaard',
      company: 'Gillette',
      website: 'Charbi.com',
      phone: '(270) 555-0117',
      initials: 'EK',
      color: '#A8A8FF'
    },
    {
      id: '3',
      name: 'Paityn Rhiel Madsen',
      company: 'IBM',
      website: 'Staff.thyrocare.cloud',
      phone: '(704) 555-0127',
      initials: 'PM',
      color: '#90EE90'
    },
    {
      id: '4',
      name: 'Chance Vaccaro',
      company: 'Johnson & Johnson',
      website: 'vitamind.thyrocare.com',
      phone: '(225) 555-0118',
      initials: 'CV',
      color: '#F0E68C'
    },
    {
      id: '5',
      name: 'Desirae Press',
      company: "McDonald's",
      website: 'Blog.thyrocare.com',
      phone: '(671) 555-0110',
      initials: 'DP',
      color: '#4ECDC4'
    },
    {
      id: '6',
      name: 'Emery Mango',
      company: 'The Walt Disney Company',
      website: 'Covid.thyrocare.com',
      phone: '(303) 555-0105',
      initials: 'EM',
      color: '#A8A8FF'
    }
  ];

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const handleContinue = () => {
    if (selectedClient && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleCreateClientClick = () => {
    setShowCreateClientModal(true);
  };

  const handleCloseCreateClientModal = () => {
    setShowCreateClientModal(false);
    setNewClientData({
      fullName: '',
      company: '',
      website: '',
      officeEmail: '',
      officePhone: '',
      mobilePhone: '',
      address: ''
    });
  };

  const handleNewClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNewClient = () => {
    // Here you would typically save the client to your database
    console.log('Saving new client:', newClientData);
    handleCloseCreateClientModal();
    // You could add the new client to the clients list here
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Assign Client';
      case 2:
        return 'Choose a Location';
      case 3:
        return 'Create New Job';
      default:
        return 'Assign Client';
    }
  };

  return (
    <div className="assign-client-page">
      <div className="assign-client-container">
        {/* Header */}
        <div className="assign-client-header">
          <h1 className="page-title">{getStepTitle()}</h1>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className="step-container">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <span>Assign Client</span>
              </div>
              <div className="step-connector"></div>
            </div>
            
            <div className="step-container">
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <span>Choose a Location</span>
              </div>
              <div className="step-connector"></div>
            </div>
            
            <div className="step-container">
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <span>Create New Job</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="header-actions">
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
            <button 
              className="continue-btn" 
              onClick={handleContinue}
              disabled={!selectedClient}
            >
              Continue →
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        {currentStep === 1 && (
          <div className="assign-client-content">
            <div className="create-client-section">
              <button className="create-client-btn" onClick={handleCreateClientClick}>
                + Create New Client
              </button>
            </div>

            <div className="clients-table">
              <div className="table-header">
                <div className="header-cell">Name</div>
                <div className="header-cell">Company</div>
                <div className="header-cell">Website</div>
                <div className="header-cell">Office Phone</div>
                <div className="header-cell"></div>
              </div>

              <div className="table-body">
                {clients.map((client) => (
                  <div key={client.id} className="table-row">
                    <div className="name-cell">
                      <div 
                        className="client-avatar" 
                        style={{ backgroundColor: client.color }}
                      >
                        {client.initials}
                      </div>
                      <span className="client-name">{client.name}</span>
                    </div>
                    <div className="cell">{client.company}</div>
                    <div className="cell">{client.website}</div>
                    <div className="cell">{client.phone}</div>
                    <div className="actions-cell">
                      <button className="view-details-btn">View Details</button>
                      <button 
                        className={`choose-btn ${selectedClient === client.id ? 'selected' : ''}`}
                        onClick={() => handleClientSelect(client.id)}
                      >
                        {selectedClient === client.id ? 'Selected' : 'Choose'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="location-content">
            <h2>Choose a Location</h2>
            <p>Location selection content will go here...</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="job-creation-content">
            <h2>Create New Job</h2>
            <p>Job creation form will go here...</p>
          </div>
        )}
      </div>

      {/* Create New Client Modal */}
      {showCreateClientModal && (
        <div className="create-client-modal-overlay">
          <div className="create-client-modal">
            <div className="modal-header">
              <h2>Create New Client</h2>
              <button className="modal-close-btn" onClick={handleCloseCreateClientModal}>
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={newClientData.fullName}
                  onChange={handleNewClientInputChange}
                />
              </div>

              <div className="form-field">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={newClientData.company}
                  onChange={handleNewClientInputChange}
                />
              </div>

              <div className="form-field">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={newClientData.website}
                  onChange={handleNewClientInputChange}
                />
              </div>

              <div className="form-field">
                <label>Office Email</label>
                <input
                  type="email"
                  name="officeEmail"
                  placeholder="Office Email"
                  value={newClientData.officeEmail}
                  onChange={handleNewClientInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Office Phone</label>
                  <input
                    type="tel"
                    name="officePhone"
                    placeholder="Office Phone"
                    value={newClientData.officePhone}
                    onChange={handleNewClientInputChange}
                  />
                </div>
                <div className="form-field">
                  <label>Mobile Phone</label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    placeholder="Mobile Phone"
                    value={newClientData.mobilePhone}
                    onChange={handleNewClientInputChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Address 1</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address 1"
                  value={newClientData.address}
                  onChange={handleNewClientInputChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseCreateClientModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveNewClient}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}