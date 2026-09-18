import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { generateItinerary } from '../../services/api';
import { useTrip } from '../../context/TripContext';

const PlannerStep5 = ({ onBack, preferences }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const navigate = useNavigate();
  const { saveTrip } = useTrip();

  const progressMessages = [
    "Understanding your travel preferences...",
    "Finding places you'll love...",
    "Building your Nepal itinerary...",
    "Adding local experiences...",
    "Finalizing your journey..."
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulated delay showing sequential progress messages
    for (let i = 0; i < progressMessages.length; i++) {
      setProgressStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    const tripData = await generateItinerary(preferences);
    saveTrip(tripData);
    navigate('/itinerary');
  };

  if (isGenerating) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--color-light-mint)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--color-primary-green)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
          <Sparkles color="var(--color-primary-green)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Building your Nepal journey...</h3>
        <div style={{ color: 'var(--color-dark-green)', fontWeight: 600, fontSize: '1.05rem', minHeight: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="var(--color-primary-green)" /> {progressMessages[progressStep]}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  const SummaryItem = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-gray-200)' }}>
      <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '65%', color: 'var(--color-dark-text)' }}>{value}</span>
    </div>
  );

  const selectedActivityNames = Array.isArray(preferences.selectedActivities)
    ? preferences.selectedActivities.map((item) => typeof item === 'string' ? item : (item.name || 'Activity')).join(', ')
    : (Array.isArray(preferences.style) ? preferences.style.join(', ') : (preferences.style || 'Trekking, Day Activities'));

  const calculateDays = () => {
    if (preferences.startDate && preferences.endDate) {
      const start = new Date(preferences.startDate);
      const end = new Date(preferences.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 5;
    }
    return 5;
  };

  const daysCount = calculateDays();

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Step 5 — Review Your Journey</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>Verify your selections before YatraX creates your personalized Nepal itinerary.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Card style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--color-dark-green)', fontFamily: 'var(--font-heading)' }}>Trip Basics</h3>
          <SummaryItem label="Destination" value={preferences.destination || 'Pokhara'} />
          <SummaryItem label="Dates" value={`${preferences.startDate || 'Start'} to ${preferences.endDate || 'End'}`} />
          <SummaryItem label="Duration" value={`${daysCount} Days`} />
          <SummaryItem label="Travelers" value={preferences.group || 'Solo'} />
          <SummaryItem label="Budget" value={preferences.budget || 'Mid-range'} />
        </Card>

        <Card style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--color-dark-green)', fontFamily: 'var(--font-heading)' }}>Style & Preferences</h3>
          <SummaryItem label="Activities" value={selectedActivityNames} />
          <SummaryItem label="Discovery" value={Array.isArray(preferences.discoveryPreferences) ? preferences.discoveryPreferences.join(', ') : (preferences.discoveryPreferences || 'Less-Crowded Places')} />
          <SummaryItem label="Travel Pace" value={preferences.travelPace || 'Balanced'} />
          <SummaryItem label="Social Preference" value={preferences.socialPreference || 'Just Me'} />
        </Card>
      </div>

      <Card style={{ background: 'linear-gradient(135deg, var(--color-light-mint), white)', borderColor: 'var(--color-mint-green)', textAlign: 'center', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <Sparkles size={36} color="var(--color-primary-green)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Ready for your Nepal adventure?</h3>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: '2rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
          YatraX AI will generate a custom day-by-day plan with activities, reasons for recommendation, and estimated times.
        </p>
        <Button size="lg" variant="primary" onClick={handleGenerate} style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: 600 }}>
          Generate My Journey ✨
        </Button>
      </Card>

      <div className="planner-actions" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep5;
