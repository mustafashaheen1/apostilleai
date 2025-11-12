import React, { useState, useEffect } from 'react';
import './Map3D.css';

interface OrderData {
  id: string;
  state: string;
  city: string;
  mapX: number;
  mapY: number;
  status: string;
  statusColor: string;
  document: string;
  date: string;
  email: string;
  phone: string;
}

const orderData: OrderData[] = [
  { id: '#167952', state: 'CA', city: 'Los Angeles', mapX: 12, mapY: 55, status: 'Shipped', statusColor: '#10B981', document: 'Birth Certificate', date: 'Nov 10, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#315061', state: 'NY', city: 'New York', mapX: 85, mapY: 25, status: 'Active', statusColor: '#2563EB', document: 'Marriage Certificate', date: 'Nov 11, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#495740', state: 'IL', city: 'Chicago', mapX: 62, mapY: 32, status: 'Delivered', statusColor: '#10B981', document: 'Diploma', date: 'Nov 05, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#789123', state: 'TX', city: 'Houston', mapX: 48, mapY: 75, status: 'Active', statusColor: '#2563EB', document: 'Power of Attorney', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#456789', state: 'AZ', city: 'Phoenix', mapX: 22, mapY: 58, status: 'Pending Review', statusColor: '#F59E0B', document: 'Affidavit', date: 'Nov 11, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#234567', state: 'CO', city: 'Denver', mapX: 35, mapY: 42, status: 'Active', statusColor: '#2563EB', document: 'Corporate Documents', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#890123', state: 'WA', city: 'Seattle', mapX: 15, mapY: 12, status: 'Shipped', statusColor: '#10B981', document: 'Transcripts', date: 'Nov 09, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
  { id: '#567890', state: 'FL', city: 'Miami', mapX: 82, mapY: 82, status: 'Active', statusColor: '#2563EB', document: 'Passport Copy', date: 'Nov 12, 2025', email: 'contact@apostille.ai', phone: '+1 (555) 123-4567' },
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
    const stateOrders = orderData.filter(order => order.state === stateAbbr);
    if (stateOrders.length > 0) {
      setSelectedOrder(stateOrders[0]);
    }
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

        {/* Map Visualization */}
        <div className="map-visualization">
          {/* Pins positioned on map */}
          {orderData.map(order => (
            visiblePins.includes(order.id) && (
              <div
                key={order.id}
                className="map-pin-wrapper"
                style={{
                  left: `${order.mapX}%`,
                  top: `${order.mapY}%`,
                }}
                onClick={() => handlePinClick(order)}
              >
                {/* Pin Shadow */}
                <div className="pin-shadow-base"></div>

                {/* 3D Pin */}
                <svg
                  className="pin-3d"
                  width="40"
                  height="50"
                  viewBox="0 0 40 50"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))' }}
                >
                  {/* Pin Body */}
                  <path
                    d="M 20,5 C 12,5 6,11 6,19 C 6,27 20,45 20,45 C 20,45 34,27 34,19 C 34,11 28,5 20,5 Z"
                    fill={order.statusColor}
                    className="pin-body"
                  />

                  {/* Pin Circle Cutout */}
                  <circle
                    cx="20"
                    cy="16"
                    r="6"
                    fill="white"
                    className="pin-circle"
                  />
                </svg>
              </div>
            )
          ))}
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
