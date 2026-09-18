import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Edit2, Share2, RefreshCw, MapPin, Clock, DollarSign, Activity, Users, Check, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useTrip } from '../../context/TripContext';
import { offlineTripService } from '../../services/offlineTripService';
import { itineraryService } from '../../services/itineraryService';
import { mockTravelGroups } from '../../data/mockData';

const ItineraryResultPage = () => {
  const { currentTrip, saveTrip, markOfflineReady } = useTrip();
  const navigate = useNavigate();
  const [isSavingOffline, setIsSavingOffline] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState('');
  const [editingActivity, setEditingActivity] = useState(null);
  const [altPreference, setAltPreference] = useState('');
  const [isFindingAlt, setIsFindingAlt] = useState(false);

  if (!currentTrip) {
    return (
      <div className="animate-fade-in text-center" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No itinerary found</h2>
        <Button onClick={() => navigate('/dashboard/planner')} variant="primary">Plan a Trip</Button>
      </div>
    );
  }

  const handleSaveOffline = async () => {
    setIsSavingOffline(true);
    setOfflineStatus('Saving itinerary...');
    await new Promise(r => setTimeout(r, 800));
    setOfflineStatus('Saving destination information...');
    await new Promise(r => setTimeout(r, 800));
    setOfflineStatus('Saving emergency information...');
    await new Promise(r => setTimeout(r, 800));
    setOfflineStatus('Preparing offline assistant...');
    
    await offlineTripService.saveOffline(currentTrip);
    markOfflineReady();
    
    setIsSavingOffline(false);
    setOfflineStatus('✓ Journey saved offline');
    setTimeout(() => setOfflineStatus(''), 3000);
  };

  const handleReplaceActivity = async (dayIndex, actIndex, activityId) => {
    setIsFindingAlt(true);
    const newActivity = await itineraryService.getAlternativeActivity(activityId, altPreference);
    
    const updatedTrip = { ...currentTrip };
    updatedTrip.days[dayIndex].activities[actIndex] = newActivity;
    saveTrip(updatedTrip);
    
    setEditingActivity(null);
    setIsFindingAlt(false);
    setAltPreference('');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-blue)', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Your AI-Powered Journey
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{currentTrip.duration} {currentTrip.destination} Adventure</h1>
          <p style={{ color: 'var(--color-gray-600)', maxWidth: '600px' }}>
            Built around your interests in {currentTrip.style}, and {currentTrip.discovery} experiences.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm"><Edit2 size={16} /> Edit</Button>
          <Button variant="outline" size="sm"><Share2 size={16} /> Share</Button>
          <Button variant="primary" size="sm" onClick={handleSaveOffline} disabled={isSavingOffline}>
            <Download size={16} /> Save Offline
          </Button>
        </div>
      </div>

      {offlineStatus && (
        <Card style={{ backgroundColor: 'var(--color-blue-bg)', borderColor: 'var(--color-blue-light)', marginBottom: '2rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isSavingOffline ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--color-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Check color="var(--color-green)" size={20} />}
          <span style={{ fontWeight: 500 }}>{offlineStatus}</span>
        </Card>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Clock size={14} /> DURATION
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currentTrip.duration}</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <DollarSign size={14} /> BUDGET
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currentTrip.budget}</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Activity size={14} /> STYLE
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currentTrip.style}</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <MapPin size={14} /> DISCOVERY
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currentTrip.discovery}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Main Itinerary */}
        <div style={{ gridColumn: '1 / -1' }}>
          {currentTrip.days.map((day, dIdx) => (
            <div key={dIdx} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ backgroundColor: 'var(--color-navy)', color: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                    {day.day}
                  </span>
                  {day.title}
                </h2>
                <Button variant="ghost" size="sm" style={{ color: 'var(--color-blue)' }}>
                  <RefreshCw size={14} /> Regenerate Day
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {/* Connecting line */}
                <div style={{ position: 'absolute', left: '1.25rem', top: '1.5rem', bottom: '1.5rem', width: '2px', backgroundColor: 'var(--color-gray-200)', zIndex: 0 }}></div>

                {day.activities.map((act, aIdx) => (
                  <div key={act.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '4rem', flexShrink: 0, textAlign: 'right', paddingTop: '1.5rem', fontWeight: 600, color: 'var(--color-gray-500)' }}>
                      {act.time}
                    </div>
                    <Card style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{act.name}</h4>
                          <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '1rem' }}>{act.description}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {act.tags.map(t => <Badge key={t} variant="gray">{t}</Badge>)}
                            <Badge variant={act.crowd === 'Low' || act.crowd === 'Very Low' ? 'green' : 'gray'}>Crowd: {act.crowd}</Badge>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-green)' }}>{act.cost}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{act.travelTime}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-gray-100)', paddingTop: '1rem' }}>
                        <Button variant="ghost" size="sm" onClick={() => setEditingActivity({dIdx, aIdx, act})}>Replace</Button>
                      </div>

                      {/* Editing Modal Inline */}
                      {editingActivity?.act.id === act.id && (
                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h5 style={{ fontWeight: 600 }}>What would you prefer?</h5>
                            <button onClick={() => setEditingActivity(null)}><X size={16} /></button>
                          </div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {['🌿 More nature', '🤫 Less crowded', '💰 Cheaper', '🍜 More local food'].map(opt => (
                              <Badge 
                                key={opt} 
                                variant={altPreference === opt ? 'blue' : 'gray'} 
                                onClick={() => setAltPreference(opt)}
                                style={{ cursor: 'pointer' }}
                              >
                                {opt}
                              </Badge>
                            ))}
                          </div>
                          
                          <textarea 
                            className="form-input" 
                            placeholder="Tell AI what you'd like instead..."
                            rows="2"
                            value={altPreference}
                            onChange={(e) => setAltPreference(e.target.value)}
                            style={{ marginBottom: '1rem' }}
                          />
                          
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleReplaceActivity(dIdx, aIdx, act.id)}
                            disabled={isFindingAlt}
                          >
                            {isFindingAlt ? 'Finding match...' : 'Find Alternative ✨'}
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Groups */}
      <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--color-gray-200)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Want to make this journey social?</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Find travelers with similar plans and interests.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {mockTravelGroups.map(group => (
            <Card key={group.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)' }}>GROUP {group.id.toUpperCase()}</span>
                <Badge variant="blue">{group.match}% match</Badge>
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{group.title}</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {group.travelers} travelers</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {group.date}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {group.tags.map(t => <Badge key={t} variant="gray">{t}</Badge>)}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" fullWidth>View Group</Button>
                <Button variant="primary" size="sm" fullWidth>Request to Join</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
};

export default ItineraryResultPage;
