import React, { useState, useEffect } from 'react';
import { ShieldAlert, SignalZero, Wifi, MapPin, Phone, RefreshCw, Check, AlertTriangle, Radio, Send, HeartPulse, UserCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { sosService } from '../../services/sosService';
import { mockEmergencyContacts } from '../../data/mockData';
import { useTrip } from '../../context/TripContext';

const SOSPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [sosStatus, setSosStatus] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  const { currentTrip } = useTrip();

  const activationSteps = [
    { label: 'Accessing GPS Coordinates...', icon: MapPin },
    { label: 'Packaging Emergency & Medical Payload...', icon: HeartPulse },
    { label: 'Broadcasting to Nepal Tourist Police (1144)...', icon: Radio },
    { label: 'Notifying Himalayan Rescue & Emergency Contacts...', icon: Send }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check local storage for existing SOS
    const existing = sosService.getSOSStatus();
    if (existing) {
      setSosStatus(existing);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate sync when connection returns
  useEffect(() => {
    if (isOnline && sosStatus?.queued) {
      const timer = setTimeout(() => {
        setSosStatus(prev => ({ ...prev, queued: false, synced: true }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, sosStatus]);

  const handleActivateSOS = async () => {
    setIsActivating(true);
    setActivationStep(0);

    // Step-by-step progress simulation
    for (let i = 0; i < activationSteps.length; i++) {
      setActivationStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const location = currentTrip?.destination || 'Pokhara Valley, Nepal (28.2096° N, 83.9856° E)';
    const result = await sosService.activateSOS(location);
    setSosStatus(result);
    setIsActivating(false);
    setShowModal(false);
  };

  const handleCancelSOS = () => {
    localStorage.removeItem('yatrax_sos_status');
    setSosStatus(null);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark-text)', margin: 0 }}>
                YatraX Emergency SOS
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                Instant Emergency Beacon & Nepal Dispatch Network
              </span>
            </div>
          </div>
        </div>
        
        <Badge variant={isOnline ? 'green' : 'red'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          {isOnline ? <Wifi size={16} /> : <SignalZero size={16} />}
          {isOnline ? 'Online • Live Dispatch' : 'Offline Mode • Queued SOS'}
        </Badge>
      </div>

      {/* Demo Notice */}
      <div style={{ backgroundColor: 'var(--color-light-mint)', border: '1px solid var(--color-mint)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={20} color="var(--color-dark-green)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--color-dark-green)' }}>
          <strong>Frontend Demonstration:</strong> Activating SOS here simulates real-time location capture, encrypted payload generation, offline queueing, and dispatch notifications.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Main SOS Trigger & Status Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card style={{ 
            backgroundColor: sosStatus ? (sosStatus.queued ? '#FFFBEB' : '#ECFDF5') : '#FEF2F2', 
            borderColor: sosStatus ? (sosStatus.queued ? '#FCD34D' : '#A7F3D0') : '#FCA5A5', 
            textAlign: 'center', 
            padding: '3rem 2rem' 
          }}>
            {sosStatus ? (
              <div className="animate-fade-in">
                {sosStatus.queued ? (
                  <>
                    <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#FEF3C7', borderRadius: '50%', color: '#D97706', marginBottom: '1.5rem' }}>
                      <RefreshCw size={52} style={{ animation: 'spin 3s linear infinite' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#B45309', marginBottom: '0.5rem' }}>
                      🚨 SOS QUEUED (OFFLINE)
                    </h2>
                    <p style={{ color: '#92400E', maxWidth: '360px', margin: '0 auto 1.5rem', lineHeight: 1.5, fontSize: '0.925rem' }}>
                      Your emergency payload is safely stored on your device and will be transmitted to Nepal Tourist Police as soon as internet connection is restored.
                    </p>
                    <div style={{ backgroundColor: 'white', padding: '0.875rem', borderRadius: 'var(--radius-md)', margin: '0 auto 1.5rem', maxWidth: '320px', border: '1px solid #FDE68A', fontSize: '0.85rem', textAlign: 'left' }}>
                      <div><strong>Location:</strong> {sosStatus.location}</div>
                      <div><strong>Timestamp:</strong> {new Date(sosStatus.timestamp).toLocaleTimeString()}</div>
                      <div><strong>Status:</strong> Awaiting Network Connectivity</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#D1FAE5', borderRadius: '50%', color: 'var(--color-primary-green)', marginBottom: '1.5rem' }}>
                      <Check size={52} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
                      ✅ EMERGENCY SOS BROADCASTED
                    </h2>
                    <p style={{ color: 'var(--color-secondary-text)', maxWidth: '360px', margin: '0 auto 1.5rem', lineHeight: 1.5, fontSize: '0.925rem' }}>
                      Emergency services, Tourist Police Nepal, and your personal emergency contacts have been notified with your live coordinates.
                    </p>
                    
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0 auto 1.5rem', maxWidth: '340px', border: '1px solid var(--color-mint)', fontSize: '0.85rem', textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-green)', marginBottom: '0.5rem', borderBottom: '1px solid var(--color-light-mint)', paddingBottom: '0.25rem' }}>
                        Dispatch Confirmation #YATRAX-98412
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Target Location:</span>
                        <strong>{currentTrip?.destination || 'Pokhara'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Tourist Police 1144:</span>
                        <strong style={{ color: 'var(--color-primary-green)' }}>Notified</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Primary Contact:</span>
                        <strong style={{ color: 'var(--color-primary-green)' }}>SMS Sent</strong>
                      </div>
                    </div>
                  </>
                )}

                <Button variant="outline" onClick={handleCancelSOS} style={{ marginTop: '0.5rem' }}>
                  Mark Safe / Clear Emergency Status
                </Button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowModal(true)}
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: '#DC2626',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    border: '8px solid #FCA5A5',
                    boxShadow: '0 10px 30px -5px rgba(220, 38, 38, 0.6), 0 0 0 15px rgba(220, 38, 38, 0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, boxShadow 0.15s ease',
                    margin: '0 auto 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <ShieldAlert size={36} />
                  <span>ACTIVATE SOS</span>
                </button>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#991B1B', marginBottom: '0.25rem' }}>
                  One-Tap Emergency Dispatch
                </h3>
                <p style={{ color: '#7F1D1D', fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                  Press to instantly send coordinates and medical profile to Nepal emergency teams.
                </p>
              </>
            )}
          </Card>

          {/* Location & GPS Info Card */}
          <Card>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--color-dark-text)' }}>
              <MapPin size={20} color="var(--color-primary-green)" />
              Active Location & Tracking
            </h3>
            
            <div style={{ backgroundColor: 'var(--color-very-light-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--color-secondary-text)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                CURRENT DESTINATION / REGION
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-dark-text)' }}>
                {currentTrip?.destination || 'Pokhara Valley, Nepal'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)', marginTop: '0.25rem' }}>
                GPS: 28.2096° N, 83.9856° E • Altitude: 822m
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', border: '1px dashed var(--color-mint)', backgroundColor: 'var(--color-light-mint)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} color="var(--color-dark-green)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-dark-green)', fontWeight: 500 }}>
                  Medical & Identity Profile Loaded
                </span>
              </div>
              <Badge variant="green" style={{ fontSize: '0.75rem' }}>Ready</Badge>
            </div>
          </Card>

        </div>

        {/* Emergency Contacts List Column */}
        <div>
          <Card>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark-text)', margin: 0 }}>
                Nepal Emergency Helplines
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginTop: '0.25rem' }}>
                Direct dial options for immediate assistance across Nepal.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockEmergencyContacts.map((contact, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'space-between', 
                    padding: '1rem', 
                    border: '1px solid var(--color-gray-200)', 
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                    <div style={{ 
                      width: '2.75rem', 
                      height: '2.75rem', 
                      backgroundColor: 'var(--color-light-mint)', 
                      borderRadius: 'var(--radius-md)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center', 
                      color: 'var(--color-dark-green)',
                      flexShrink: 0
                    }}>
                      <Phone size={18} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-dark-text)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {contact.name}
                      </div>
                      <div style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.9rem' }}>
                        {contact.number}
                      </div>
                      {contact.description && (
                        <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.775rem', marginTop: '0.15rem' }}>
                          {contact.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <a href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`} style={{ textDecoration: 'none', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.875rem' }}>
                      <Phone size={14} /> Call
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 91, 76, 0.65)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '440px', width: '100%', padding: '2rem', border: '2px solid #FCA5A5' }} className="animate-fade-in">
            
            {!isActivating ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                    <ShieldAlert size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#991B1B', margin: 0 }}>
                      Confirm Emergency SOS
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#B91C1C' }}>Action cannot be undone</span>
                  </div>
                </div>

                <p style={{ color: 'var(--color-dark-text)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Are you sure you want to activate Emergency SOS? This will package your live GPS coordinates, medical info, and broadcast to Tourist Police Nepal (1144).
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleActivateSOS} 
                    fullWidth 
                    style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', color: 'white' }}
                  >
                    Yes, Activate SOS
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#DC2626', marginBottom: '1.25rem' }}>
                  <Radio size={40} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark-text)', marginBottom: '0.75rem' }}>
                  Dispatching YatraX Emergency SOS...
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', textAlign: 'left', backgroundColor: 'var(--color-very-light-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  {activationSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx < activationStep;
                    const isCurrent = idx === activationStep;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: isDone ? 'var(--color-primary-green)' : (isCurrent ? 'var(--color-dark-text)' : 'var(--color-secondary-text)'), fontWeight: isCurrent ? 600 : 400 }}>
                        {isDone ? (
                          <Check size={16} color="var(--color-primary-green)" />
                        ) : isCurrent ? (
                          <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-dark-green)" />
                        ) : (
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--color-gray-300)' }} />
                        )}
                        <span>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </Card>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
      `}} />
    </div>
  );
};

export default SOSPage;

