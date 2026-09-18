import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-dark-green)', fontFamily: 'var(--font-heading)' }}>
            <img src="/assets/logo.png" alt="YatraX Logo" style={{ height: '1.75rem', width: 'auto' }} /> YatraX
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--color-dark-green)' }} aria-label="Open navigation menu">
            <Menu />
          </button>
        </div>
        
        <div className="animate-fade-in" style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
