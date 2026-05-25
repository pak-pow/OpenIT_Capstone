import React from 'react';
import { LayoutDashboard, FileSpreadsheet, Users, FileText, BarChart } from 'lucide-react';

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <h2>Paldo</h2>
      <p>Barangay Admin Panel</p>
    </div>
    <nav className="sidebar-nav">
      <ul>
        <li className="nav-item active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </li>
        <li className="nav-item">
          <FileSpreadsheet size={20} />
          <span>Manage Scholarships</span>
        </li>
        <li className="nav-item">
          <Users size={20} />
          <span>Applicant Tracking</span>
        </li>
        <li className="nav-item">
          <FileText size={20} />
          <span>Document Requests</span>
        </li>
        <li className="nav-item">
          <BarChart size={20} />
          <span>Reports</span>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
