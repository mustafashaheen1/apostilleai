import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import './ApostilleOrderForm.css';

// Type definitions
interface PrimaryContact {
  name: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  daytimeTel: string;
}

interface ShippingAddress extends PrimaryContact {
  sameAsPrimary: boolean;
}

interface DocumentInfo {
  id: string;
  title: string;
  qty: number;
  country: string;
}

interface EntityDocument {
  title: string;
  dateFiled: string;
  qty: number;
}

interface EntityRecord {
  entityName: string;
  state: string;
  entityNumber: string;
  documents: EntityDocument[];
  apostille: 'yes' | 'no';
  destinationCountry: string;
}

interface TranslationRequest {
  id: string;
  documentTitle: string;
  targetLanguage: string;
  destinationCountry: string;
}

interface SpecialServices {
  requireScannedCopy: boolean;
  scannedCopyEmails: string[];
  requireUSArabChamber: boolean;
}

interface ApostilleOrderFormData {
  primaryContact: PrimaryContact;
  shippingAddress: ShippingAddress;
  documents: DocumentInfo[];
  dateNeeded: string;
  entityRecords: EntityRecord;
  entityRecordsEnabled: boolean;
  translations: TranslationRequest[];
  apostilleTranslations: boolean;
  apostilleTranslationsCountry: string;
  apostilleOriginals: boolean;
  apostilleOriginalsCountry: string;
  specialServices: SpecialServices;
  specialInstructions: string;
}

interface ApostilleOrderFormProps {
  onBack: () => void;
}

