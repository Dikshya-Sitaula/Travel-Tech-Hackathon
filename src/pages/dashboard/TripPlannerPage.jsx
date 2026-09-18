import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';
import PlannerStep1 from './PlannerStep1';
import PlannerStep2 from './PlannerStep2';
import PlannerStep3 from './PlannerStep3';
import PlannerStep4 from './PlannerStep4';
import PlannerStep5 from './PlannerStep5';
import '../../styles/planner.css';

const TripPlannerPage = () => {
  const location = useLocation();
  const initialDest = location.state?.initialDestination || '';

  const [currentStep, setCurrentStep] = useState(1);
  const { preferences, setPreferences } = useTrip();

  const stepTitles = [
    "Trip Basics",
    "Travel Style",
    "Discovery Preferences",
    "Pace & Social Preference",
    "Review & Generate"
  ];

  const handleNext = (data) => {
    setPreferences((prev) => ({ ...prev, ...data }));
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PlannerStep1 onNext={handleNext} defaultValues={{ ...preferences, destination: initialDest || preferences.destination }} />;
      case 2:
        return <PlannerStep2 onNext={handleNext} onBack={handleBack} defaultValues={preferences} />;
      case 3:
        return <PlannerStep3 onNext={handleNext} onBack={handleBack} defaultValues={preferences} />;
      case 4:
        return <PlannerStep4 onNext={handleNext} onBack={handleBack} defaultValues={preferences} />;
      case 5:
        return <PlannerStep5 onBack={handleBack} preferences={preferences} />;
      default:
        return <PlannerStep1 onNext={handleNext} defaultValues={preferences} />;
    }
  };

  return (
    <div className="planner-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="planner-header" style={{ marginBottom: '1.5rem' }}>
        <div className="planner-title-area" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="planner-icon" style={{ fontSize: '2rem', backgroundColor: 'var(--color-light-mint)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>✨</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>YatraX AI Trip Planner</h1>
            <p style={{ color: 'var(--color-secondary-text)' }}>Customize your Nepal journey step by step with intelligent recommendations.</p>
          </div>
        </div>
      </div>

      {/* Step Numbers Progress Bar: 1 -> 2 -> 3 -> 4 -> 5 */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', position: 'relative' }}>
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div 
                key={stepNum} 
                onClick={() => { if (stepNum < currentStep) setCurrentStep(stepNum); }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  zIndex: 2, 
                  cursor: stepNum < currentStep ? 'pointer' : 'default' 
                }}
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--color-primary-green)' : isCompleted ? 'var(--color-dark-green)' : 'var(--color-gray-200)',
                  color: isActive || isCompleted ? 'white' : 'var(--color-secondary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: isActive ? '0 0 0 4px var(--color-light-mint)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: isActive ? 700 : 500, 
                  color: isActive ? 'var(--color-dark-green)' : 'var(--color-secondary-text)',
                  marginTop: '0.35rem',
                  textAlign: 'center',
                  display: 'none',
                  '@media (min-width: 640px)': { display: 'block' }
                }}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Fill Bar */}
        <div className="progress-bar-bg" style={{ height: '6px', backgroundColor: 'var(--color-gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
          <div className="progress-bar-fill" style={{ height: '100%', backgroundColor: 'var(--color-primary-green)', width: `${((currentStep - 1) / 4) * 100}%`, transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-200)' }}>
        {renderStep()}
      </div>
    </div>
  );
};

export default TripPlannerPage;
