import React, { useState, useEffect } from 'react';
import './Map3D.css';

interface OrderData {
  id: string;
  state: string;
  city: string;
  stateX: number;
  stateY: number;
  status: string;
  statusColor: string;
  document: string;
  date: string;
  email: string;
  phone: string;
}

const orderData: OrderData[] = [
  { id: '#167952', state: 'CA', city: 'Los Angeles', stateX: 10, stateY: 58, status: 'Shipped', statusColor: '#10B981', document: 'Birth Certificate', date: 'Nov 10, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#315061', state: 'NY', city: 'New York', stateX: 85, stateY: 25, status: 'Active', statusColor: '#2563EB', document: 'Marriage Certificate', date: 'Nov 11, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#495740', state: 'IL', city: 'Chicago', stateX: 65, stateY: 32, status: 'Delivered', statusColor: '#10B981', document: 'Diploma', date: 'Nov 05, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#789123', state: 'TX', city: 'Houston', stateX: 45, stateY: 75, status: 'Active', statusColor: '#2563EB', document: 'Power of Attorney', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#456789', state: 'AZ', city: 'Phoenix', stateX: 20, stateY: 65, status: 'Pending Review', statusColor: '#F59E0B', document: 'Affidavit', date: 'Nov 11, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#234567', state: 'CO', city: 'Denver', stateX: 35, stateY: 45, status: 'Active', statusColor: '#2563EB', document: 'Corporate Documents', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#890123', state: 'WA', city: 'Seattle', stateX: 15, stateY: 15, status: 'Shipped', statusColor: '#10B981', document: 'Transcripts', date: 'Nov 09, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#567890', state: 'FL', city: 'Miami', stateX: 80, stateY: 80, status: 'Active', statusColor: '#2563EB', document: 'Passport Copy', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
];

const activeStates = ['CA', 'NY', 'IL', 'TX', 'AZ', 'CO', 'WA', 'FL'];

const statesList = [
  { abbr: 'CA', name: 'California' },
  { abbr: 'NY', name: 'New York' },
  { abbr: 'TX', name: 'Texas' },
  { abbr: 'FL', name: 'Florida' },
  { abbr: 'IL', name: 'Illinois' },
  { abbr: 'AZ', name: 'Arizona' },
  { abbr: 'CO', name: 'Colorado' },
  { abbr: 'WA', name: 'Washington' },
];

export default function Map3D() {
  const [visiblePins, setVisiblePins] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);

    orderData.forEach((order, index) => {
      setTimeout(() => {
        setVisiblePins(prev => [...prev, order.id]);
      }, 700 + index * 100);
    });
  }, []);

  const handlePinClick = (order: OrderData) => {
    setSelectedOrder(order);
  };

  const handleStateCardClick = (stateAbbr: string) => {
    setSelectedState(stateAbbr);
  };

  const stateOrderCounts = activeStates.reduce((acc, state) => {
    acc[state] = orderData.filter(order => order.state === state).length;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="map-3d-loading">
        <div className="map-3d-spinner"></div>
        <p>Loading 3D Map...</p>
      </div>
    );
  }

  return (
    <div className="map-3d-wrapper">
      <div className="map-3d-header">
        <h3>3D Order Tracking Map</h3>
        <p>{orderData.length} active orders across {activeStates.length} states</p>
      </div>

      <div className="map-3d-content">
        {/* State Cards Grid */}
        <div className="state-cards-grid">
          {statesList.map(state => (
            <div
              key={state.abbr}
              className={`state-card ${selectedState === state.abbr ? 'active' : ''} ${activeStates.includes(state.abbr) ? 'has-orders' : ''}`}
              onClick={() => handleStateCardClick(state.abbr)}
            >
              <div className="state-abbr">{state.abbr}</div>
              <div className="state-name">{state.name}</div>
              {stateOrderCounts[state.abbr] > 0 && (
                <div className="order-count">{stateOrderCounts[state.abbr]}</div>
              )}
            </div>
          ))}
        </div>

        {/* 3D Map Container */}
        <div className="map-3d-container">
          <div className="usa-map-3d">
            {/* Simplified USA Map SVG */}
            <svg viewBox="0 0 100 100" className="usa-svg">
              {/* States as simplified rectangles for demo - in production use actual state paths */}
              <g className="states-group">
                {/* West Coast */}
                <rect className={`state-3d ${activeStates.includes('WA') ? 'active' : ''}`} x="5" y="8" width="8" height="12" rx="1" />
                <rect className={`state-3d ${activeStates.includes('CA') ? 'active' : ''}`} x="3" y="25" width="12" height="25" rx="1" />

                {/* Southwest */}
                <rect className={`state-3d ${activeStates.includes('AZ') ? 'active' : ''}`} x="15" y="42" width="10" height="12" rx="1" />
                <rect className={`state-3d ${activeStates.includes('CO') ? 'active' : ''}`} x="28" y="32" width="10" height="10" rx="1" />

                {/* Central */}
                <rect className={`state-3d ${activeStates.includes('TX') ? 'active' : ''}`} x="35" y="50" width="18" height="20" rx="1" />
                <rect className={`state-3d ${activeStates.includes('IL') ? 'active' : ''}`} x="55" y="25" width="8" height="12" rx="1" />

                {/* East Coast */}
                <rect className={`state-3d ${activeStates.includes('NY') ? 'active' : ''}`} x="75" y="15" width="10" height="10" rx="1" />
                <rect className={`state-3d ${activeStates.includes('FL') ? 'active' : ''}`} x="72" y="60" width="12" height="20" rx="1" />

                {/* Inactive States (for visual context) */}
                <rect className="state-3d" x="40" y="15" width="10" height="10" rx="1" />
                <rect className="state-3d" x="20" y="20" width="12" height="15" rx="1" />
                <rect className="state-3d" x="58" y="40" width="10" height="12" rx="1" />
                <rect className="state-3d" x="70" y="35" width="8" height="10" rx="1" />
              </g>

              {/* 3D Pins */}
              {orderData.map(order => (
                visiblePins.includes(order.id) && (
                  <g
                    key={order.id}
                    className="pin-3d"
                    style={{
                      transform: `translate(${order.stateX}%, ${order.stateY}%)`,
                    }}
                    onClick={() => handlePinClick(order)}
                  >
                    {/* Pin Shadow */}
                    <ellipse
                      cx="0"
                      cy="3"
                      rx="2"
                      ry="1"
                      fill="rgba(0,0,0,0.3)"
                      className="pin-shadow"
                    />

                    {/* Pin Body */}
                    <path
                      d="M 0,-8 C -2.5,-8 -4.5,-6 -4.5,-3.5 C -4.5,-1 0,3 0,3 C 0,3 4.5,-1 4.5,-3.5 C 4.5,-6 2.5,-8 0,-8 Z"
                      fill={order.statusColor}
                      className="pin-body"
                    />

                    {/* Pin Circle Cutout */}
                    <circle
                      cx="0"
                      cy="-5"
                      r="1.5"
                      fill="white"
                      className="pin-circle"
                    />
                  </g>
                )
              ))}
            </svg>
          </div>

          {/* Order Popup */}
          {selectedOrder && (
            <div className="order-popup">
              <button className="popup-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>

              <div className="popup-header">
                <h4>{selectedOrder.id}</h4>
                <span
                  className="status-badge"
                  style={{ backgroundColor: selectedOrder.statusColor }}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="popup-body">
                <div className="popup-row">
                  <span className="popup-label">Location:</span>
                  <span className="popup-value">{selectedOrder.city}, {selectedOrder.state}</span>
                </div>
                <div className="popup-row">
                  <span className="popup-label">Document:</span>
                  <span className="popup-value">{selectedOrder.document}</span>
                </div>
                <div className="popup-row">
                  <span className="popup-label">Date:</span>
                  <span className="popup-value">{selectedOrder.date}</span>
                </div>

                <div className="popup-contact">
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>{selectedOrder.phone}</span>
                  </div>
                </div>
              </div>

              <button className="popup-button">View Details</button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="map-3d-legend">
        <div className="legend-title">Order Status</div>
        <div className="legend-item">
          <div className="legend-pin" style={{ backgroundColor: '#2563EB' }}></div>
          <span>Active Jobs</span>
        </div>
        <div className="legend-item">
          <div className="legend-pin" style={{ backgroundColor: '#10B981' }}></div>
          <span>Completed/Shipped</span>
        </div>
        <div className="legend-item">
          <div className="legend-pin" style={{ backgroundColor: '#F59E0B' }}></div>
          <span>Pending Review</span>
        </div>
      </div>
    </div>
  );
}
