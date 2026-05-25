import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';

const StudentLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="student-layout">
      <header className="student-header">
        <div className="header-brand">
          <h2>Scholar Portal</h2>
          <p>Barangay Scholarship System</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
          </button>
          <div className="user-profile">
            <span className="user-greeting">
              Hi, {currentUser?.firstName || 'Student'}
            </span>
            <div className="avatar">
              {(currentUser?.firstName?.[0] || 'S').toUpperCase()}
            </div>
          </div>
          <button className="icon-btn" title="Sign Out" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="student-main">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default StudentLayout;
