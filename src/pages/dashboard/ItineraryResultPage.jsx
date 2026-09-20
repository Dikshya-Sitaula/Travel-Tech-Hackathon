import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Bookmark, CalendarDays, Check, ChevronDown, Clock, Cloud, CloudOff, ExternalLink, MapPin, Mountain, RefreshCw, Share2, ShieldCheck, Smartphone, Utensils } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { offlineTripService } from '../../services/offlineTripService';
import { generateItinerary } from '../../services/api';
import { useTrip } from '../../context/TripContext';
import '../../styles/planner.css';

const formatAltitude = (activity) => activity?.maxAltitude || activity?.altitude || activity?.elevation || 'Route dependent';
const formatMeals = (activity) => activity?.meals || 'Meals based on the selected route';
const formatStay = (activity, style) => activity?.accommodation || (style?.toLowerCase().includes('trek') ? 'Teahouse / lodge' : 'Hotel or local stay');
const extractHighestAltitude = (value) => {
  const readings = String(value || '').match(/\d[\d,]*/g) || [];
  return readings.reduce((highest, reading) => Math.max(highest, Number(reading.replace(/,/g, '')) || 0), 0);
};

const ItineraryResultPage = () => {
  const navigate = useNavigate();
  const { currentTrip, saveTrip, preferences, isOfflineReady, markOfflineReady, removeOfflineCopy } = useTrip();
  const [openDays, setOpenDays] = useState([1]);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (!currentTrip) {
    return <div className="itinerary-empty"><Mountain size={42} /><h2>No itinerary found</h2><p>Answer three quick questions to create your Nepal journey.</p><Button onClick={() => navigate('/trip-planner')}>Plan my trip</Button></div>;
  }

  const days = Array.isArray(currentTrip.days) ? currentTrip.days : [];
  const toggleDay = (day) => setOpenDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);

  const saveOffline = async () => {
    await offlineTripService.saveOffline(currentTrip);
    markOfflineReady();
    setNoticeType('success');
    setNotice('Journey saved for offline access.');
  };

  const toggleOffline = async () => {
    if (isOfflineReady) {
      removeOfflineCopy();
      setNoticeType('success');
      setNotice('Offline copy removed. Your online itinerary is unchanged.');
      return;
    }
    await saveOffline();
  };

  const regenerate = async () => {
    setIsRegenerating(true);
    try {
      const trip = await generateItinerary(preferences || { destination: currentTrip.destination });
      saveTrip(trip);
      setNoticeType('success');
      setNotice('A fresh itinerary variation is ready.');
    } catch (error) {
      setNoticeType('error');
      setNotice(error.message || 'The AI could not regenerate this itinerary. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const share = async () => {
    const summary = `${currentTrip.destination} · ${currentTrip.duration}\n${days.map((day) => `Day ${day.day}: ${day.title}`).join('\n')}`;
    await navigator.clipboard?.writeText(summary);
    setNoticeType('success');
    setNotice('Itinerary summary copied.');
  };

  const maxAltitude = days.reduce((highest, day) => {
    const values = (day.activities || []).map((item) => extractHighestAltitude(formatAltitude(item)));
    return Math.max(highest, ...values, 0);
  }, 0);

  const highlights = days.slice(0, 4).map((day) => day.title).filter(Boolean);

  return (
    <div className="trip-detail animate-fade-in">
      <button className="trip-detail-back" onClick={() => navigate('/trip-planner')}><ArrowLeft size={16} /> Adjust trip</button>

      {notice && <div className={`trip-detail-notice ${noticeType === 'error' ? 'error' : ''}`}>{noticeType === 'success' && <Check size={17} />} {notice}</div>}

      <header className="trip-detail-hero">
        <div>
          <span className="trip-detail-label">Your personalised Nepal itinerary</span>
          <h1>{currentTrip.destination} — {currentTrip.duration}</h1>
          <p>A practical day-by-day journey balanced around local experiences, realistic travel time, and safety.</p>
        </div>
        <div className="trip-detail-actions">
          <Button variant="outline" size="sm" onClick={saveOffline}><Bookmark size={16} /> Save offline</Button>
          <Button variant="outline" size="sm" onClick={regenerate} disabled={isRegenerating}><RefreshCw size={16} /> {isRegenerating ? 'Regenerating…' : 'Regenerate'}</Button>
          <Button variant="primary" size="sm" onClick={share}><Share2 size={16} /> Share</Button>
        </div>
      </header>

      <section className="trip-key-info" aria-label="Key trip information">
        <div><CalendarDays /><span><small>Duration</small><strong>{currentTrip.duration}</strong></span></div>
        <div><Activity /><span><small>Trip style</small><strong>{currentTrip.style || 'Balanced exploration'}</strong></span></div>
        <div><MapPin /><span><small>Destination</small><strong>{currentTrip.destination}</strong></span></div>
        <div><Mountain /><span><small>Maximum altitude</small><strong>{maxAltitude ? `${maxAltitude.toLocaleString()}m` : 'Route dependent'}</strong></span></div>
      </section>

      <nav className="trip-detail-nav"><a href="#overview">Overview</a><a href="#offline">Offline access</a><a href="#itinerary">Itinerary</a><a href="#safety">Safety notes</a></nav>

      <section className="trip-overview" id="overview">
        <div>
          <h2>Overview</h2>
          <p>{currentTrip.overview || `This AI-generated itinerary covers ${currentTrip.destination} across ${days.length} days, including route timing, stays, meals, and altitude information.`}</p>
        </div>
        <aside>
          <h3>Journey highlights</h3>
          <ul>{highlights.map((highlight) => <li key={highlight}><Check size={16} /> {highlight}</li>)}</ul>
        </aside>
      </section>

      <section className={`trip-offline ${isOfflineReady ? 'ready' : ''}`} id="offline">
        <div className="trip-offline-icon">{isOfflineReady ? <CloudOff size={25} /> : <Cloud size={25} />}</div>
        <div><span>{isOfflineReady ? 'Offline kit ready' : 'Online itinerary'}</span><h2>{isOfflineReady ? 'This journey travels with you' : 'Prepare before the signal disappears'}</h2><p>{isOfflineReady ? 'Your itinerary is stored on this device for low-signal areas. Emergency calls still depend on available mobile service.' : 'Save the day plan, route notes, stays, meals, and altitude guidance on this device.'}</p><div className="trip-offline-items"><span><Check size={14} /> Full itinerary</span><span><Check size={14} /> Safety notes</span><span><Smartphone size={14} /> This device</span></div></div>
        <Button variant={isOfflineReady ? 'outline' : 'primary'} onClick={toggleOffline}>{isOfflineReady ? 'Return to online only' : 'Make available offline'}</Button>
      </section>

      <section className="trip-itinerary" id="itinerary">
        <div className="trip-section-heading"><div><span>Day-by-day plan</span><h2>Itinerary</h2></div><button onClick={() => setOpenDays(openDays.length === days.length ? [] : days.map((day) => day.day))}>{openDays.length === days.length ? 'Collapse all' : 'Expand all'}</button></div>
        <div className="trip-day-list">
          {days.map((day) => {
            const activities = Array.isArray(day.activities) ? day.activities : [];
            const primary = activities[0] || {};
            const dayTitle = day.title || day.theme || primary.name || `Explore ${currentTrip.destination}`;
            const isOpen = openDays.includes(day.day);
            return (
              <article className={`trip-day ${isOpen ? 'open' : ''}`} key={day.day}>
                <button className="trip-day-header" onClick={() => toggleDay(day.day)} aria-expanded={isOpen}>
                  <span className="trip-day-number">Day {day.day}</span>
                  <span className="trip-day-title"><strong>{dayTitle}</strong>{primary.travelTime && <small>{primary.travelTime}</small>}</span>
                  <ChevronDown size={20} />
                </button>
                {isOpen && (
                  <div className="trip-day-body">
                    <p>{primary.description || `Explore ${dayTitle} at a balanced pace with time for local context and rest.`}</p>
                    {activities.length > 1 && <div className="trip-day-activities">{activities.map((activity) => <div key={activity.id || activity.name}><Clock size={15} /><span><strong>{activity.time || 'Flexible'}</strong>{activity.name}</span></div>)}</div>}
                    <div className="trip-day-facts">
                      <div><Bookmark size={16} /><span><small>Accommodation</small><strong>{formatStay(primary, currentTrip.style)}</strong></span></div>
                      <div><Utensils size={16} /><span><small>Meals</small><strong>{formatMeals(primary)}</strong></span></div>
                      <div><Mountain size={16} /><span><small>Maximum altitude</small><strong>{formatAltitude(primary)}</strong></span></div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="trip-safety" id="safety">
        <ShieldCheck size={28} />
        <div><h2>Safety comes before the schedule</h2><p>Weather, trail conditions, transport, and altitude can change the plan. Above 3,000m, ascend gradually and never skip acclimatisation. Stop ascending if symptoms appear; severe or worsening symptoms require assisted descent and medical or rescue help.</p></div>
        <Button variant="outline" onClick={() => navigate('/assistant')}>Ask safety informant</Button>
      </section>

      <section className="trip-operator" aria-label="Recommended travel operator">
        <div><span>Ready to turn this plan into a real journey?</span><h2>Continue with Eternal Himalaya</h2><p>Check live departures, guide availability, permits, and booking details with our designated Nepal operator.</p></div>
        <a className="btn btn-primary btn-md" href="https://eternalhimalaya.com/?utm_source=yatrax&utm_medium=itinerary&utm_campaign=operator_referral" target="_blank" rel="noreferrer">Visit Eternal Himalaya <ExternalLink size={16} /></a>
      </section>
    </div>
  );
};

export default ItineraryResultPage;
