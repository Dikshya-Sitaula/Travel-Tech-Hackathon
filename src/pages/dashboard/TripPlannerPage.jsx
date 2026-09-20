import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Compass, MapPin, Sparkles } from 'lucide-react';
import { DestinationSelector } from '../../components/ui/DestinationSelector';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { nepalDestinations } from '../../data/nepalDestinations';
import { generateItinerary } from '../../services/api';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { usageService } from '../../services/usageService';
import '../../styles/planner.css';

const travelStyles = [
  { id: 'trekking', name: 'Trekking', description: 'Mountain routes, altitude-aware pacing, and acclimatisation.' },
  { id: 'culture', name: 'Culture & heritage', description: 'Historic places, local communities, food, and traditions.' },
  { id: 'nature', name: 'Nature & leisure', description: 'Viewpoints, lakes, wildlife, and a relaxed daily rhythm.' },
];

const interests = ['Scenic trails', 'Local food', 'Photography', 'Wildlife', 'Spiritual sites', 'Adventure', 'Wellness'];
const budgets = ['Budget', 'Mid-range', 'Premium'];
const paces = ['Relaxed', 'Balanced', 'Active'];

const toDestinationState = (destination) => ({
  name: destination.name,
  subtitle: destination.subtitle || '',
  province: destination.province || '',
  latitude: destination.latitude,
  longitude: destination.longitude,
  source: 'preset',
});

const formatDate = (date) => date.toISOString().split('T')[0];

const TripPlannerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences, setPreferences, saveTrip } = useTrip();
  const { user } = useAuth();
  const initialName = location.state?.initialDestination || preferences.destination || 'Everest Region';
  const preset = nepalDestinations.find(({ name }) => name === initialName) || nepalDestinations[0];
  const [destination, setDestination] = useState(preferences.destinationDetails || toDestinationState(preset));
  const [startDate, setStartDate] = useState(preferences.startDate || formatDate(new Date()));
  const [endDate, setEndDate] = useState(preferences.endDate || formatDate(new Date(Date.now() + 13 * 86400000)));
  const [style, setStyle] = useState(preferences.tripStyle || 'trekking');
  const [selectedInterests, setSelectedInterests] = useState(preferences.interests || ['Scenic trails', 'Local food']);
  const [budget, setBudget] = useState(preferences.budget || 'Mid-range');
  const [pace, setPace] = useState(preferences.travelPace || 'Balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [planUsage, setPlanUsage] = useState(null);

  React.useEffect(() => {
    if (user?.email) usageService.getUsage(user.email).then(setPlanUsage).catch(() => {});
  }, [user?.email]);

  const duration = useMemo(() => {
    const days = Math.floor((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    return Number.isFinite(days) && days > 0 ? days : 0;
  }, [startDate, endDate]);

  const handleGenerate = async () => {
    if (!destination?.name || duration < 1) {
      setError('Choose a destination and a valid date range.');
      return;
    }

    const selectedStyle = travelStyles.find(({ id }) => id === style) || travelStyles[0];
    const nextPreferences = {
      destination: destination.name,
      destinationDetails: destination,
      startDate,
      endDate,
      tripStyle: style,
      selectedActivities: [{ id: style, name: selectedStyle.name, type: style === 'culture' ? 'culture' : style }],
      interests: selectedInterests,
      activityPreferences: { trekkingDifficulty: 'Moderate', trekkingDuration: duration > 5 ? 'Multi-day' : `${duration} days` },
      budget,
      group: 'Solo',
      travelPace: pace,
      socialPreference: 'Just Me',
      discoveryPreferences: ['Local Highlights', 'Safety-focused route'],
    };

    setError('');
    setIsGenerating(true);
    try {
      const latestUsage = await usageService.getUsage(user.email);
      if (latestUsage.limits.itinerary !== null && latestUsage.usage.itinerary >= latestUsage.limits.itinerary) {
        throw new Error('You have used all 3 free itineraries. Upgrade to Premium for unlimited planning.');
      }
      setPreferences(nextPreferences);
      const trip = await generateItinerary(nextPreferences);
      setPlanUsage(await usageService.consume(user.email, 'itinerary'));
      saveTrip(trip);
      navigate('/itinerary');
    } catch (generationError) {
      setError(generationError.message || 'We could not build your journey. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="planner-container quick-planner animate-fade-in">
      <div className="quick-planner-heading">
        <div className="quick-planner-icon"><Sparkles size={24} /></div>
        <div>
          <h1>Plan your Nepal journey</h1>
          <p>Three essentials. One complete, safety-aware itinerary.</p>
        </div>
      </div>

      <Card className="quick-planner-card">
        {planUsage && <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '.8rem 1rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-light-mint)', color: 'var(--color-dark-green)', fontSize: '.85rem', fontWeight: 650 }}><span>{planUsage.plan === 'premium' ? 'Premium plan · Unlimited itineraries' : 'Free plan'}</span><span>{planUsage.limits.itinerary === null ? 'Unlimited' : `${planUsage.usage.itinerary} of ${planUsage.limits.itinerary} itineraries used`}</span></div>}
        <div className="quick-planner-step">
          <div className="quick-planner-label"><span>1</span><div><strong>Where do you want to go?</strong><small>Choose a region or mark a place on the map.</small></div></div>
          <DestinationSelector value={destination} onChange={setDestination} />
        </div>

        <div className="quick-planner-step">
          <div className="quick-planner-label"><span>2</span><div><strong>When will you travel?</strong><small>We use the dates to set a realistic daily pace.</small></div></div>
          <div className="quick-planner-dates">
            <label><CalendarDays size={17} /> Start<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label><CalendarDays size={17} /> End<input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
            <div className="quick-planner-duration"><strong>{duration || '—'}</strong><span>days</span></div>
          </div>
        </div>

        <div className="quick-planner-step">
          <div className="quick-planner-label"><span>3</span><div><strong>What kind of journey is this?</strong><small>Pick one focus—we’ll handle the detailed choices.</small></div></div>
          <div className="quick-planner-styles">
            {travelStyles.map((option) => (
              <button type="button" className={style === option.id ? 'active' : ''} onClick={() => setStyle(option.id)} key={option.id}>
                <Compass size={20} /><span><strong>{option.name}</strong><small>{option.description}</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className="quick-planner-step planner-personalise">
          <div className="quick-planner-label"><span>4</span><div><strong>Shape the experience</strong><small>Add variety without another long questionnaire.</small></div></div>
          <div className="planner-interest-grid">
            {interests.map((interest) => <button type="button" className={selectedInterests.includes(interest) ? 'active' : ''} onClick={() => setSelectedInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest])} key={interest}>{interest}</button>)}
          </div>
          <div className="planner-option-row">
            <label><span>Budget</span><select value={budget} onChange={(event) => setBudget(event.target.value)}>{budgets.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Daily pace</span><select value={pace} onChange={(event) => setPace(event.target.value)}>{paces.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </div>

        {error && <div className="quick-planner-error">{error}</div>}
        <div className="quick-planner-submit">
          <div><MapPin size={17} /><span><strong>{destination?.name || 'Choose a destination'}</strong>{duration > 0 && ` · ${duration} days`}</span></div>
          <Button variant="primary" size="lg" onClick={handleGenerate} disabled={isGenerating || duration < 1}>
            {isGenerating ? 'Building your itinerary…' : 'Create my itinerary'} {!isGenerating && <ArrowRight size={18} />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TripPlannerPage;
