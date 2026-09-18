import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Check, MapPin, X } from 'lucide-react';
import { Button } from './Button';

import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({ click: (event) => onSelect(event.latlng) });
  return null;
};

export const MapPicker = ({ onClose, onConfirm }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSelect = ({ lat, lng }) => {
    setLocation({ latitude: lat, longitude: lng });
  };

  return (
    <div className="destination-modal-backdrop" onClick={onClose}>
      <div className="destination-map-modal" role="dialog" aria-modal="true" aria-labelledby="map-picker-title" onClick={(event) => event.stopPropagation()}>
        <div className="destination-map-header">
          <div>
            <h2 id="map-picker-title">Choose your destination</h2>
            <p>Search for a place or click anywhere on the map.</p>
          </div>
          <button type="button" className="destination-modal-close" onClick={onClose} aria-label="Close map picker">
            <X size={20} />
          </button>
        </div>

        <div className="destination-map-frame">
          <MapContainer center={[28.3949, 84.1240]} zoom={7} scrollWheelZoom className="destination-map">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onSelect={handleSelect} />
            {location && <Marker position={[location.latitude, location.longitude]} icon={markerIcon} />}
          </MapContainer>
        </div>

        <div className="destination-map-footer">
          {location ? (
            <div className="destination-map-selection">
              <div className="destination-map-selection-title"><MapPin size={17} /> Location selected</div>
              <div className="destination-coordinates">Latitude: {location.latitude.toFixed(4)} &nbsp; Longitude: {location.longitude.toFixed(4)}</div>
            </div>
          ) : (
            <div className="destination-map-hint">Click anywhere in Nepal to place a marker.</div>
          )}
          <div className="destination-map-actions">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => location && onConfirm(location)} disabled={!location}>
              <Check size={16} /> Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
