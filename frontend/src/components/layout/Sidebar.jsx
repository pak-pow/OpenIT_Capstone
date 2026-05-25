import React from 'react';
import { LayoutDashboard, FileSpreadsheet, Users, FileText, BarChart } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Scholarships', icon: FileSpreadsheet, label: 'Manage Scholarships' },
    { id: 'Applicants', icon: Users, label: 'Applicant Tracking' },
    { id: 'Documents', icon: FileText, label: 'Document Requests' },
    { id: 'Reports', icon: BarChart, label: 'Reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Paldo</h2>
        <p>Barangay Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {tabs.map((tab) => (
            <li 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};


export default Sidebar;
