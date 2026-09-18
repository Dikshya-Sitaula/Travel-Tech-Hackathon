import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Bot, Camera, ShieldAlert, ArrowRight, Search, Sparkles, MapPin, Compass } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const { currentTrip } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/trip-planner', { state: { initialDestination: searchQuery } });
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
            Good morning, {user?.name || 'traveler'} 👋
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '1.05rem' }}>Ready to discover Nepal?</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '380px', position: 'relative' }}>
          <input 
            type="text"
            placeholder="Search Pokhara, Mustang, Trekking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 2.5rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--color-gray-300)',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <Search size={18} color="var(--color-secondary-text)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <Button type="submit" variant="primary" size="sm" style={{ borderRadius: 'var(--radius-full)', padding: '0 1rem' }}>Search</Button>
        </form>
      </div>

      {/* Main Featured Card — AI Trip Planner */}
      <Card style={{ 
        background: 'linear-gradient(135deg, var(--color-dark-green), var(--color-primary-green))', 
        color: 'white', 
        marginBottom: '2.5rem',
        padding: '2.25rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-2rem', bottom: '-2rem', opacity: 0.15, transform: 'rotate(15deg)' }}>
          <Compass size={220} color="white" />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', color: 'var(--color-cream)' }}>
            <Sparkles size={14} /> Featured AI Tool
          </div>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            AI Trip Planner
          </h2>
          <p style={{ opacity: 0.95, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-light-mint)', lineHeight: 1.5 }}>
            Plan your perfect Nepal journey with AI. Customize destination, budget, pace, travel style, and hidden gems in 5 easy steps.
          </p>
          <Link to="/trip-planner">
            <Button style={{ backgroundColor: 'var(--color-golden-yellow)', color: 'var(--color-dark-text)', fontWeight: 700, fontSize: '1rem', padding: '0.85rem 1.75rem' }}>
              Plan My Trip <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Actions Header */}
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Quick Actions</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Quick Action 1: AI Assistant */}
        <Link to="/assistant" style={{ textDecoration: 'none' }}>
          <Card style={{ 
            height: '100%', 
            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-text)' }}>AI Assistant</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Chat with your YatraX AI travel companion for instant advice, packing tips, and local guidance.
            </p>
            <div style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Open Chatbot <ArrowRight size={16} />
            </div>
          </Card>
        </Link>

        {/* Quick Action 2: Landmark Explorer */}
        <Link to="/landmark-explorer" style={{ textDecoration: 'none' }}>
          <Card style={{ 
            height: '100%', 
            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Camera size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-text)' }}>Landmark Explorer</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Identify Nepalese landmarks from an uploaded image and discover historical and entry details.
            </p>
            <div style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Scan Landmark <ArrowRight size={16} />
            </div>
          </Card>
        </Link>

        {/* Quick Action 3: Emergency SOS */}
        <Link to="/sos" style={{ textDecoration: 'none' }}>
          <Card style={{ 
            height: '100%', 
            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--color-red)'
          }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldAlert size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-text)' }}>Emergency SOS</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Quickly access emergency assistance, view emergency numbers, and trigger simulated SOS notifications.
            </p>
            <div style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Access Emergency SOS <ArrowRight size={16} />
            </div>
          </Card>
        </Link>
      </div>

      {/* Popular in Nepal */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)' }}>Popular in Nepal</h2>
          <Link to="/trip-planner" style={{ fontSize: '0.9rem', color: 'var(--color-primary-green)', fontWeight: 600 }}>Plan trip for these →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[
            { name: 'Pokhara', subtitle: 'Lakeside & Annapurna Views', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
            { name: 'Kathmandu', subtitle: 'Valley Temples & Culture', img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=400&auto=format&fit=crop' },
            { name: 'Chitwan', subtitle: 'Jungle Safari & Wildlife', img: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=400&auto=format&fit=crop' },
            { name: 'Everest Region', subtitle: 'Trekking & Sherpa Culture', img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=400&auto=format&fit=crop' },
            { name: 'Mustang', subtitle: 'Kingdom of Himalayan Desert', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop' },
          ].map((place) => (
            <Card key={place.name} style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} onClick={() => navigate('/trip-planner', { state: { initialDestination: place.name } })}>
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,91,76,0.85), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', right: '0.85rem', color: 'white' }}>
                  <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.15rem' }}>{place.name}</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {place.subtitle}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
