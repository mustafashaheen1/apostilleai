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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
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

  const countries = [
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
  ];

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

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleContinue = () => {
    if (currentStep === 1 && selectedClient) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && selectedCountry) {
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
    }
  };

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
              disabled={
                (currentStep === 1 && !selectedClient) ||
                (currentStep === 2 && !selectedCountry)
              }
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
            <div className="location-layout">
              <div className="countries-panel">
                <div className="countries-grid">
                  {countries.map((country) => (
                    <div
                      key={country.code}
                      className={`country-card ${selectedCountry === country.code ? 'selected' : ''}`}
                      onClick={() => handleCountrySelect(country.code)}
                    >
                      <div className="country-flag">
                        <span className="flag-emoji">{country.flag}</span>
                      </div>
                      <div className="country-name">{country.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="map-panel">
                <div className="world-map-container">
                  <svg viewBox="0 0 1000 500" className="world-map-svg">
                    {/* World Map SVG Paths */}
                    
                    {/* United States */}
                    <path
                      d="M200 200 L300 180 L350 200 L380 220 L350 250 L300 260 L250 250 L200 230 Z"
                      className={`country-path ${selectedCountry === 'US' ? 'highlighted' : ''}`}
                      data-country="US"
                    />
                    
                    {/* Canada */}
                    <path
                      d="M180 120 L400 100 L420 140 L380 180 L200 180 L160 150 Z"
                      className={`country-path ${selectedCountry === 'CA' ? 'highlighted' : ''}`}
                      data-country="CA"
                    />
                    
                    {/* United Kingdom */}
                    <path
                      d="M480 180 L500 175 L510 185 L505 195 L485 200 L475 190 Z"
                      className={`country-path ${selectedCountry === 'GB' ? 'highlighted' : ''}`}
                      data-country="GB"
                    />
                    
                    {/* France */}
                    <path
                      d="M470 210 L490 205 L500 220 L485 235 L465 230 L460 215 Z"
                      className={`country-path ${selectedCountry === 'FR' ? 'highlighted' : ''}`}
                      data-country="FR"
                    />
                    
                    {/* Spain */}
                    <path
                      d="M440 240 L480 235 L485 250 L460 265 L430 260 L425 245 Z"
                      className={`country-path ${selectedCountry === 'ES' ? 'highlighted' : ''}`}
                      data-country="ES"
                    />
                    
                    {/* Brazil */}
                    <path
                      d="M300 320 L380 310 L400 350 L380 400 L320 410 L280 380 L270 340 Z"
                      className={`country-path ${selectedCountry === 'BR' ? 'highlighted' : ''}`}
                      data-country="BR"
                    />
                    
                    {/* Australia */}
                    <path
                      d="M750 380 L850 375 L870 400 L860 420 L780 425 L740 410 L735 390 Z"
                      className={`country-path ${selectedCountry === 'AU' ? 'highlighted' : ''}`}
                      data-country="AU"
                    />
                    
                    {/* Japan */}
                    <path
                      d="M820 220 L840 215 L845 235 L835 250 L815 245 L810 230 Z"
                      className={`country-path ${selectedCountry === 'JP' ? 'highlighted' : ''}`}
                      data-country="JP"
                    />
                    
                    {/* South Africa */}
                    <path
                      d="M520 380 L560 375 L570 400 L555 420 L525 415 L510 395 Z"
                      className={`country-path ${selectedCountry === 'ZA' ? 'highlighted' : ''}`}
                      data-country="ZA"
                    />
                    
                    {/* Sweden */}
                    <path
                      d="M520 140 L535 135 L540 160 L530 175 L515 170 L510 150 Z"
                      className={`country-path ${selectedCountry === 'SE' ? 'highlighted' : ''}`}
                      data-country="SE"
                    />
                    
                    {/* Israel */}
                    <path
                      d="M580 260 L590 255 L595 270 L585 280 L575 275 L570 265 Z"
                      className={`country-path ${selectedCountry === 'IL' ? 'highlighted' : ''}`}
                      data-country="IL"
                    />
                    
                    {/* New Zealand */}
                    <path
                      d="M880 420 L900 415 L905 435 L895 445 L875 440 L870 425 Z"
                      className={`country-path ${selectedCountry === 'NZ' ? 'highlighted' : ''}`}
                      data-country="NZ"
                    />
                    
                    {/* Background continents (non-interactive) */}
                    <path
                      d="M100 150 L450 120 L480 300 L400 350 L150 380 L80 250 Z"
                      className="continent-path"
                      fill="#e5e7eb"
                    />
                    <path
                      d="M460 140 L650 130 L680 320 L550 350 L450 280 Z"
                      className="continent-path"
                      fill="#e5e7eb"
                    />
                    <path
                      d="M700 200 L900 190 L920 400 L850 450 L720 430 Z"
                      className="continent-path"
                      fill="#e5e7eb"
                    />
                  </svg>
                </div>
              </div>
            </div>
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