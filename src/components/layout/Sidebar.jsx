import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Bot, 
  Camera, ShieldAlert, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/trip-planner', icon: Map, label: 'AI Trip Planner' },
    { path: '/assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/landmark-explorer', icon: Camera, label: 'Landmark Explorer' },
    { path: '/sos', icon: ShieldAlert, label: 'Emergency SOS' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 1.5rem' }}>
          <NavLink to="/">
            <img src="/assets/logo.png" alt="YatraX Logo" style={{ height: '2.2rem', width: 'auto', objectFit: 'contain', backgroundColor: 'white', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }} />
          </NavLink>
          {isOpen && (
            <button className="mobile-close-btn" onClick={() => setIsOpen(false)} style={{ marginLeft: 'auto', color: 'white' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Traveler'}</span>
              <span className="user-role">{user?.email || 'dikshya@yatrax.com'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
