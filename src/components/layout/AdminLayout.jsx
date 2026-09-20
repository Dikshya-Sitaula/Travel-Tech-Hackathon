import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, RadioTower, Route } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-brand"><img src="/assets/logo.png" alt="YatraX" /><div><strong>YatraX Monitor</strong><span>Safety operations</span></div></div>
        <nav aria-label="Admin navigation">
          <NavLink to="/admin"><RadioTower size={17} /> SOS monitor</NavLink>
          <NavLink to="/dashboard"><Route size={17} /> Traveler app</NavLink>
        </nav>
        <div className="admin-account"><div><strong>{user?.name || 'Operator'}</strong><span>Admin session</span></div><button type="button" onClick={signOut} aria-label="Log out"><LogOut size={17} /></button></div>
      </header>
      <main className="admin-content"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
