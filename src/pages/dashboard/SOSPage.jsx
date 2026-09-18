import React, { useState, useEffect } from 'react';
import { ShieldAlert, SignalZero, Wifi, MapPin, Phone, ArrowLeft, RefreshCw, Check } from 'lucide-react';
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
  const { currentTrip } = useTrip();

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
      setTimeout(() => {
        setSosStatus(prev => ({ ...prev, queued: false, synced: true }));
      }, 2000);
    }
  }, [isOnline, sosStatus]);

  const handleActivateSOS = async () => {
    setIsActivating(true);
    const location = currentTrip?.destination || 'Unknown Location';
    const result = await sosService.activateSOS(location);
    setSosStatus(result);
    setIsActivating(false);
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--color-red)' }}>
            <ShieldAlert size={28} /> Emergency Assistance
          </h1>
          <p style={{ color: 'var(--color-gray-600)' }}>Quick access to emergency information when you need it.</p>
        </div>
        
        <Badge variant={isOnline ? 'green' : 'red'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          {isOnline ? <Wifi size={14} /> : <SignalZero size={14} />}
          {isOnline ? 'Connected' : 'Offline'}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* SOS Action Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ backgroundColor: 'var(--color-red-bg)', borderColor: '#FCA5A5', textAlign: 'center', padding: '4rem 2rem' }}>
            {sosStatus ? (
              <div className="animate-fade-in">
                {sosStatus.queued ? (
                  <>
                    <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#FEE2E2', borderRadius: '50%', color: 'var(--color-red)', marginBottom: '1.5rem' }}>
                      <RefreshCw size={48} style={{ animation: 'spin 3s linear infinite' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--color-red)', marginBottom: '0.5rem' }}>🚨 SOS QUEUED</h2>
                    <p style={{ color: '#991B1B', maxWidth: '300px', margin: '0 auto' }}>
                      Your emergency request has been stored locally and will be synchronized when connectivity returns.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#DCFCE7', borderRadius: '50%', color: 'var(--color-green)', marginBottom: '1.5rem' }}>
                      <Check size={48} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--color-green)', marginBottom: '0.5rem' }}>SOS SYNCHRONIZED</h2>
                    <p style={{ color: 'var(--color-gray-600)', maxWidth: '300px', margin: '0 auto 2rem' }}>
                      Your emergency request and location have been transmitted successfully.
                    </p>
                    <Button variant="outline" onClick={() => { localStorage.removeItem('treksafe_sos_status'); setSosStatus(null); }}>Clear Status</Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowModal(true)}
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-red)',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    border: '8px solid #FCA5A5',
                    boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.5), 0 0 0 15px rgba(220, 38, 38, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    margin: '0 auto 2rem'
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ACTIVATE SOS
                </button>
                <p style={{ color: '#991B1B', fontSize: '0.875rem', fontWeight: 500 }}>Use only in case of a genuine emergency.</p>
              </>
            )}
          </Card>

          <Card>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MapPin size={18} color="var(--color-blue)" /> Location Information
            </h3>
            <div style={{ backgroundColor: 'var(--color-gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>LAST KNOWN TRIP LOCATION</div>
              <div style={{ fontWeight: 500 }}>{currentTrip?.destination || 'No trip data available'}</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px dashed var(--color-gray-300)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Location permission required for precise tracking</span>
              <Button size="sm" variant="outline">Share Location</Button>
            </div>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Emergency Contacts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockEmergencyContacts.map((contact, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)' }}>
                      <Phone size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{contact.name}</div>
                      <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>{contact.number}</div>
                    </div>
                  </div>
                  <a href={`tel:${contact.number}`}>
                    <Button variant="outline" size="sm">Call</Button>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '400px', width: '100%', padding: '2rem' }} className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} /> Are you sure you want to activate SOS?
            </h3>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
              Your current location and emergency status will be prepared for transmission.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} fullWidth disabled={isActivating}>Cancel</Button>
              <Button variant="danger" onClick={handleActivateSOS} fullWidth disabled={isActivating}>
                {isActivating ? 'Activating...' : 'Activate SOS'}
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
};

export default SOSPage;
