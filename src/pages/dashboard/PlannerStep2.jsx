import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const PlannerStep2 = ({ onNext, onBack, defaultValues }) => {
  const [style, setStyle] = useState(defaultValues.style || ['Adventure', 'Nature']);

  const toggleStyle = (option) => {
    if (style.includes(option)) {
      setStyle(style.filter(i => i !== option));
    } else {
      setStyle([...style, option]);
    }
  };

  const styleOptions = [
    { label: 'Adventure', icon: '🏔️', desc: 'Trekking, rafting & thrill' },
    { label: 'Nature', icon: '🌿', desc: 'Mountains, lakes & forests' },
    { label: 'Photography', icon: '📸', desc: 'Scenic vistas & golden hour' },
    { label: 'Culture', icon: '🏛️', desc: 'Temples, heritage & history' },
    { label: 'Food', icon: '🍜', desc: 'Local delicacies & tea houses' },
    { label: 'Wellness', icon: '🧘', desc: 'Yoga, relaxation & spa' },
    { label: 'Spiritual', icon: '🕉️', desc: 'Monasteries & meditation' },
    { label: 'Wildlife', icon: '🐅', desc: 'Safari, rhinos & bird watching' }
  ];

  const handleNext = () => {
    onNext({ style });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Step 2 — Travel Style</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>Select all travel styles you are interested in for this trip.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {styleOptions.map(opt => {
          const isSelected = style.includes(opt.label);
          return (
            <div 
              key={opt.label}
              onClick={() => toggleStyle(opt.label)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid var(--color-primary-green)' : '1.5px solid var(--color-gray-300)',
                backgroundColor: isSelected ? 'var(--color-light-mint)' : 'white',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '1.75rem' }}>{opt.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: isSelected ? 'var(--color-dark-green)' : 'var(--color-dark-text)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{opt.desc}</div>
              </div>
              {isSelected && (
                <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'var(--color-primary-green)' }}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="planner-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next: Discovery Preferences <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep2;
