import React, { useState } from 'react';
import { X, MapPin, Calendar, Compass, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const DestinationModal = ({ destination, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!destination) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 46, 33, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-hover)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image banner */}
        <div style={{ position: 'relative', height: '240px', width: '100%' }}>
          <img 
            src={destination.image} 
            alt={destination.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to top, rgba(27,77,62,0.85) 0%, transparent 60%)' 
            }} 
          />
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--color-dark-green)',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              border: 'none',
              boxShadow: 'var(--shadow-md)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', color: 'white' }}>
            <span style={{ 
              backgroundColor: 'var(--color-primary-green)', 
              color: 'white', 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {destination.tagline || 'Must-Visit Destination'}
            </span>
            <h2 style={{ color: 'white', fontSize: '2.25rem', marginTop: '0.25rem' }}>{destination.name}</h2>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          backgroundColor: 'var(--color-light-mint)', 
          padding: '1rem 1.5rem',
          gap: '1rem',
          borderBottom: '1px solid var(--color-gray-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <MapPin size={18} color="var(--color-primary-green)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 600 }}>Region</div>
              <div style={{ fontWeight: 600, color: 'var(--color-dark-text)' }}>{destination.region || 'Nepal'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Calendar size={18} color="var(--color-primary-green)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 600 }}>Best Time</div>
              <div style={{ fontWeight: 600, color: 'var(--color-dark-text)' }}>{destination.bestTime || 'Oct - May'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Compass size={18} color="var(--color-primary-green)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 600 }}>Vibe</div>
              <div style={{ fontWeight: 600, color: 'var(--color-dark-text)' }}>{destination.vibe || 'Scenic & Cultural'}</div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-gray-200)', padding: '0 1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sights', label: 'Top Sights' },
            { id: 'safety', label: 'Safety & Prep' },
            { id: 'culture', label: 'Local Etiquette' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.25rem',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary-green)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--color-primary-green)' : 'var(--color-secondary-text)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>About {destination.name}</h3>
              <p style={{ marginBottom: '1.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {destination.description}
              </p>
              
              <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-green)' }}>
                  <Info size={16} color="var(--color-primary-green)" /> Why Visit {destination.name}?
                </h4>
                <p style={{ fontSize: '0.9rem' }}>
                  {destination.whyVisit || `${destination.name} offers a unique blend of majestic Himalayan scenery, deep-rooted cultural heritage, and warm Nepalese hospitality.`}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sights' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark-green)' }}>Top Attractions & Experiences</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {(destination.attractions || [
                  'Historic Stupas & Temples',
                  'Panoramic Mountain Viewpoints',
                  'Local Artisan Markets & Cuisine',
                  'Scenic Nature Trails'
                ]).map((attraction, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.75rem', 
                      padding: '0.85rem', 
                      backgroundColor: 'var(--color-light-mint)', 
                      borderRadius: 'var(--radius-sm)' 
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--color-primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark-text)' }}>{attraction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--color-primary-green)" /> Travel & Safety Tips for {destination.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ padding: '0.9rem 1.1rem', backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-green)' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark-green)', marginBottom: '0.2rem' }}>Altitude & Hydration</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Acclimatize properly, avoid rushing uphill, and carry at least 2L of purified drinking water daily.</p>
                </div>
                <div style={{ padding: '0.9rem 1.1rem', backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-green)' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark-green)', marginBottom: '0.2rem' }}>Currency & Cash</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Carry sufficient Nepalese Rupees (NPR) in small bills. Digital payments and ATMs can be unavailable in remote zones.</p>
                </div>
                <div style={{ padding: '0.9rem 1.1rem', backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-green)' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark-green)', marginBottom: '0.2rem' }}>Permits & Permits</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Check if TIMS card or National Park conservation permits are required before setting out.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'culture' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark-green)' }}>Cultural Respect & Local Customs</h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                <li><strong>Greeting:</strong> Greet locals with "Namaste" with palms pressed together at chest height.</li>
                <li><strong>Sacred Monasteries & Temples:</strong> Walk clockwise around chortens, stupas, and mani walls.</li>
                <li><strong>Footwear Etiquette:</strong> Remove shoes before entering temples, shrines, or private homes.</li>
                <li><strong>Photography:</strong> Ask before taking photos of local elders, monks, or religious rituals.</li>
                <li><strong>Eco-conscious Travel:</strong> Leave no trace on trails. Carry out all non-biodegradable waste.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--color-light-mint)', borderTop: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => { onClose(); window.location.href = '/signup'; }}>Plan Trip Here</Button>
        </div>
      </div>
    </div>
  );
};
