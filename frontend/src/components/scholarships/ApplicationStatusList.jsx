import React from 'react';
import { FileText } from 'lucide-react';
import { useScholarships } from '../../context/ScholarshipContext';

const getBadgeClass = (status) => {
  switch (status) {
    case 'Approved':     return 'badge badge-success';
    case 'Pending':      return 'badge badge-warning';
    case 'Under Review': return 'badge badge-info';
    default:             return 'badge';
  }
};

const ApplicationStatusList = () => {
  const { applications } = useScholarships();

  return (
    <section className="application-status-section">
      <h3 className="section-title">My Applications</h3>
      <div className="card list-card">
        {applications.length === 0 ? (
          <div className="no-applications">
            <FileText size={40} />
            <p>No applications yet. Apply to a scholarship above!</p>
          </div>
        ) : (
          applications.map((app) => (
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
