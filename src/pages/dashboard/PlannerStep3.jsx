import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const PlannerStep3 = ({ onNext, onBack, defaultValues }) => {
  const [discovery, setDiscovery] = useState(defaultValues.discovery || 'Less-crowded');
  const [distance, setDistance] = useState(defaultValues.distance || 'Within the region');
  const [nlInput, setNlInput] = useState(defaultValues.nlInput || '');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedChips, setParsedChips] = useState(defaultValues.parsedChips || []);

  const discoveryOptions = [
    { label: 'Popular Highlights', desc: 'Show me the places everyone talks about.' },
    { label: 'Less-crowded', desc: 'Beautiful places with fewer tourists.' },
    { label: 'Local Experiences', desc: 'Show me experiences connected to local communities.' },
    { label: 'Off-the-beaten-path', desc: "Find unusual destinations that aren't part of the typical tourist route." },
    { label: 'Surprise Me', desc: 'Choose unexpected places based on my interests.' }
  ];

  const handleParse = () => {
    if (!nlInput) return;
    setIsParsing(true);
    setTimeout(() => {
      // Mock parsing logic based on input
      const newChips = ['Nature', 'Photography', 'Low crowd'];
      if (nlInput.toLowerCase().includes('hike')) newChips.push('Moderate hiking');
      if (nlInput.toLowerCase().includes('peace')) newChips.push('Peace & Wellness');
      
      setParsedChips([...new Set([...parsedChips, ...newChips])]);
      setIsParsing(false);
    }, 1500);
  };

  const removeChip = (chipToRemove) => {
    setParsedChips(parsedChips.filter(c => c !== chipToRemove));
  };

  const handleNext = () => {
    onNext({ discovery, distance, nlInput, parsedChips });
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>What do you want to discover?</h2>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Tell TrekSafe how adventurous you want your recommendations to be.</p>

      <div className="selectable-grid-lg" style={{ marginBottom: '2.5rem' }}>
        {discoveryOptions.map(opt => (
          <div 
            key={opt.label}
            className={`selectable-card ${discovery === opt.label ? 'selected' : ''}`}
            onClick={() => setDiscovery(opt.label)}
            style={{ padding: '1.25rem' }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{opt.label.toUpperCase()}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{opt.desc}</div>
          </div>
        ))}
      </div>

      <div className="form-group" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>How far are you willing to explore?</h2>
        <div className="selectable-grid">
          {['Nearby', 'Within the region', 'Anywhere in the destination'].map(opt => (
            <div 
              key={opt}
              className={`selectable-card ${distance === opt ? 'selected' : ''}`}
              onClick={() => setDistance(opt)}
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ backgroundColor: 'var(--color-blue-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--color-blue)" /> Describe your ideal trip in your own words.
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>We'll use AI to extract your specific preferences.</p>
        
        <div style={{ position: 'relative' }}>
          <textarea 
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            className="form-input" 
            rows="3" 
            placeholder="I want somewhere beautiful, peaceful, and less touristy. I enjoy mountains, photography, and short hikes."
            style={{ paddingBottom: '3rem', resize: 'none' }}
          />
          <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
            <Button size="sm" variant="primary" onClick={handleParse} disabled={!nlInput || isParsing}>
              {isParsing ? 'Understanding...' : 'Let AI Understand Me ✨'}
            </Button>
          </div>
        </div>

        {parsedChips.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--color-blue)' }}>We understood:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {parsedChips.map(chip => (
                <Badge key={chip} variant="blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ✓ {chip}
                  <button onClick={() => removeChip(chip)} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
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

export default PlannerStep3;
