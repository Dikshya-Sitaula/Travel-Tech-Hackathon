import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, MapPin, Calendar, Users, Wallet } from 'lucide-react';
import { DestinationSelector } from '../../components/ui/DestinationSelector';
import { nepalDestinations } from '../../data/nepalDestinations';

const createDestinationState = (destination, source = 'preset') => ({
  name: destination.name,
  subtitle: destination.subtitle || '',
  province: destination.province || '',
  latitude: destination.latitude,
  longitude: destination.longitude,
  source
});

const PlannerStep1 = ({ onNext, defaultValues }) => {
  const defaultDestination = nepalDestinations.find(({ name }) => name === defaultValues.destination) || nepalDestinations.find(({ name }) => name === 'Pokhara');
  const [data, setData] = useState({
    destination: defaultDestination.name,
    destinationDetails: defaultValues.destinationDetails || createDestinationState(defaultDestination),
    customDestination: defaultValues.customDestination || '',
    startDate: defaultValues.startDate || new Date().toISOString().split('T')[0],
    endDate: defaultValues.endDate || new Date(Date.now() + 4*86400000).toISOString().split('T')[0],
    group: defaultValues.group || 'Solo',
    budget: defaultValues.budget || 'Mid-range'
  });

  const handleSelect = (field, val) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  const handleDestinationSelect = (destination) => {
    setData(prev => ({
      ...prev,
      destination: destination.name,
      destinationDetails: destination,
      customDestination: destination.source === 'map' ? destination.name : ''
    }));
  };

  const handleNext = () => {
    onNext({ ...data, destination: data.destinationDetails.name || data.destination });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Step 1 — Trip Basics</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>Where and when are you traveling in Nepal?</p>

      {/* Destination Selection */}
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <MapPin size={18} color="var(--color-primary-green)" /> Destination
        </label>
        <DestinationSelector value={data.destinationDetails} onChange={handleDestinationSelect} />
      </div>

      {/* Trip Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Calendar size={18} color="var(--color-primary-green)" /> Start Date
          </label>
          <input 
            type="date" 
            value={data.startDate} 
            onChange={(e) => setData(prev => ({ ...prev, startDate: e.target.value }))} 
            className="form-input" 
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Calendar size={18} color="var(--color-primary-green)" /> End Date
          </label>
          <input 
            type="date" 
            value={data.endDate} 
            onChange={(e) => setData(prev => ({ ...prev, endDate: e.target.value }))} 
            className="form-input" 
          />
        </div>
      </div>

      {/* Traveling With */}
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Users size={18} color="var(--color-primary-green)" /> Traveling With
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          {['Solo', 'Couple', 'Friends', 'Family'].map(g => (
            <div 
              key={g}
              onClick={() => handleSelect('group', g)}
              style={{
                textAlign: 'center',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-gray-300)',
                backgroundColor: data.group === g ? 'var(--color-light-mint)' : 'white',
                color: data.group === g ? 'var(--color-dark-green)' : 'var(--color-dark-text)',
                fontWeight: data.group === g ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              {g}
            </div>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Wallet size={18} color="var(--color-primary-green)" /> Budget
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Budget', desc: 'Backpacker / Local stays' },
            { label: 'Mid-range', desc: 'Comfortable hotels & cafes' },
            { label: 'Premium', desc: 'Luxury resorts & private transport' }
          ].map(b => (
            <div 
              key={b.label}
              onClick={() => handleSelect('budget', b.label)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-gray-300)',
                backgroundColor: data.budget === b.label ? 'var(--color-light-mint)' : 'white',
                color: data.budget === b.label ? 'var(--color-dark-green)' : 'var(--color-dark-text)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 600 }}>{b.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginTop: '0.2rem' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="planner-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleNext}>
          Next: Travel Style <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep1;
