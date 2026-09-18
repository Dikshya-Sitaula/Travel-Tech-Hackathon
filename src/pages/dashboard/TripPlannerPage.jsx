import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';
import PlannerStep1 from './PlannerStep1';
import PlannerStep2 from './PlannerStep2';
import PlannerStep3 from './PlannerStep3';
import PlannerStep5 from './PlannerStep5'; // Using Step 5 for the review and generation
import '../../styles/planner.css';

const TripPlannerPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { preferences, setPreferences } = useTrip();
  const navigate = useNavigate();

  const handleNext = (data) => {
    setPreferences((prev) => ({ ...prev, ...data }));
    if (currentStep < 5) { // Assuming 4 steps mapped: 1, 2, 3, 5
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Skip Step 4 for now and map 4 to Step 5 (Review)
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PlannerStep1 onNext={handleNext} defaultValues={preferences} />;
      case 2:
        return <PlannerStep2 onNext={handleNext} onBack={handleBack} defaultValues={preferences} />;
      case 3:
        return <PlannerStep3 onNext={handleNext} onBack={handleBack} defaultValues={preferences} />;
      case 4:
        return <PlannerStep5 onBack={handleBack} preferences={preferences} />;
      default:
        return <PlannerStep1 onNext={handleNext} defaultValues={preferences} />;
    }
  };

  const titles = [
    "Trip Basics",
    "Traveler Profile",
    "Discovery Preferences",
    "Review & Generate"
  ];

  return (
    <div className="planner-container animate-fade-in">
      <div className="planner-header">
        <div className="planner-title-area">
          <div className="planner-icon">✨</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>AI Trip Planner</h1>
            <p style={{ color: 'var(--color-gray-600)' }}>Tell us how you like to travel. We'll build a journey around you.</p>
          </div>
        </div>
      </div>

      <div className="planner-progress">
        <span style={{ width: '100px' }}>Step {currentStep} of 4</span>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
        </div>
        <span style={{ color: 'var(--color-navy)' }}>{titles[currentStep - 1]}</span>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-200)' }}>
        {renderStep()}
      </div>
    </div>
  );
};

export default TripPlannerPage;
