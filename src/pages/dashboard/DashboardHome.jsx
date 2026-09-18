import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  ShieldCheck, 
  Bot, 
  Map, 
  Lightbulb, 
  User, 
  LogOut, 
  ArrowRight, 
  MapPin, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { DestinationModal } from '../../components/ui/DestinationModal';

export const DashboardHome = () => {
  const { user, logout } = useAuth();
  const { currentTrip } = useTrip();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sampleDestinations = [
    {
      id: 'pokhara',
      name: 'Pokhara',
      tagline: 'Lakes & Mountain Views',
      region: 'Gandaki',
      bestTime: 'Oct - May',
      vibe: 'Relaxation & Adventure',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      description: 'Pokhara offers peaceful Phewa Lake boating, dramatic Annapurna mountain backdrops, paragliding, and cozy lakeside dining.',
      whyVisit: 'Ideal for both peaceful nature retreats and high-adrenaline adventures.',
      attractions: ['Phewa Lake', 'Sarangkot Sunrise', 'World Peace Pagoda', 'Davis Falls']
    },
    {
      id: 'kathmandu',
      name: 'Kathmandu',
      tagline: 'Cultural Heritage Valley',
      region: 'Bagmati',
      bestTime: 'Oct - Apr',
      vibe: 'Historical & Spiritual',
      image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600&auto=format&fit=crop',
      description: 'Explore ancient UNESCO heritage stupas, Newari architecture, vibrant bazaars, and legendary mountain shrines.',
      whyVisit: 'Witness centuries of rich Nepalese history, art, and vibrant urban culture.',
      attractions: ['Boudhanath Stupa', 'Swayambhunath', 'Thamel Street Market', 'Pashupatinath']
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Dashboard Top Header */}
      <div 
        style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem', 
          marginBottom: '2.5rem',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-gray-200)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            <Sparkles size={16} /> Traveler Portal
          </div>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--color-dark-green)', margin: '0.2rem 0' }}>
            Welcome to YatraX, {user?.name || 'Traveler'}!
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', margin: 0, fontSize: '1rem' }}>
            Your personal hub for discovering Nepal, staying safe, and managing your trips.
          </p>
        </div>

        <Button 
          onClick={handleLogout} 
          variant="outline" 
          style={{ 
            borderColor: 'var(--color-red)', 
            color: 'var(--color-red)', 
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem'
          }}
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </div>

      {/* Main 5 Cards Grid */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--color-dark-green)' }}>
        Dashboard Overview
      </h2>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}
      >
        {/* Card 1: Explore Destinations */}
        <Card 
          hoverable 
          style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Explore Destinations</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Discover iconic valleys, Himalayan trekking routes, and cultural hotspots across Nepal.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedDestination(sampleDestinations[0])}
            style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
          >
            Explore Places <ArrowRight size={16} />
          </Button>
        </Card>

        {/* Card 2: Travel Safety */}
        <Card 
          hoverable 
          style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Travel Safety</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Access emergency contacts, mountain altitude advice, water safety rules, and trek prep tips.
            </p>
          </div>
          <Link to="/sos">
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              Safety & SOS <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>

        {/* Card 3: AI Travel Assistant */}
        <Card 
          hoverable 
          style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>AI Travel Assistant</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Ask travel questions, get packing lists, local etiquette tips, and real-time guidance.
            </p>
          </div>
          <Link to="/assistant">
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              Launch Chatbot <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>

        {/* Card 4: My Trip */}
        <Card 
          hoverable 
          style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Map size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>My Trip</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {currentTrip ? `Active: ${currentTrip.destination} (${currentTrip.duration})` : 'Create and view your custom day-by-day travel itineraries.'}
            </p>
          </div>
          <Link to="/trip-planner">
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              {currentTrip ? 'View Itinerary' : 'Plan New Trip'} <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>

        {/* Card 5: Travel Tips */}
        <Card 
          hoverable 
          style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Lightbulb size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Travel Tips</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Learn essential local etiquette, food highlights (Dal Bhat, Momos), cash requirements, and weather advice.
            </p>
          </div>
          <Link to="/about">
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              View Tips <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>
      </div>

      {/* User Profile Section */}
      <Card 
        style={{ 
          padding: '2rem', 
          borderRadius: 'var(--radius-xl)', 
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-gray-200)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{ 
                width: '4rem', 
                height: '4rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-primary-green)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {(user?.name || 'T')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-dark-green)', marginBottom: '0.2rem' }}>
                {user?.name || 'Demo Traveler'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', margin: 0 }}>
                Email: <strong>{user?.email || 'dikshya@yatrax.com'}</strong> • Role: <strong>{user?.role || 'Traveler'}</strong>
              </p>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
                  Demo Session Active
                </span>
                <span style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
                  Nepal Explorer
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            variant="outline"
            style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)', borderRadius: 'var(--radius-full)' }}
          >
            <LogOut size={16} /> Logout Session
          </Button>
        </div>
      </Card>

      {/* Destination Modal */}
      {selectedDestination && (
        <DestinationModal 
          destination={selectedDestination} 
          onClose={() => setSelectedDestination(null)} 
        />
      )}
    </div>
  );
};

export default DashboardHome;
