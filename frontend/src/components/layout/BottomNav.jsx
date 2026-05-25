import React from 'react';
import { Home, FileText, User } from 'lucide-react';

const BottomNav = () => (
  <nav className="bottom-nav">
    <div className="nav-item active">
      <Home size={22} />
      <span>Home</span>
    </div>
    <div className="nav-item">
      <FileText size={22} />
      <span>Applications</span>
    </div>
    <div className="nav-item">
      <User size={22} />
      <span>Profile</span>
    </div>
  </nav>
);

export default BottomNav;
