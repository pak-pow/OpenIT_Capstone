import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useScholarships } from '../../context/ScholarshipContext';

const getBadgeClass = (status) => {
  switch (status) {
    case 'Approved':     return 'badge badge-success';
    case 'Pending':      return 'badge badge-warning';
    case 'Under Review': return 'badge badge-info';
    case 'Rejected':     return 'badge badge-danger';
    default:             return 'badge';
  }
};

const ApplicationStatusList = () => {
  const { applications } = useScholarships();
  const [activeTab, setActiveTab] = useState('All');

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return app.status === 'Pending' || app.status === 'Under Review';
    return app.status === activeTab;
  });

  return (
    <section className="application-status-section">
      <div className="section-header-row status-list-header">
        <h3 className="section-title">My Applications</h3>
        <div className="status-tabs">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`status-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="card list-card">
        {filteredApps.length === 0 ? (
          <div className="no-applications">
            <FileText size={40} />
            <p>No applications found in this category.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="list-item">
              <div className="item-info">
                <h4 className="item-title">{app.scholarshipName}</h4>
                <span className="item-subtitle">Applied on {app.dateApplied} · {app.amount}</span>
              </div>
              <div className="item-status">
                <span className={getBadgeClass(app.status)}>{app.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ApplicationStatusList;
