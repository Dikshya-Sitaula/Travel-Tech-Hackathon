import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Mountain } from 'lucide-react';
import { Sidebar } from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-navy)' }}>
            <Mountain color="var(--color-green)" /> TrekSafe
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--color-navy)' }}>
            <Menu />
          </button>
        </div>
        
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
