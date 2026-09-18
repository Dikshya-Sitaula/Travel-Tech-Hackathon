import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const PlannerStep3 = ({ onNext, onBack, defaultValues }) => {
  const [discoveryPreferences, setDiscoveryPreferences] = useState(
    defaultValues.discoveryPreferences || ['Less-Crowded Places', 'Hidden Gems']
  );
  const [userNotes, setUserNotes] = useState(defaultValues.userNotes || '');

  const options = [
    { label: 'Popular Highlights', desc: 'Must-see iconic landmarks & spots.' },
    { label: 'Less-Crowded Places', desc: 'Peaceful locations away from tourist crowds.' },
    { label: 'Local Experiences', desc: 'Homestays, workshops & community culture.' },
    { label: 'Off-the-Beaten-Path', desc: 'Unusual trails and hidden valleys.' },
    { label: 'Hidden Gems', desc: 'Secret viewpoints, waterfalls & local secrets.' },
    { label: 'Food & Culture', desc: 'Traditional authentic dining & heritage.' }
  ];

  const toggleOption = (opt) => {
    if (discoveryPreferences.includes(opt)) {
      setDiscoveryPreferences(discoveryPreferences.filter(o => o !== opt));
    } else {
      setDiscoveryPreferences([...discoveryPreferences, opt]);
    }
  };

  const handleNext = () => {
    onNext({ discoveryPreferences, userNotes });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Step 3 — Discovery Preferences</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>How would you like YatraX to discover and recommend places for you?</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {options.map(opt => {
          const isSelected = discoveryPreferences.includes(opt.label);
          return (
            <div 
              key={opt.label}
              onClick={() => toggleOption(opt.label)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid var(--color-primary-green)' : '1.5px solid var(--color-gray-300)',
                backgroundColor: isSelected ? 'var(--color-light-mint)' : 'white',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '1rem', color: isSelected ? 'var(--color-dark-green)' : 'var(--color-dark-text)', marginBottom: '0.25rem' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>{opt.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Additional Text Notes */}
      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Sparkles size={18} color="var(--color-primary-green)" /> Tell YatraX anything else about your trip...
        </label>
        <textarea 
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          className="form-input"
          rows="3"
          placeholder="e.g. I prefer quiet mornings, love organic farm food, want vegetarian options, and prefer short hikes under 3 hours..."
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="planner-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next: Travel Pace & Social <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep3;
