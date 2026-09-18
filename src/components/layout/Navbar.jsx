import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <img src="/assets/logo.png" alt="YatraX Logo" className="navbar-logo-img" style={{ height: '2rem', width: 'auto', borderRadius: '4px' }} />
          <span className="navbar-name" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--color-dark-green)' }}>YatraX</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#explore" className="nav-link">Explore</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        <button className="mobile-menu-btn" aria-label="Toggle menu">
          <Menu />
        </button>
      </div>
    </nav>
  );
};
