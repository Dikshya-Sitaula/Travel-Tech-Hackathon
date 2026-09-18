import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;
  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  };

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-gray-200)',
      boxShadow: '0 2px 12px rgba(27,77,62,0.03)'
    }}>
      <div className="container navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        
        {/* Left: YatraX Logo */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img 
            src="/assets/logo.png" 
            alt="YatraX Logo" 
            style={{ 
              height: '2.6rem', 
              width: 'auto', 
              objectFit: 'contain'
            }} 
          />
        </Link>
        
        {/* Center Navigation: Home, About Us, Contact ONLY */}
        <div className="navbar-links" style={{ display: 'flex', gap: '2.25rem' }}>
          <Link 
            to="/" 
            className="nav-link"
            style={{
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? 'var(--color-primary-green)' : 'var(--color-secondary-text)',
              fontSize: '0.975rem',
              borderBottom: isActive('/') ? '2px solid var(--color-primary-green)' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="nav-link"
            style={{
              fontWeight: isActive('/about') ? 700 : 500,
              color: isActive('/about') ? 'var(--color-primary-green)' : 'var(--color-secondary-text)',
              fontSize: '0.975rem',
              borderBottom: isActive('/about') ? '2px solid var(--color-primary-green)' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="nav-link"
            style={{
              fontWeight: isActive('/contact') ? 700 : 500,
              color: isActive('/contact') ? 'var(--color-primary-green)' : 'var(--color-secondary-text)',
              fontSize: '0.975rem',
              borderBottom: isActive('/contact') ? '2px solid var(--color-primary-green)' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            Contact
          </Link>
        </div>

        {/* Right Actions: Sign In & Get Started */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {!isAuthenticated && (
            <Link 
              to="/login" 
              className="nav-link"
              style={{ 
                fontWeight: 600, 
                color: 'var(--color-dark-green)',
                fontSize: '0.95rem'
              }}
            >
              Sign In
            </Link>
          )}
          <Button variant="primary" onClick={handleGetStarted} style={{ padding: '0.65rem 1.4rem', borderRadius: 'var(--radius-full)' }}>
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-btn" 
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            padding: '0.5rem',
            color: 'var(--color-dark-green)',
            display: 'none',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-gray-200)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: isActive('/') ? 700 : 500, color: 'var(--color-dark-green)', fontSize: '1.1rem' }}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: isActive('/about') ? 700 : 500, color: 'var(--color-dark-green)', fontSize: '1.1rem' }}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: isActive('/contact') ? 700 : 500, color: 'var(--color-dark-green)', fontSize: '1.1rem' }}
          >
            Contact
          </Link>
          <hr style={{ borderColor: 'var(--color-gray-200)', margin: '0.25rem 0' }} />
          {!isAuthenticated && (
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, color: 'var(--color-primary-green)', fontSize: '1.1rem' }}
            >
              Sign In
            </Link>
          )}
          <Button variant="primary" fullWidth onClick={() => {
            setMobileMenuOpen(false);
            handleGetStarted();
          }}>
            Get Started
          </Button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .navbar-links, .navbar-actions { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}} />
    </nav>
  );
};
