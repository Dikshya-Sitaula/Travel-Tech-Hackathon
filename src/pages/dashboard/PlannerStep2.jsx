import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const PlannerStep2 = ({ onNext, onBack, defaultValues }) => {
  const [style, setStyle] = useState(defaultValues.style || []);
  const [pace, setPace] = useState(defaultValues.pace || 'Balanced');
  const [activityLevel, setActivityLevel] = useState(defaultValues.activityLevel || 'Moderate');

  const toggleStyle = (option) => {
    if (style.includes(option)) {
      setStyle(style.filter(i => i !== option));
    } else {
      setStyle([...style, option]);
    }
  };

  const styleOptions = [
    { label: 'Adventure', icon: '🏔️' },
    { label: 'Nature', icon: '🌿' },
    { label: 'Culture & History', icon: '🏛️' },
    { label: 'Food', icon: '🍜' },
    { label: 'Photography', icon: '📸' },
    { label: 'Peace & Wellness', icon: '🧘' },
    { label: 'Nightlife', icon: '🎉' },
    { label: 'Off-the-beaten-path', icon: '🏕️' },
    { label: 'Shopping', icon: '🛍️' },
    { label: 'Extreme Activities', icon: '🧗' }
  ];

  const handleNext = () => {
    onNext({ style, pace, activityLevel });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>What kind of traveler are you?</h2>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Choose everything that sounds like you.</p>

      <div className="selectable-grid" style={{ marginBottom: '2.5rem' }}>
        {styleOptions.map(opt => (
          <div 
            key={opt.label}
            className={`selectable-card ${style.includes(opt.label) ? 'selected' : ''}`}
            onClick={() => toggleStyle(opt.label)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
          >
            <div style={{ fontSize: '1.5rem' }}>{opt.icon}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, textAlign: 'center' }}>{opt.label}</div>
            {style.includes(opt.label) && <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--color-blue)' }}>✓</div>}
          </div>
        ))}
      </div>

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>What's your travel pace?</h2>
        <div className="selectable-grid">
          {['Relaxed', 'Balanced', 'Fast-paced'].map(opt => (
            <div 
              key={opt}
              className={`selectable-card ${pace === opt ? 'selected' : ''}`}
              onClick={() => setPace(opt)}
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>How active do you want your trip to be?</h2>
        <div className="selectable-grid">
          {['Low', 'Moderate', 'High'].map(opt => (
            <div 
              key={opt}
              className={`selectable-card ${activityLevel === opt ? 'selected' : ''}`}
              onClick={() => setActivityLevel(opt)}
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>

      <div className="planner-actions">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep2;
