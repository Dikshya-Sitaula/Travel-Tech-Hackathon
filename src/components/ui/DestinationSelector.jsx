import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Map, MapPin, Search } from 'lucide-react';
import { Button } from './Button';
import { MapPicker } from './MapPicker';
import { nepalDestinations, presetDestinations } from '../../data/nepalDestinations';

const emptyDestination = { name: '', subtitle: '', province: '', latitude: null, longitude: null, source: null };

export const DestinationSelector = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showMap, setShowMap] = useState(false);
  const searchRef = useRef(null);

  const selectedDestination = value || emptyDestination;
  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? nepalDestinations
      .map((destination, index) => ({ destination, index, startsWith: destination.name.toLowerCase().startsWith(normalizedQuery) }))
      .filter(({ destination }) => destination.name.toLowerCase().includes(normalizedQuery) || destination.subtitle.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => Number(b.startsWith) - Number(a.startsWith) || a.index - b.index)
      .slice(0, 5)
      .map(({ destination }) => destination)
    : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDestinationSelect = (destination, source) => {
    onChange({
      name: destination.name,
      subtitle: destination.subtitle || '',
      province: destination.province || '',
      latitude: destination.latitude,
      longitude: destination.longitude,
      source
    });
    setQuery(source === 'search' ? destination.name : '');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (!isOpen || !suggestions.length) {
      if (event.key === 'ArrowDown' && normalizedQuery) setIsOpen(true);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleDestinationSelect(suggestions[activeIndex], 'search');
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleMapConfirm = (location) => {
    handleDestinationSelect({ name: 'Custom location', subtitle: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`, ...location }, 'map');
    setShowMap(false);
  };

  return (
    <>
      <div className="destination-selector">
        <div className="destination-presets" role="group" aria-label="Preset destinations">
          {presetDestinations.map((destination) => {
            const isSelected = selectedDestination.name === destination.name && selectedDestination.source === 'preset';
            return (
              <button type="button" key={destination.name} className={`destination-preset ${isSelected ? 'selected' : ''}`} onClick={() => handleDestinationSelect(destination, 'preset')}>
                {destination.name}
                {isSelected && <Check size={15} />}
              </button>
            );
          })}
          <button type="button" className={`destination-preset ${selectedDestination.source === 'map' ? 'selected' : ''}`} onClick={() => setShowMap(true)}>
            + Custom Destination
          </button>
        </div>

        <div className="destination-or"><span>OR</span></div>

        <div className="destination-search-wrap" ref={searchRef}>
          <label className="destination-search-label" htmlFor="destination-search">Search destination</label>
          <div className="destination-search-box">
            <Search size={18} aria-hidden="true" />
            <input
              id="destination-search"
              type="search"
              value={query}
              placeholder="Search for a destination..."
              autoComplete="off"
              onFocus={() => normalizedQuery && setIsOpen(true)}
              onChange={(event) => { setQuery(event.target.value); setIsOpen(Boolean(event.target.value.trim())); setActiveIndex(-1); }}
              onKeyDown={handleSearchKeyDown}
              aria-expanded={isOpen}
              aria-controls="destination-suggestions"
            />
            <ChevronDown size={17} className={isOpen ? 'destination-chevron open' : 'destination-chevron'} aria-hidden="true" />
          </div>
          {isOpen && (
            <div className="destination-suggestions" id="destination-suggestions" role="listbox">
              {suggestions.length ? suggestions.map((destination, index) => (
                <button type="button" role="option" aria-selected={index === activeIndex} className={`destination-suggestion ${index === activeIndex ? 'active' : ''}`} key={destination.name} onMouseDown={(event) => event.preventDefault()} onClick={() => handleDestinationSelect(destination, 'search')}>
                  <MapPin size={17} />
                  <span><strong>{destination.name}</strong><small>{destination.subtitle}</small></span>
                </button>
              )) : <div className="destination-no-results">No destinations found</div>}
            </div>
          )}
        </div>

        <Button variant="outline" className="destination-map-button" onClick={() => setShowMap(true)}>
          <Map size={17} /> Pick on Map
        </Button>

        {selectedDestination.name && (
          <div className="selected-destination-card" aria-live="polite">
            <div className="selected-destination-heading"><MapPin size={18} /> {selectedDestination.source === 'map' ? 'Selected Location' : 'Selected Destination'}</div>
            <div className="selected-destination-name">{selectedDestination.name}</div>
            <div className="selected-destination-subtitle">{selectedDestination.source === 'map' ? selectedDestination.subtitle : `${selectedDestination.subtitle}${selectedDestination.province ? `, ${selectedDestination.province}` : ''}`}</div>
            {selectedDestination.source === 'map' && <div className="destination-coordinates">{selectedDestination.latitude.toFixed(4)}, {selectedDestination.longitude.toFixed(4)}</div>}
            <div className="selected-destination-ready"><Check size={15} /> {selectedDestination.source === 'map' ? 'Location selected' : 'Ready for your AI itinerary'}</div>
          </div>
        )}
      </div>
      {showMap && <MapPicker onClose={() => setShowMap(false)} onConfirm={handleMapConfirm} />}
    </>
  );
};
