import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: 'var(--color-dark-green)', color: 'white', padding: '4rem 0' }}>
      <div className="container footer-content">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src="/assets/logo.png" alt="YatraX Logo" style={{ height: '2.25rem', width: 'auto', borderRadius: '4px', backgroundColor: 'white', padding: '2px' }} />
            <h3 className="footer-logo" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'white' }}>YatraX</h3>
          </div>
          <p style={{ color: 'var(--color-light-mint)', opacity: 0.9 }}>AI-powered smart tourism and travel safety platform for Nepal.</p>
        </div>
        
        <div className="footer-links">
          <Link to="/">Home</Link>
          <a href="#explore">Explore</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Get Started</Link>
        </div>
      </div>
    </footer>
  );
};
