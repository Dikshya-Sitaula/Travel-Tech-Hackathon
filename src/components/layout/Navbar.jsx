import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Mountain className="navbar-logo" />
          <span className="navbar-name">TrekSafe</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        <button className="mobile-menu-btn">
          <Menu />
        </button>
      </div>
    </nav>
  );
};
