import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Mountain, LayoutDashboard, Map, SignalZero, 
  Camera, ShieldAlert, LogOut, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/dashboard/planner', icon: Map, label: 'Trip Planner' },
    { path: '/dashboard/offline', icon: SignalZero, label: 'Offline Assistant' },
    { path: '/dashboard/landmarks', icon: Camera, label: 'Landmark Explorer' },
    { path: '/dashboard/sos', icon: ShieldAlert, label: 'SOS & Emergency' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Mountain color="var(--color-green)" />
          TrekSafe
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
              <span className="user-name">{user?.name || 'Dikshya'}</span>
              <span className="user-role">{user?.role || 'Traveler'}</span>
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
