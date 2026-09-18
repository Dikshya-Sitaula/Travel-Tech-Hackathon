import React from 'react';
import { Link } from 'react-router-dom';
import { Map, SignalZero, Camera, ShieldAlert, ArrowRight, Compass } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const { currentTrip, isOfflineReady } = useTrip();

  return (
    <div>
      {/* Welcome Banner */}
      <Card style={{ background: 'linear-gradient(135deg, var(--color-navy), var(--color-blue))', color: 'white', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--color-green-light)' }}>
              <Mountain size={16} /> Journey Ready
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>Plan your next adventure with TrekSafe.</h2>
            <p style={{ opacity: 0.9, maxWidth: '500px' }}>Create a personalized itinerary, save it offline, and explore with confidence.</p>
          </div>
          <Link to="/dashboard/planner">
            <Button style={{ backgroundColor: 'white', color: 'var(--color-navy)' }}>
              Plan a Trip <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Card>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Hi, {user?.name || 'Dikshya'}! 👋</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Where will your next journey take you?</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>CURRENT TRIP</div>
          {currentTrip ? (
            <>
              <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currentTrip.destination}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>{currentTrip.duration}</div>
              <Link to="/dashboard/planner/result"><Button size="sm" variant="outline" fullWidth>View Details</Button></Link>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>No trip planned</div>
              <Link to="/dashboard/planner"><Button size="sm" variant="outline" fullWidth>Create Trip</Button></Link>
            </>
          )}
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>TRIP PROGRESS</div>
          <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>Not started</div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-gray-200)', borderRadius: '3px', marginTop: '1rem' }}>
            <div style={{ width: '0%', height: '100%', backgroundColor: 'var(--color-blue)', borderRadius: '3px' }}></div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>CONNECTIVITY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-green)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></div> Online
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: '0.25rem' }}>All services available</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>SAFETY STATUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.125rem' }}>
            <span style={{ color: 'var(--color-green)' }}>✓</span> Ready
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: '0.25rem' }}>Emergency info available</div>
        </Card>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Travel Toolkit</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-blue-bg)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Map size={20} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>AI Trip Planner</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Build a personalized journey based on your travel style.</p>
          <Link to="/dashboard/planner"><Button variant="primary" fullWidth>Plan a Trip <ArrowRight size={16} /></Button></Link>
        </Card>

        <Card>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-green-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <SignalZero size={20} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Offline AI Assistant</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Get essential travel guidance even without connectivity.</p>
          <Link to="/dashboard/offline"><Button variant="outline" fullWidth>Open Assistant <ArrowRight size={16} /></Button></Link>
        </Card>

        <Card>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-orange-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Camera size={20} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Landmark Explorer</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Identify landmarks and discover their stories.</p>
          <Link to="/dashboard/landmarks"><Button variant="outline" fullWidth>Scan Landmark <ArrowRight size={16} /></Button></Link>
        </Card>

        <Card>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldAlert size={20} />
          </div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>SOS & Emergency</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Access emergency information and SOS assistance.</p>
          <Link to="/dashboard/sos"><Button variant="outline" fullWidth style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>Open Emergency <ArrowRight size={16} /></Button></Link>
        </Card>
      </div>

      {!currentTrip && (
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-lg)' }}>
          <Compass size={40} color="var(--color-gray-400)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your next adventure is waiting.</h3>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Create your first AI-powered itinerary.</p>
          <Link to="/dashboard/planner"><Button variant="primary">Create Trip <ArrowRight size={16} /></Button></Link>
        </div>
      )}
    </div>
  );
};

// Add Mountain icon that was missed in imports
import { Mountain } from 'lucide-react';
export default DashboardHome;
