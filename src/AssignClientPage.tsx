import React, { useState } from 'react';
import { useEffect } from 'react';
import './AssignClientPage.css';
import { ClientService, Client, CreateClientData } from './clientService';

// Google Places API types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

interface AssignClientPageProps {
  onBack: () => void;
  onClose: () => void;
}

export default function AssignClientPage({ onBack, onClose }: AssignClientPageProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [newClientData, setNewClientData] = useState({
    fullName: '',
    company: '',
    website: '',
    officeEmail: '',
    officePhone: '',
    mobilePhone: '',
    address: ''
  });

  useEffect(() => {
    loadClients();
    loadGooglePlacesScript();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    const { clients: fetchedClients, error } = await ClientService.getClients();
    if (error) {
      setError(error);
    } else {
      setClients(fetchedClients);
    }
    setIsLoading(false);
  };

  const loadGooglePlacesScript = () => {
    if (window.google) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_PLACES_API_KEY&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    
    window.initAutocomplete = () => {
      // This will be called when the script loads
    };
    
    document.head.appendChild(script);
  };

  const initializeAutocomplete = () => {
    if (!window.google) return;

    const addressInput = document.getElementById('address-input') as HTMLInputElement;
    if (!addressInput) return;

    const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setNewClientData(prev => ({
          ...prev,
          address: place.formatted_address
        }));
      }
    });
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Validate website
    if (newClientData.website && newClientData.website.trim()) {
      const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!websiteRegex.test(newClientData.website.trim())) {
        errors.website = 'Please enter a valid website URL';
      }
    }

    // Validate email
    if (newClientData.officeEmail && newClientData.officeEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newClientData.officeEmail.trim())) {
        errors.officeEmail = 'Please enter a valid email address';
      }
    }

    // Validate office phone
    if (newClientData.officePhone && newClientData.officePhone.trim()) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(newClientData.officePhone.trim())) {
        errors.officePhone = 'Phone number should contain only digits, spaces, hyphens, parentheses, and plus signs';
      }
    }

    // Validate mobile phone
    if (newClientData.mobilePhone && newClientData.mobilePhone.trim()) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(newClientData.mobilePhone.trim())) {
        errors.mobilePhone = 'Phone number should contain only digits, spaces, hyphens, parentheses, and plus signs';
      }
    }

    // Required field validation
    if (!newClientData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    // Initialize autocomplete after modal opens
    setTimeout(() => {
      initializeAutocomplete();
    }, 100);
  };

  const handleCloseCreateClientModal = () => {
    setShowCreateClientModal(false);
    setFormErrors({});
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
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNewClient = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const clientData: CreateClientData = {
        full_name: newClientData.fullName.trim(),
        company: newClientData.company.trim() || undefined,
        website: newClientData.website.trim() || undefined,
        office_email: newClientData.officeEmail.trim() || undefined,
        office_phone: newClientData.officePhone.trim() || undefined,
        mobile_phone: newClientData.mobilePhone.trim() || undefined,
        address: newClientData.address.trim() || undefined
      };

      const { client, error } = await ClientService.createClient(clientData);

      if (error) {
        setError(error);
      } else if (client) {
        // Refresh the clients list
        await loadClients();
        handleCloseCreateClientModal();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);

  const getClientInitials = (fullName: string): string => {
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getClientColor = (index: number): string => {
    const colors = ['#4ECDC4', '#A8A8FF', '#90EE90', '#F0E68C', '#FFB6C1', '#DDA0DD'];
    return colors[index % colors.length];
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
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="create-client-section">
              <button className="create-client-btn" onClick={handleCreateClientClick}>
                + Create New Client
              </button>
            </div>

            <div className="clients-table">
              {isLoading ? (
                <div className="loading-message">Loading clients...</div>
              ) : clients.length === 0 ? (
                <div className="no-clients-message">No clients found. Create your first client to get started.</div>
              ) : (
                <>
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
                        style={{ backgroundColor: getClientColor(clients.indexOf(client)) }}
                      >
                        {getClientInitials(client.full_name)}
                      </div>
                      <span className="client-name">{client.full_name}</span>
                    </div>
                    <div className="cell">{client.company}</div>
                    <div className="cell">{client.website}</div>
                    <div className="cell">{client.office_phone}</div>
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
                </>
              )}
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
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
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
                  className={formErrors.website ? 'error' : ''}
                />
                {formErrors.website && <span className="error-text">{formErrors.website}</span>}
              </div>

              <div className="form-field">
                <label>Office Email</label>
                <input
                  type="email"
                  name="officeEmail"
                  placeholder="Office Email"
                  value={newClientData.officeEmail}
                  onChange={handleNewClientInputChange}
                  className={formErrors.officeEmail ? 'error' : ''}
                />
                {formErrors.officeEmail && <span className="error-text">{formErrors.officeEmail}</span>}
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
                    className={formErrors.officePhone ? 'error' : ''}
                  />
                  {formErrors.officePhone && <span className="error-text">{formErrors.officePhone}</span>}
                </div>
                <div className="form-field">
                  <label>Mobile Phone</label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    placeholder="Mobile Phone"
                    value={newClientData.mobilePhone}
                    onChange={handleNewClientInputChange}
                    className={formErrors.mobilePhone ? 'error' : ''}
                  />
                  {formErrors.mobilePhone && <span className="error-text">{formErrors.mobilePhone}</span>}
                </div>
              </div>

              <div className="form-field">
                <label>Address 1</label>
                <input
                  id="address-input"
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
              <button className="save-btn" onClick={handleSaveNewClient} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}