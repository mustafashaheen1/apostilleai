import React, { useState } from 'react';
import './ApostilleRequestForm.css';

interface ApostilleRequestFormProps {
  onBack: () => void;
}

export default function ApostilleRequestForm({ onBack }: ApostilleRequestFormProps) {
  const [formData, setFormData] = useState({
    requestorName: '',
    firmName: '',
    addressStreet: '',
    city: '',
    stateRegion: '',
    zipCode: '',
    daytimePhone: '',
    emailAddress: '',
    returnMailerType: '',
    // Additional fields for the right side form
    countryDestination: 'United States of America',
    numberOfDocuments: '',
    specialDeposit: '',
    paymentMethod: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    cardholderName: '',
    cardholderSignature: '',
    authorizationDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="apostille-request-page">
      <div className="form-container">
        <div className="form-left">
          <form onSubmit={handleSubmit} className="apostille-form">
            <div className="form-group">
              <label htmlFor="requestorName">Requestor's Name</label>
              <input
                type="text"
                id="requestorName"
                name="requestorName"
                placeholder="Requestor's Name"
                value={formData.requestorName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firmName">Name of Firm/Organization (If applicable)</label>
              <input
                type="text"
                id="firmName"
                name="firmName"
                placeholder="Name of Firm/Organization (If applicable)"
                value={formData.firmName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressStreet">Address Number and Street</label>
              <input
                type="text"
                id="addressStreet"
                name="addressStreet"
                placeholder="Address Number and Street"
                value={formData.addressStreet}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stateRegion">State/Region</label>
                <select
                  id="stateRegion"
                  name="stateRegion"
                  value={formData.stateRegion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">State/Region</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="OH">Ohio</option>
                  <option value="GA">Georgia</option>
                  <option value="NC">North Carolina</option>
                  <option value="MI">Michigan</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="daytimePhone">Daytime Telephone Number</label>
              <input
                type="tel"
                id="daytimePhone"
                name="daytimePhone"
                placeholder="Phone Number"
                value={formData.daytimePhone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="section-title">Type of Return Mailer Enclosed:</label>
              <div className="checkbox-options">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="returnMailerType"
                    value="first-class"
                    checked={formData.returnMailerType === 'first-class'}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom"></span>
                  Self-addressed, First-Class envelope with prepaid postage
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="returnMailerType"
                    value="priority-express"
                    checked={formData.returnMailerType === 'priority-express'}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom"></span>
                  Self-addressed US Postal Priority or Express envelope with prepaid postage
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="returnMailerType"
                    value="carrier-label"
                    checked={formData.returnMailerType === 'carrier-label'}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom"></span>
                  Self-addressed prepaid carrier label; (FedEx, UPS, Airborne, or DHL)
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onBack} className="back-btn">
                Back to Dashboard
              </button>
              <button type="submit" className="submit-btn">
                Submit Request
              </button>
            </div>
          </form>
        </div>

        <div className="form-right">
          <div className="official-form">
            <div className="form-header">
              <div className="ny-state-logo">
                <div className="state-outline">
                  <span>NEW YORK STATE</span>
                </div>
              </div>
              <div className="department-info">
                <h2>Department of State</h2>
                <h3>Licensing Services</h3>
                <div className="contact-info">
                  <p>New York State</p>
                  <p>Department of State</p>
                  <p>Division of Licensing Services</p>
                  <p>Apostille and Authentication Unit</p>
                  <p>One Commerce Plaza, 99 Washington Ave</p>
                  <p>Albany, NY 12231-0001</p>
                  <p>Customer Service: (518) 474-4429</p>
                  <p>Fax: (518) 473-2730</p>
                </div>
              </div>
            </div>

            <div className="form-title">
              <h1>Apostille/Certificate of Authentication Request</h1>
              <p className="form-subtitle">
                Please print or type. Submit this form with your documents. (Note: Incomplete forms will be returned for correction)
              </p>
            </div>

            <div className="form-content">
              <div className="form-field">
                <label>Country where documents will be used (Required):</label>
                <input
                  type="text"
                  name="countryDestination"
                  value={formData.countryDestination}
                  onChange={handleInputChange}
                  className="underline-input"
                />
                <span className="field-note">(Consulate or Embassy Country)</span>
              </div>

              <div className="form-fields-row">
                <div className="form-field">
                  <label>Requestor's Name:</label>
                  <input type="text" className="underline-input" />
                </div>
              </div>

              <div className="form-fields-row">
                <div className="form-field">
                  <label>Name of Firm/Organization (if applicable):</label>
                  <input type="text" className="underline-input" />
                </div>
              </div>

              <div className="address-section">
                <div className="form-field">
                  <label>Address:</label>
                  <input type="text" className="underline-input" />
                </div>
                <div className="address-row">
                  <span>Number and Street</span>
                  <span>City</span>
                  <span>State/Region</span>
                  <span>Zip Code</span>
                </div>
              </div>

              <div className="contact-section">
                <div className="form-fields-row">
                  <div className="form-field">
                    <label>Daytime telephone number:</label>
                    <input type="text" className="underline-input" />
                  </div>
                  <div className="form-field">
                    <label>Email address:</label>
                    <input type="text" className="underline-input" />
                  </div>
                </div>
              </div>

              <div className="return-mailer-section">
                <h3>Type of Return Mailer Enclosed:</h3>
                <p className="mailer-note">
                  (You must enclose one of the following if documents are to be returned to you by mail.
                  Note: This does not apply to in-person service.)
                </p>
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input type="checkbox" />
                    Self-addressed, First-Class envelope with prepaid postage
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" />
                    Self-addressed US Postal Priority or Express envelope with prepaid postage
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" />
                    Self-addressed prepaid carrier label; (FedEx, UPS, Airborne, or DHL)
                  </label>
                </div>
              </div>

              <div className="mailing-info">
                <div className="info-section">
                  <h4>Mailing Information:</h4>
                  <p>New York Department of State</p>
                  <p>Division of Licensing Services</p>
                  <p>Apostille and Authentication Unit</p>
                  <p>One Commerce Plaza</p>
                  <p>Albany, NY 12231-0001</p>
                </div>
                <div className="note-section">
                  <h4>Please note:</h4>
                  <p>If you utilize express services or next day ground services such as UPS, Federal Express, DHL, etc., you must send your documents to the street address of the building. The Albany physical address is:</p>
                  <p>One Commerce Plaza</p>
                  <p>99 Washington Avenue, 6th Floor</p>
                  <p>Albany, NY 12231</p>
                </div>
              </div>

              <div className="department-use-section">
                <h4>For Department of State Use Only</h4>
                <div className="department-fields">
                  <div className="field-row">
                    <span>Transaction #</span>
                    <span>Date Processed:</span>
                    <span>Cash Receipt #</span>
                  </div>
                  <div className="checkbox-row">
                    <label><input type="checkbox" /> Apostille</label>
                    <label><input type="checkbox" /> 210e</label>
                    <label><input type="checkbox" /> 210k</label>
                    <label><input type="checkbox" /> 260</label>
                    <label><input type="checkbox" /> 262</label>
                  </div>
                  <div className="field-row">
                    <span>Number of documents:</span>
                    <span>Special Deposit:</span>
                    <span>Country:</span>
                  </div>
                </div>
              </div>

              <div className="payment-section">
                <h4>Fees/Payment:</h4>
                <p>(Checks/Money Orders must be payable to N.Y.S. Department of State. Cash payments are not accepted.)</p>
                <div className="payment-fields">
                  <div className="field-row">
                    <span>Number of documents:</span>
                    <span>X $10.00 per document = Total Due:</span>
                  </div>
                </div>

                <h4>Form of Payment Enclosed or Authorized:</h4>
                <div className="payment-options">
                  <label><input type="checkbox" /> Check drawn on U.S. bank</label>
                  <label><input type="checkbox" /> Money Order from a U.S. bank</label>
                  <label><input type="checkbox" /> Credit/Debit Card</label>
                  <label><input type="checkbox" /> MasterCard</label>
                  <label><input type="checkbox" /> Visa</label>
                  <label><input type="checkbox" /> American Express</label>
                </div>

                <div className="card-info">
                  <div className="field-row">
                    <span>Name as it appears on card:</span>
                  </div>
                  <div className="field-row">
                    <span>Billing Address:</span>
                  </div>
                  <div className="field-row">
                    <span>City:</span>
                    <span>State:</span>
                    <span>Zip Code:</span>
                  </div>
                  <div className="field-row">
                    <span>Card Number:</span>
                    <span>CVV:</span>
                    <span>Expiration Date:</span>
                  </div>
                </div>

                <div className="authorization">
                  <p>
                    <strong>Payment Authorization:</strong> I authorize the New York Department of State to charge my credit/debit card for the amount due for the authentication services performed by the Department of State.
                  </p>
                  <div className="signature-section">
                    <div className="field-row">
                      <span>Cardholder's Signature:</span>
                      <span>Date:</span>
                    </div>
                    <p className="signature-note">
                      (Signature must match credit or debit card or be in the name of a corporation or other business entity; please put the signer's name.)
                    </p>
                  </div>
                </div>

                <div className="form-footer">
                  <p>DOS-1071 (Rev. 05/20)</p>
                  <p>Page 1 of 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}