import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { itineraryService } from '../../services/itineraryService';
import { useTrip } from '../../context/TripContext';

const PlannerStep5 = ({ onBack, preferences }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const navigate = useNavigate();
  const { saveTrip } = useTrip();

  const progressMessages = [
    "Understanding your travel style...",
    "Finding suitable destinations...",
    "Discovering less-crowded experiences...",
    "Checking your budget...",
    "Building your daily itinerary...",
    "Optimizing your journey..."
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate multi-stage loading
    for (let i = 0; i < progressMessages.length; i++) {
      setProgressStep(i);
      await new Promise(r => setTimeout(r, 600)); // 600ms per step
    }

    // Call the actual mock service
    const tripData = await itineraryService.generateItinerary(preferences);
    
    // Merge preferences into tripData so they are accessible later
    tripData.preferences = preferences;
    saveTrip(tripData);
    
    navigate('/dashboard/planner/result');
  };

  if (isGenerating) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--color-blue-bg)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--color-blue)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
          <Sparkles color="var(--color-blue)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Building your journey...</h3>
        <div style={{ color: 'var(--color-gray-600)', minHeight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="var(--color-green)" /> {progressMessages[progressStep]}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  const SummaryItem = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-gray-100)' }}>
      <span style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your journey is ready to be planned.</h2>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Review your preferences before TrekSafe builds your itinerary.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-navy-light)' }}>Trip Details</h3>
          <Card style={{ padding: '1rem' }}>
            <SummaryItem label="Destination" value={preferences.destination || 'Not specified'} />
            <SummaryItem label="Duration" value={`${preferences.days || '5'} Days`} />
            <SummaryItem label="Travel Group" value={preferences.group || 'Solo'} />
            <SummaryItem label="Budget" value={preferences.budget || 'Mid-range'} />
          </Card>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-navy-light)' }}>Style & Discovery</h3>
          <Card style={{ padding: '1rem' }}>
            <SummaryItem label="Travel Style" value={preferences.style?.join(', ') || 'Not specified'} />
            <SummaryItem label="Pace" value={preferences.pace || 'Balanced'} />
            <SummaryItem label="Activity Level" value={preferences.activityLevel || 'Moderate'} />
            <SummaryItem label="Discovery" value={preferences.discovery || 'Less-crowded'} />
          </Card>
        </div>
      </div>

      <Card style={{ background: 'linear-gradient(135deg, var(--color-blue-bg), white)', borderColor: 'var(--color-blue-light)', textAlign: 'center', padding: '2.5rem' }}>
        <Sparkles size={32} color="var(--color-blue)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to build your journey?</h3>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          TrekSafe will combine your preferences with destination data to create a personalized itinerary.
        </p>
        <Button size="lg" variant="primary" onClick={handleGenerate}>
          Generate My AI Itinerary <Sparkles size={18} style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Card>

      <div className="planner-actions">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep5;
