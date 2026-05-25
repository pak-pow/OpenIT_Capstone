import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';

const StudentLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="student-layout">
      <header className="student-header">
        <div className="header-brand">
          <h2>Paldo</h2>
          <p>Barangay Scholarship System</p>
        </div>
        <div className="header-actions">
          
          {/* Notification Dropdown wrapper */}
          <div className="notif-wrapper" ref={notifRef} style={{ position: 'relative' }}>
            <button 
              className="icon-btn" 
              title="Notifications" 
              onClick={() => setShowNotifs(!showNotifs)}
            >
              <Bell size={20} />
              <span className="notif-badge">2</span>
            </button>

            {showNotifs && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <h4>Notifications</h4>
                </div>
                <div className="notif-list">
                  <div className="notif-item unread">
                    <CheckCircle size={16} className="notif-icon success" />
                    <div className="notif-content">
                      <p><strong>Mayor's Educational Assistance</strong> application received.</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="notif-item unread">
                    <Info size={16} className="notif-icon info" />
                    <div className="notif-content">
                      <p>New scholarship matched your profile: <strong>CHED Tulong Dunong</strong></p>
                      <span>1 day ago</span>
                    </div>
                  </div>
                  <div className="notif-item">
                    <Info size={16} className="notif-icon" />
                    <div className="notif-content">
                      <p>Welcome to the Barangay Scholarship Portal!</p>
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
