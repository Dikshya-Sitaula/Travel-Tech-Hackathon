import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      style={{ 
        backgroundColor: 'var(--color-dark-green)', 
        color: 'white', 
        padding: '5rem 0 2.5rem',
        borderTop: '1px solid var(--color-forest-accent)'
      }}
    >
      <div className="container">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '3rem', 
            marginBottom: '4rem' 
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <img 
                src="/assets/logo.png" 
                alt="YatraX Logo" 
                style={{ 
                  height: '2.8rem', 
                  width: 'auto', 
                  objectFit: 'contain',
                  backgroundColor: 'white',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)'
                }} 
              />
            </Link>
            <p style={{ color: 'var(--color-light-mint)', opacity: 0.9, fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              YatraX helps travelers discover Nepal with smarter travel guidance, safety-focused information, personalized recommendations, and an AI travel companion.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Youtube, label: 'YouTube' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.label}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-green)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* EXPLORE Column */}
          <div>
            <h4 style={{ color: 'var(--color-mint-green)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <li><Link to="/" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Destinations</Link></li>
              <li><Link to="/" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Travel Guidance</Link></li>
              <li><Link to="/" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Safety</Link></li>
              <li><Link to="/" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>AI Assistant</Link></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 style={{ color: 'var(--color-mint-green)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <li><Link to="/about" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Contact</Link></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Terms</a></li>
            </ul>
          </div>

          {/* SUPPORT Column */}
          <div>
            <h4 style={{ color: 'var(--color-mint-green)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Help Center</a></li>
              <li><Link to="/contact" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>FAQs</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            paddingTop: '2rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: 'var(--color-light-mint)',
            opacity: 0.8
          }}
        >
          <div>© 2026 YatraX. All rights reserved.</div>
          <div>Made with care for Nepal travelers.</div>
        </div>
      </div>
    </footer>
  );
};
