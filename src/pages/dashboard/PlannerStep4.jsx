import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft, Clock, Users } from 'lucide-react';

const PlannerStep4 = ({ onNext, onBack, defaultValues }) => {
  const [travelPace, setTravelPace] = useState(defaultValues.travelPace || 'Balanced');
  const [socialPreference, setSocialPreference] = useState(defaultValues.socialPreference || 'Just Me');

  const paceOptions = [
    { label: 'Relaxed', desc: 'Slower pace with plenty of free time and rest.' },
    { label: 'Balanced', desc: 'A comfortable mix of sightseeing and downtime.' },
    { label: 'Packed', desc: 'Maximized schedule to see as much as possible.' }
  ];

  const socialOptions = [
    { label: 'Just Me', desc: 'Focus strictly on a private/solo journey.' },
    { label: 'With My Group', desc: 'Traveling only with my travel companions.' },
    { label: 'Open to Meeting Travelers', desc: 'Interested in joining activities with other travelers.' },
    { label: 'Join an Existing Group', desc: 'Prefer traveling with a group tour or trek.' }
  ];

  const handleNext = () => {
    onNext({ travelPace, socialPreference });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Travel Pace & Social Preferences</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>How fast do you like to move, and who would you like to travel with?</p>

      {/* Travel Pace */}
      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-green)' }}>
          <Clock size={18} /> Travel Pace
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {paceOptions.map(opt => (
            <div 
              key={opt.label}
              className={`selectable-card ${travelPace === opt.label ? 'selected' : ''}`}
              onClick={() => setTravelPace(opt.label)}
              style={{ padding: '1.25rem', cursor: 'pointer', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-300)', backgroundColor: travelPace === opt.label ? 'var(--color-light-mint)' : 'white' }}
            >
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem', color: travelPace === opt.label ? 'var(--color-dark-green)' : 'var(--color-dark-text)' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Preference */}
      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-green)' }}>
          <Users size={18} /> Social Preference
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {socialOptions.map(opt => (
            <div 
              key={opt.label}
              className={`selectable-card ${socialPreference === opt.label ? 'selected' : ''}`}
              onClick={() => setSocialPreference(opt.label)}
              style={{ padding: '1.25rem', cursor: 'pointer', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-300)', backgroundColor: socialPreference === opt.label ? 'var(--color-light-mint)' : 'white' }}
            >
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem', color: socialPreference === opt.label ? 'var(--color-dark-green)' : 'var(--color-dark-text)' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="planner-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Review Trip <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep4;