export default function ApostilleOrderForm({ onBack }: ApostilleOrderFormProps) {
  const [formData, setFormData] = useState<ApostilleOrderFormData>({
    primaryContact: {
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      email: '',
      daytimeTel: ''
    },
    shippingAddress: {
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      email: '',
      daytimeTel: '',
      sameAsPrimary: true
    },
    documents: [{
      id: '1',
      title: '',
      qty: 1,
      country: ''
    }],
    dateNeeded: '',
    entityRecords: {
      entityName: '',
      state: 'DE',
      entityNumber: '',
      documents: [{ title: '', dateFiled: '', qty: 1 }],
      apostille: 'no',
      destinationCountry: ''
    },
    entityRecordsEnabled: false,
    translations: [{
      id: '1',
      documentTitle: '',
      targetLanguage: '',
      destinationCountry: ''
    }],
    apostilleTranslations: false,
    apostilleTranslationsCountry: '',
    apostilleOriginals: false,
    apostilleOriginalsCountry: '',
    specialServices: {
      requireScannedCopy: false,
      scannedCopyEmails: ['', '', ''],
      requireUSArabChamber: false
    },
    specialInstructions: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-copy primary contact to shipping when sameAsPrimary is checked
  useEffect(() => {
    if (formData.shippingAddress.sameAsPrimary) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.primaryContact,
          sameAsPrimary: true
        }
      }));
    }
  }, [formData.primaryContact, formData.shippingAddress.sameAsPrimary]);

  const handlePrimaryContactChange = (field: keyof PrimaryContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      primaryContact: {
        ...prev.primaryContact,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`primaryContact.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`primaryContact.${field}`]: ''
      }));
    }
  };

  const handleShippingAddressChange = (field: keyof ShippingAddress, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handleDocumentChange = (id: string, field: keyof DocumentInfo, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const addDocument = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, {
        id: newId,
        title: '',
        qty: 1,
        country: ''
      }]
    }));
  };

  const removeDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const handleEntityRecordChange = (field: keyof EntityRecord, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      entityRecords: {
        ...prev.entityRecords,
        [field]: value
      }
    }));
  };

  const addEntityDocument = () => {
    setFormData(prev => ({
      ...prev,
      entityRecords: {
        ...prev.entityRecords,
        documents: [
          ...prev.entityRecords.documents,
          { title: '', dateFiled: '', qty: 1 }
        ]
      }
    }));
  };

  const removeEntityDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entityRecords: {
        ...prev.entityRecords,
        documents: prev.entityRecords.documents.filter((_, i) => i !== index)
      }
    }));
  };

  const handleEntityDocumentChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      entityRecords: {
        ...prev.entityRecords,
        documents: prev.entityRecords.documents.map((doc, i) =>
          i === index ? { ...doc, [field]: value } : doc
        )
      }
    }));
  };

  const handleTranslationChange = (id: string, field: keyof TranslationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(trans => 
        trans.id === id ? { ...trans, [field]: value } : trans
      )
    }));
  };

  const addTranslation = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      translations: [...prev.translations, {
        id: newId,
        documentTitle: '',
        targetLanguage: '',
        destinationCountry: ''
      }]
    }));
  };

  const removeTranslation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.filter(trans => trans.id !== id)
    }));
  };

  const handleSpecialServicesChange = (field: keyof SpecialServices, value: boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      specialServices: {
        ...prev.specialServices,
        [field]: value
      }
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.specialServices.scannedCopyEmails];
    newEmails[index] = value;
    handleSpecialServicesChange('scannedCopyEmails', newEmails);
  };

  const calculateTotalDocuments = () => {
    return formData.documents.reduce((total, doc) => total + (doc.qty || 0), 0);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Primary Contact validation
    if (!formData.primaryContact.name.trim()) {
      newErrors['primaryContact.name'] = 'Name is required';
    }
    if (!formData.primaryContact.address.trim()) {
      newErrors['primaryContact.address'] = 'Address is required';
    }
    if (!formData.primaryContact.city.trim()) {
      newErrors['primaryContact.city'] = 'City is required';
    }
    if (!formData.primaryContact.state.trim()) {
      newErrors['primaryContact.state'] = 'State/Province is required';
    }
    if (!formData.primaryContact.zipCode.trim()) {
      newErrors['primaryContact.zipCode'] = 'Zip Code is required';
    }
    if (!formData.primaryContact.email.trim()) {
      newErrors['primaryContact.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContact.email)) {
      newErrors['primaryContact.email'] = 'Please enter a valid email address';
    }
    if (!formData.primaryContact.daytimeTel.trim()) {
      newErrors['primaryContact.daytimeTel'] = 'Daytime telephone is required';
    }

    // Document validation
    formData.documents.forEach((doc, index) => {
      if (!doc.title.trim()) {
        newErrors[`document.${index}.title`] = 'Document title is required';
      }
      if (!doc.country.trim()) {
        newErrors[`document.${index}.country`] = 'Country is required';
      }
      if (!doc.qty || doc.qty < 1) {
        newErrors[`document.${index}.qty`] = 'Quantity must be at least 1';
      }
    });

    // Date needed validation
    if (!formData.dateNeeded) {
      newErrors['dateNeeded'] = 'Date needed is required';
    } else {
      const selectedDate = new Date(formData.dateNeeded);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors['dateNeeded'] = 'Date needed must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form Data Submitted:', formData);
      setShowSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowSuccess(false);
        // Could navigate to confirmation page or reset form
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    // Implement draft saving logic
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil', 'Other'
  ];

  return (
    <div className="apostille-order-page">
      <div className="apostille-order-header">
        <div className="step-label">Step 1</div>
        <h1>Apostille Order Form</h1>
      </div>

      <div className="form-container">
        {showSuccess && (
          <div className="success-message">
            Order submitted successfully! We will contact you shortly to confirm your request.
          </div>
        )}

        <form onSubmit={handleSubmit} className="apostille-form">
            {/* Section 1: Primary Contact Information */}
            <div className="form-section">
              <h2 className="section-title">Primary Contact Information</h2>
              <div className="form-grid">
                <div className={`form-group ${errors['primaryContact.name'] ? 'error' : ''}`}>
                  <label htmlFor="name" className="required">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.primaryContact.name}
                    onChange={(e) => handlePrimaryContactChange('name', e.target.value)}
                    placeholder="Full Name"
                  />
                  {errors['primaryContact.name'] && (
                    <span className="error-message">{errors['primaryContact.name']}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    value={formData.primaryContact.company}
                    onChange={(e) => handlePrimaryContactChange('company', e.target.value)}
                    placeholder="Company Name (Optional)"
                  />
                </div>

                <div className={`form-group full-width ${errors['primaryContact.address'] ? 'error' : ''}`}>
                  <label htmlFor="address" className="required">Address</label>
                  <textarea
                    id="address"
                    value={formData.primaryContact.address}
                    onChange={(e) => handlePrimaryContactChange('address', e.target.value)}
                    placeholder="Street Address"
                    rows={3}
                  />
                  {errors['primaryContact.address'] && (
                    <span className="error-message">{errors['primaryContact.address']}</span>
                  )}
                </div>

                <div className={`form-group ${errors['primaryContact.city'] ? 'error' : ''}`}>
                  <label htmlFor="city" className="required">City</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.primaryContact.city}
                    onChange={(e) => handlePrimaryContactChange('city', e.target.value)}
                    placeholder="City"
                  />
                  {errors['primaryContact.city'] && (
                    <span className="error-message">{errors['primaryContact.city']}</span>
                  )}
                </div>

                <div className={`form-group ${errors['primaryContact.state'] ? 'error' : ''}`}>
                  <label htmlFor="state" className="required">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.primaryContact.state}
                    onChange={(e) => handlePrimaryContactChange('state', e.target.value)}
                    placeholder="State/Province"
                  />
                  {errors['primaryContact.state'] && (
                    <span className="error-message">{errors['primaryContact.state']}</span>
                  )}
                </div>

                <div className={`form-group ${errors['primaryContact.zipCode'] ? 'error' : ''}`}>
                  <label htmlFor="zipCode" className="required">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.primaryContact.zipCode}
                    onChange={(e) => handlePrimaryContactChange('zipCode', e.target.value)}
                    placeholder="Zip Code"
                  />
                  {errors['primaryContact.zipCode'] && (
                    <span className="error-message">{errors['primaryContact.zipCode']}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="required">Country</label>
                  <select
                    id="country"
                    value={formData.primaryContact.country}
                    onChange={(e) => handlePrimaryContactChange('country', e.target.value)}
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className={`form-group ${errors['primaryContact.email'] ? 'error' : ''}`}>
                  <label htmlFor="email" className="required">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.primaryContact.email}
                    onChange={(e) => handlePrimaryContactChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                  {errors['primaryContact.email'] && (
                    <span className="error-message">{errors['primaryContact.email']}</span>
                  )}
                </div>

                <div className={`form-group ${errors['primaryContact.daytimeTel'] ? 'error' : ''}`}>
                  <label htmlFor="daytimeTel" className="required">Daytime Tel</label>
                  <input
                    type="tel"
                    id="daytimeTel"
                    value={formData.primaryContact.daytimeTel}
                    onChange={(e) => handlePrimaryContactChange('daytimeTel', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                  {errors['primaryContact.daytimeTel'] && (
                    <span className="error-message">{errors['primaryContact.daytimeTel']}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Return Shipping Address */}
            <div className="form-section">
              <h2 className="section-title">Return Shipping Address</h2>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="sameAsPrimary"
                  checked={formData.shippingAddress.sameAsPrimary}
                  onChange={(e) => handleShippingAddressChange('sameAsPrimary', e.target.checked)}
                />
                <label htmlFor="sameAsPrimary">Same as Primary Contact Information</label>
              </div>

              {!formData.shippingAddress.sameAsPrimary && (
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="shippingName" className="required">Name</label>
                    <input
                      type="text"
                      id="shippingName"
                      value={formData.shippingAddress.name}
                      onChange={(e) => handleShippingAddressChange('name', e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingCompany">Company</label>
                    <input
                      type="text"
                      id="shippingCompany"
                      value={formData.shippingAddress.company}
                      onChange={(e) => handleShippingAddressChange('company', e.target.value)}
                      placeholder="Company Name (Optional)"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="shippingAddress" className="required">Address</label>
                    <textarea
                      id="shippingAddress"
                      value={formData.shippingAddress.address}
                      onChange={(e) => handleShippingAddressChange('address', e.target.value)}
                      placeholder="Street Address"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingCity" className="required">City</label>
                    <input
                      type="text"
                      id="shippingCity"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingState" className="required">State/Province</label>
                    <input
                      type="text"
                      id="shippingState"
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                      placeholder="State/Province"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingZipCode" className="required">Zip Code</label>
                    <input
                      type="text"
                      id="shippingZipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => handleShippingAddressChange('zipCode', e.target.value)}
                      placeholder="Zip Code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingCountry" className="required">Country</label>
                    <select
                      id="shippingCountry"
                      value={formData.shippingAddress.country}
                      onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingEmail" className="required">Email</label>
                    <input
                      type="email"
                      id="shippingEmail"
                      value={formData.shippingAddress.email}
                      onChange={(e) => handleShippingAddressChange('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingDaytimeTel" className="required">Daytime Tel</label>
                    <input
                      type="tel"
                      id="shippingDaytimeTel"
                      value={formData.shippingAddress.daytimeTel}
                      onChange={(e) => handleShippingAddressChange('daytimeTel', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Apostille Request - Document Information */}
            <div className="form-section">
              <h2 className="section-title">Apostille Request - Document Information</h2>
              
              <div className="dynamic-table">
                <div className="table-header">
                  <div>Document Title/Individual Named in Vital Records</div>
                  <div>Qty</div>
                  <div>Name of Country/Embassy/Consulate</div>
                  <div>Action</div>
                </div>
                
                {formData.documents.map((doc, index) => (
                  <div key={doc.id} className="table-row">
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => handleDocumentChange(doc.id, 'title', e.target.value)}
                      placeholder="Document Title"
                      className={errors[`document.${index}.title`] ? 'error' : ''}
                    />
                    <input
                      type="number"
                      min="1"
                      value={doc.qty}
                      onChange={(e) => handleDocumentChange(doc.id, 'qty', parseInt(e.target.value) || 1)}
                      className={errors[`document.${index}.qty`] ? 'error' : ''}
                    />
                    <input
                      type="text"
                      value={doc.country}
                      onChange={(e) => handleDocumentChange(doc.id, 'country', e.target.value)}
                      placeholder="Destination Country"
                      className={errors[`document.${index}.country`] ? 'error' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="remove-btn"
                      disabled={formData.documents.length === 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addDocument} className="add-btn">
                <Plus size={16} /> Add Document
              </button>

              <div className="summary-section">
                <div className="summary-item">
                  <span>Total number of Apostilles or Legalizations:</span>
                  <span className="summary-value">{calculateTotalDocuments()}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateNeeded" className="required">Date documents needed by</label>
                <input
                  type="date"
                  id="dateNeeded"
                  value={formData.dateNeeded}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateNeeded: e.target.value }))}
                  className={errors['dateNeeded'] ? 'error' : ''}
                />
                {errors['dateNeeded'] && (
                  <span className="error-message">{errors['dateNeeded']}</span>
                )}
              </div>
            </div>

            {/* Section 4: For Business/Entity Records Procurement */}
            <div className="form-section">
              <div className="collapsible-section">
                <button
                  type="button"
                  className="section-toggle"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    entityRecordsEnabled: !prev.entityRecordsEnabled
                  }))}
                >
                  {formData.entityRecordsEnabled ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  For Business/Entity Records Procurement (Optional Section)
                </button>

                {formData.entityRecordsEnabled && (
                  <div className="collapsible-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="entityName">Entity Name</label>
                        <input
                          type="text"
                          id="entityName"
                          value={formData.entityRecords.entityName}
                          onChange={(e) => handleEntityRecordChange('entityName', e.target.value)}
                          placeholder="Entity Name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="stateOfIncorporation">State of Incorporation/Registration</label>
                        <select
                          id="stateOfIncorporation"
                          value={formData.entityRecords.state}
                          onChange={(e) => handleEntityRecordChange('state', e.target.value)}
                        >
                          <option value="">Select State</option>
                          <option value="DE">Delaware</option>
                          <option value="CA">California</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="entityNumber">Entity Number</label>
                        <input
                          type="text"
                          id="entityNumber"
                          value={formData.entityRecords.entityNumber}
                          onChange={(e) => handleEntityRecordChange('entityNumber', e.target.value)}
                          placeholder="Entity Number"
                        />
                      </div>
                    </div>

                    {/* Multiple Documents Table */}
                    <div className="entity-documents-section">
                      <h3 className="section-title">Entity Documents</h3>
                      <div className="document-table">
                        <div className="table-header">
                          <div>Document Title</div>
                          <div>Date Filed</div>
                          <div>Qty</div>
                          <div>Action</div>
                        </div>

                        {formData.entityRecords.documents.map((doc, index) => (
                          <div key={index} className="table-row">
                            <input
                              type="text"
                              placeholder="Document Title"
                              value={doc.title}
                              onChange={(e) => handleEntityDocumentChange(index, 'title', e.target.value)}
                            />
                            <input
                              type="date"
                              placeholder="Date Filed"
                              value={doc.dateFiled}
                              onChange={(e) => handleEntityDocumentChange(index, 'dateFiled', e.target.value)}
                            />
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={doc.qty}
                              onChange={(e) => handleEntityDocumentChange(index, 'qty', parseInt(e.target.value) || 1)}
                            />
                            {formData.entityRecords.documents.length > 1 && (
                              <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeEntityDocument(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="add-btn"
                        onClick={addEntityDocument}
                      >
                        + Add Document
                      </button>
                    </div>

                    {/* Apostille/Legalize Question */}
                    <div className="form-group">
                      <label>Apostille/Legalize?</label>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="entityRecord.apostille"
                            value="yes"
                            checked={formData.entityRecords.apostille === 'yes'}
                            onChange={() => handleEntityRecordChange('apostille', 'yes')}
                          />
                          Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="entityRecord.apostille"
                            value="no"
                            checked={formData.entityRecords.apostille === 'no'}
                            onChange={() => handleEntityRecordChange('apostille', 'no')}
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {formData.entityRecords.apostille === 'yes' && (
                      <div className="form-group">
                        <label htmlFor="entityDestinationCountry">If Yes, Destination Country/Consulate:</label>
                        <input
                          type="text"
                          id="entityDestinationCountry"
                          value={formData.entityRecords.destinationCountry}
                          onChange={(e) => handleEntityRecordChange('destinationCountry', e.target.value)}
                          placeholder="Destination Country/Consulate"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Translation Request */}
            <div className="form-section">
              <h2 className="section-title">Translation Request</h2>
              
              <div className="dynamic-table translation-table">
                <div className="table-header">
                  <div>Document Title</div>
                  <div>Target Language</div>
                  <div>Destination Country</div>
                  <div>Action</div>
                </div>
                
                {formData.translations.map((trans, index) => (
                  <div key={trans.id} className="table-row">
                    <input
                      type="text"
                      value={trans.documentTitle}
                      onChange={(e) => handleTranslationChange(trans.id, 'documentTitle', e.target.value)}
                      placeholder="Document Title"
                    />
                    <input
                      type="text"
                      value={trans.targetLanguage}
                      onChange={(e) => handleTranslationChange(trans.id, 'targetLanguage', e.target.value)}
                      placeholder="Target Language"
                    />
                    <input
                      type="text"
                      value={trans.destinationCountry}
                      onChange={(e) => handleTranslationChange(trans.id, 'destinationCountry', e.target.value)}
                      placeholder="Destination Country"
                    />
                    <button
                      type="button"
                      onClick={() => removeTranslation(trans.id)}
                      className="remove-btn"
                      disabled={formData.translations.length === 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addTranslation} className="add-btn">
                <Plus size={16} /> Add Translation
              </button>

              <div className="form-group">
                <label>Apostille/Legalize the Translation(s)?</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="apostilleTranslationsYes"
                      name="apostilleTranslations"
                      checked={formData.apostilleTranslations === true}
                      onChange={() => setFormData(prev => ({ ...prev, apostilleTranslations: true }))}
                    />
                    <label htmlFor="apostilleTranslationsYes">Yes</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="apostilleTranslationsNo"
                      name="apostilleTranslations"
                      checked={formData.apostilleTranslations === false}
                      onChange={() => setFormData(prev => ({ ...prev, apostilleTranslations: false }))}
                    />
                    <label htmlFor="apostilleTranslationsNo">No</label>
                  </div>
                </div>
              </div>

              {formData.apostilleTranslations && (
                <div className="form-group">
                  <label htmlFor="apostilleTranslationsCountry">Destination Country</label>
                  <input
                    type="text"
                    id="apostilleTranslationsCountry"
                    value={formData.apostilleTranslationsCountry}
                    onChange={(e) => setFormData(prev => ({ ...prev, apostilleTranslationsCountry: e.target.value }))}
                    placeholder="Destination Country"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Apostille/Legalize the Original Document(s)?</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="apostilleOriginalsYes"
                      name="apostilleOriginals"
                      checked={formData.apostilleOriginals === true}
                      onChange={() => setFormData(prev => ({ ...prev, apostilleOriginals: true }))}
                    />
                    <label htmlFor="apostilleOriginalsYes">Yes</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="apostilleOriginalsNo"
                      name="apostilleOriginals"
                      checked={formData.apostilleOriginals === false}
                      onChange={() => setFormData(prev => ({ ...prev, apostilleOriginals: false }))}
                    />
                    <label htmlFor="apostilleOriginalsNo">No</label>
                  </div>
                </div>
              </div>

              {formData.apostilleOriginals && (
                <div className="form-group">
                  <label htmlFor="apostilleOriginalsCountry">Destination Country</label>
                  <input
                    type="text"
                    id="apostilleOriginalsCountry"
                    value={formData.apostilleOriginalsCountry}
                    onChange={(e) => setFormData(prev => ({ ...prev, apostilleOriginalsCountry: e.target.value }))}
                    placeholder="Destination Country"
                  />
                </div>
              )}
            </div>

            {/* Section 6: Special Services */}
            <div className="form-section">
              <h2 className="section-title">Special Services</h2>
              
              <div className="special-service-item">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="requireScannedCopy"
                    checked={formData.specialServices.requireScannedCopy}
                    onChange={(e) => handleSpecialServicesChange('requireScannedCopy', e.target.checked)}
                  />
                  <label htmlFor="requireScannedCopy">Do you require a scanned copy of your document(s)?</label>
                </div>
                <div className="service-note">+ $20.00 fee per document</div>

                {formData.specialServices.requireScannedCopy && (
                  <div className="email-inputs">
                    {formData.specialServices.scannedCopyEmails.map((email, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`email${index + 1}`}>Email {index + 1}:</label>
                        <input
                          type="email"
                          id={`email${index + 1}`}
                          value={email}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                          placeholder={`email${index + 1}@example.com`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="special-service-item">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="requireUSArabChamber"
                    checked={formData.specialServices.requireUSArabChamber}
                    onChange={(e) => handleSpecialServicesChange('requireUSArabChamber', e.target.checked)}
                  />
                  <label htmlFor="requireUSArabChamber">
                    For Documents Destined for Middle Eastern Countries, Do you require a US-Arab Chamber of Commerce Certification?
                  </label>
                </div>
                <div className="service-note">Please include an additional $195.00 per document certification fee</div>
              </div>
            </div>

            {/* Section 7: Other Special Instructions/Requests */}
            <div className="form-section">
              <h2 className="section-title">Other Special Instructions/Requests</h2>
              
              <div className="form-group">
                <label htmlFor="specialInstructions">Additional Notes/Instructions</label>
                <textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Please provide any additional instructions or special requests..."
                  rows={6}
                />
              </div>
            </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onBack} className="btn btn-tertiary">
              Cancel
            </button>
            <button type="button" onClick={handleSaveDraft} className="btn btn-secondary">
              Save Draft
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}