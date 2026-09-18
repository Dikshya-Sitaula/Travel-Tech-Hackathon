import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ArrowLeft, Mountain, Trees, Camera, Landmark, Utensils, Heart, Sun, Bike, Waves } from 'lucide-react';

const PlannerStep2 = ({ onNext, onBack, defaultValues }) => {
  const activityGroups = [
    { category: 'Adventure', icon: <Mountain size={18} />, items: [
      { id: 'trekking', name: 'Trekking', type: 'trekking' },
      { id: 'hiking', name: 'Hiking', type: 'day_activity' },
      { id: 'paragliding', name: 'Paragliding', type: 'paragliding' },
      { id: 'rafting', name: 'Rafting', type: 'rafting' },
      { id: 'mountain-biking', name: 'Mountain Biking', type: 'day_activity' },
      { id: 'rock-climbing', name: 'Rock Climbing', type: 'day_activity' }
    ]},
    { category: 'Nature', icon: <Trees size={18} />, items: [
      { id: 'waterfalls', name: 'Waterfalls', type: 'nature' },
      { id: 'lakes', name: 'Lakes', type: 'nature' },
      { id: 'mountain-viewpoints', name: 'Mountain Viewpoints', type: 'nature' },
      { id: 'sunrise', name: 'Sunrise', type: 'nature' },
      { id: 'sunset', name: 'Sunset', type: 'nature' },
      { id: 'forest-walk', name: 'Forest Walk', type: 'nature' },
      { id: 'wildlife', name: 'Wildlife', type: 'nature' }
    ]},
    { category: 'Culture', icon: <Landmark size={18} />, items: [
      { id: 'temples', name: 'Temples', type: 'culture' },
      { id: 'heritage-sites', name: 'Heritage Sites', type: 'culture' },
      { id: 'monasteries', name: 'Monasteries', type: 'culture' },
      { id: 'museums', name: 'Museums', type: 'culture' },
      { id: 'local-villages', name: 'Local Villages', type: 'culture' },
      { id: 'cultural-experiences', name: 'Cultural Experiences', type: 'culture' }
    ]},
    { category: 'Food', icon: <Utensils size={18} />, items: [
      { id: 'local-food', name: 'Local Food', type: 'food' },
      { id: 'food-tour', name: 'Food Tour', type: 'food' },
      { id: 'cafe-hopping', name: 'Café Hopping', type: 'food' },
      { id: 'cooking-experience', name: 'Cooking Experience', type: 'food' },
      { id: 'local-market', name: 'Local Market', type: 'food' }
    ]},
    { category: 'Wellness', icon: <Heart size={18} />, items: [
      { id: 'yoga', name: 'Yoga', type: 'wellness' },
      { id: 'meditation', name: 'Meditation', type: 'wellness' },
      { id: 'spa', name: 'Spa', type: 'wellness' },
      { id: 'relaxation', name: 'Relaxation', type: 'wellness' }
    ]},
    { category: 'Day Activities', icon: <Camera size={18} />, items: [
      { id: 'sightseeing', name: 'Sightseeing', type: 'day_activity' },
      { id: 'short-hikes', name: 'Short Hikes', type: 'day_activity' },
      { id: 'boating', name: 'Boating', type: 'day_activity' },
      { id: 'photography', name: 'Photography', type: 'day_activity' },
      { id: 'shopping', name: 'Shopping', type: 'day_activity' },
      { id: 'cafe-leisure', name: 'Café / Leisure', type: 'day_activity' },
      { id: 'local-experiences', name: 'Local Experiences', type: 'day_activity' }
    ]}
  ];

  const [selectedActivities, setSelectedActivities] = useState(
    Array.isArray(defaultValues.selectedActivities) && defaultValues.selectedActivities.length > 0
      ? defaultValues.selectedActivities
      : [{ id: 'trekking', name: 'Trekking', type: 'trekking' }, { id: 'day_activity', name: 'Day Activities', type: 'day_activity' }]
  );

  const [activityPreferences, setActivityPreferences] = useState(defaultValues.activityPreferences || {
    trekkingDifficulty: 'Moderate',
    trekkingDuration: '1 day'
  });

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.some((item) => item.id === activity.id);
      return exists ? prev.filter((item) => item.id !== activity.id) : [...prev, activity];
    });
  };

  const handleNext = () => {
    onNext({ selectedActivities, activityPreferences });
  };

  const hasTrekking = selectedActivities.some((item) => item.id === 'trekking');

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Step 2 — What do you want to do?</h2>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>Select the activities you want to include in your Nepal trip. You can choose more than one.</p>

      {activityGroups.map((group) => (
        <div key={group.category} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-dark-green)' }}>
            {group.icon}
            {group.category}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {group.items.map((activity) => {
              const isSelected = selectedActivities.some((item) => item.id === activity.id);
              return (
                <div
                  key={activity.id}
                  onClick={() => toggleActivity(activity)}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary-green)' : '1.5px solid var(--color-gray-300)',
                    backgroundColor: isSelected ? 'var(--color-light-mint)' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: isSelected ? 'var(--color-dark-green)' : 'var(--color-dark-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <span>{activity.name}</span>
                  {isSelected && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {hasTrekking && (
        <div style={{ backgroundColor: 'var(--color-light-mint)', border: '1px solid var(--color-mint-green)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-dark-green)' }}>Trekking preferences</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--color-secondary-text)' }}>Difficulty</div>
              <select value={activityPreferences.trekkingDifficulty || 'Moderate'} onChange={(e) => setActivityPreferences((prev) => ({ ...prev, trekkingDifficulty: e.target.value }))} className="form-input">
                <option>Easy</option>
                <option>Moderate</option>
                <option>Difficult</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--color-secondary-text)' }}>Preferred duration</div>
              <select value={activityPreferences.trekkingDuration || '1 day'} onChange={(e) => setActivityPreferences((prev) => ({ ...prev, trekkingDuration: e.target.value }))} className="form-input">
                <option>Few hours</option>
                <option>1 day</option>
                <option>2-3 days</option>
                <option>Multi-day</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
