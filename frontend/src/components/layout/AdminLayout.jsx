import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-wrapper">
        <header className="admin-header">
          <h2 className="header-title">Admin Dashboard</h2>
          <div className="header-actions">
            <button className="icon-btn" style={{ color: 'var(--text-medium)' }}>
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <span className="user-greeting">
                {currentUser?.firstName || 'Admin'}
              </span>
              <div className="avatar" style={{ backgroundColor: 'var(--navy-blue)', color: 'var(--golden-yellow)' }}>
                {(currentUser?.firstName?.[0] || 'A').toUpperCase()}
              </div>
            </div>
            <button className="icon-btn" style={{ color: 'var(--text-medium)' }} onClick={logout} title="Sign Out">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
