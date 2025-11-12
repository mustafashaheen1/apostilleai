import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

interface OrderLocation {
  id: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  status: string;
  document: string;
  date: string;
}

const orderLocations: OrderLocation[] = [
  { id: '#167952', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', status: 'Shipped', document: 'Birth Certificate', date: 'Nov 10, 2025' },
  { id: '#315061', lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY', status: 'Certified', document: 'Marriage Certificate', date: 'Nov 08, 2025' },
  { id: '#495740', lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL', status: 'Delivered', document: 'Diploma', date: 'Nov 05, 2025' },
  { id: '#789123', lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX', status: 'Active', document: 'Power of Attorney', date: 'Nov 12, 2025' },
  { id: '#456789', lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ', status: 'Pending Review', document: 'Affidavit', date: 'Nov 11, 2025' },
  { id: '#234567', lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO', status: 'Active', document: 'Corporate Documents', date: 'Nov 12, 2025' },
  { id: '#890123', lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA', status: 'Shipped', document: 'Transcripts', date: 'Nov 09, 2025' },
  { id: '#567890', lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL', status: 'Active', document: 'Passport Copy', date: 'Nov 12, 2025' },
];

const getMarkerColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return '#2562EB';
    case 'shipped':
    case 'delivered':
    case 'certified':
      return '#10b981';
    case 'pending review':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
};

const createCustomIcon = (color: string) => {
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5s12.5-19.125 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default function InteractiveMap() {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);

    orderLocations.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMarkers(prev => [...prev, index]);
      }, 500 + index * 50);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="map-loading">
        <div className="map-spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  if (orderLocations.length === 0) {
    return (
      <div className="map-empty">
        <p>No orders to display</p>
      </div>
    );
  }

  return (
    <div className="interactive-map">
      <div className="map-header">
        <h3>Order Tracking Map</h3>
        <p>{orderLocations.length} active orders</p>
      </div>

      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {orderLocations.map((location, index) => (
          visibleMarkers.includes(index) && (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(getMarkerColor(location.status))}
              eventHandlers={{
                click: () => {
                  const marker = document.querySelector(`[data-marker-id="${location.id}"]`);
                  if (marker) {
                    marker.classList.add('marker-bounce');
                    setTimeout(() => marker.classList.remove('marker-bounce'), 500);
                  }
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -35]} opacity={0.9}>
                <div className="marker-tooltip">
                  <strong>{location.id}</strong>
                  <div>{location.city}, {location.state}</div>
                  <div className="tooltip-status" style={{ color: getMarkerColor(location.status) }}>
                    {location.status}
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div className="marker-popup">
                  <h4>{location.id}</h4>
                  <div className="popup-row">
                    <span className="popup-label">Status:</span>
                    <span className="popup-value" style={{ color: getMarkerColor(location.status) }}>
                      {location.status}
                    </span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">Location:</span>
                    <span className="popup-value">{location.city}, {location.state}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">Document:</span>
                    <span className="popup-value">{location.document}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">Date:</span>
                    <span className="popup-value">{location.date}</span>
                  </div>
                  <button className="popup-button">View Details</button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      <div className="map-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-item">
          <div className="legend-marker" style={{ backgroundColor: '#2562EB' }}></div>
          <span>Active Jobs</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker" style={{ backgroundColor: '#10b981' }}></div>
          <span>Completed/Shipped</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Pending Review</span>
        </div>
      </div>
    </div>
  );
}
