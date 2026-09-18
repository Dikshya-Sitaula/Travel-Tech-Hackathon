import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, RefreshCw, MapPin, Clock, DollarSign, Activity, Users, Check, Sparkles, Compass, Lightbulb, Bookmark } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useTrip } from '../../context/TripContext';
import { offlineTripService } from '../../services/offlineTripService';
import { generateItinerary } from '../../services/api';

const ItineraryResultPage = () => {
  const { currentTrip, saveTrip, markOfflineReady, preferences } = useTrip();
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!currentTrip) {
    return (
      <div className="animate-fade-in text-center" style={{ padding: '4rem 2rem' }}>
        <Compass size={48} color="var(--color-primary-green)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>No itinerary found</h2>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem' }}>Use the AI Trip Planner to build your custom Nepal journey.</p>
        <Button onClick={() => navigate('/trip-planner')} variant="primary">Plan My Trip</Button>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveJourney = async () => {
    setIsSaving(true);
    await offlineTripService.saveOffline(currentTrip);
    markOfflineReady();
    setIsSaving(false);
    showToast('✓ Journey saved successfully to local memory & offline storage!');
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const newTrip = await generateItinerary(preferences || { destination: currentTrip.destination });
    saveTrip(newTrip);
    setIsRegenerating(false);
    showToast('✨ YatraX generated a fresh variation of your itinerary!');
  };

  const handleShare = () => {
    const shareText = `Check out my AI-planned Nepal trip to ${currentTrip.destination} on YatraX! 🇳🇵✨`;
    if (navigator.share) {
      navigator.share({
        title: `${currentTrip.destination} Itinerary — YatraX`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      showToast('📋 Share link & itinerary summary copied to clipboard!');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <Card style={{ 
          backgroundColor: 'var(--color-light-mint)', 
          borderColor: 'var(--color-mint-green)', 
          color: 'var(--color-dark-green)',
          marginBottom: '1.5rem', 
          padding: '0.85rem 1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600
        }}>
          <Check size={20} color="var(--color-primary-green)" />
          <span>{toastMessage}</span>
        </Card>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-green)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> Personalized AI Itinerary
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>Your Personalized Nepal Journey</h1>
          <p style={{ color: 'var(--color-secondary-text)', maxWidth: '650px' }}>
            Tailored specifically for {currentTrip.destination} based on your unique travel style and preferences.
          </p>
        </div>
        
        {/* Action Buttons: Save, Regenerate, Share */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={handleSaveJourney} disabled={isSaving}>
            <Bookmark size={16} /> {isSaving ? 'Saving...' : 'Save Journey'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
            <RefreshCw size={16} className={isRegenerating ? 'spin-icon' : ''} /> {isRegenerating ? 'Generating...' : 'Regenerate'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleShare}>
            <Share2 size={16} /> Share
          </Button>
        </div>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <MapPin size={14} color="var(--color-primary-green)" /> DESTINATION
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-text)' }}>{currentTrip.destination}</div>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Clock size={14} color="var(--color-primary-green)" /> DURATION
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-text)' }}>{currentTrip.duration}</div>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <DollarSign size={14} color="var(--color-primary-green)" /> BUDGET
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-text)' }}>{currentTrip.budget}</div>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Activity size={14} color="var(--color-primary-green)" /> TRAVEL STYLE
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark-text)' }}>{currentTrip.style}</div>
        </Card>
      </div>

      {/* Why YatraX chose these places */}
      <Card style={{ backgroundColor: 'var(--color-light-mint)', borderColor: 'var(--color-mint-green)', marginBottom: '2.5rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          <Lightbulb size={20} color="var(--color-primary-green)" /> Why YatraX chose these places
        </div>
        <p style={{ color: 'var(--color-dark-text)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          This itinerary was dynamically crafted based on your selected interests in <strong>{currentTrip.style}</strong>, your <strong>{currentTrip.budget}</strong> budget target, your preferred <strong>{currentTrip.pace || 'Balanced'}</strong> travel pace, and your discovery goal for <strong>{currentTrip.discovery}</strong>.
        </p>
      </Card>

      {/* Daily Itinerary Cards */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Daily Plan</h2>

        {currentTrip.days.map((day, dIdx) => (
          <div key={dIdx} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ 
                backgroundColor: 'var(--color-dark-green)', 
                color: 'white', 
                width: '2.25rem', 
                height: '2.25rem', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700, 
                fontSize: '0.95rem' 
              }}>
                {day.day}
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-dark-text)', fontFamily: 'var(--font-heading)' }}>Day {day.day} — {day.title}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--color-mint-green)', marginLeft: '1rem' }}>
              {day.activities.map((act) => (
                <Card key={act.id} style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {act.time}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--color-dark-text)' }}>{act.name}</h4>
                      </div>
                      <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {act.description}
                      </p>

                      {/* Why YatraX Recommends It */}
                      <div style={{ backgroundColor: 'var(--color-very-light-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary-green)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--color-dark-green)' }}>Why YatraX recommends it: </strong> 
                        Curated for photography, scenic immersion, and matching your travel style.
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {act.tags.map(t => <Badge key={t} variant="gray">{t}</Badge>)}
                        <Badge variant={act.crowd === 'Low' || act.crowd === 'Very Low' ? 'green' : 'gray'}>Crowd: {act.crowd}</Badge>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary-green)', fontSize: '0.95rem' }}>{act.cost}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {act.travelTime}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
};

export default ItineraryResultPage;
