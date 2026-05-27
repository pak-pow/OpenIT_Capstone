import React from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";

const MetricCards = () => {
  const { adminMetrics } = useAdminContext();
  return (
    <div className="metrics-grid">
      <div className="card metric-card">
        <div className="metric-icon metric-icon-blue">
          <FileText size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Active Scholarships</span>
          <h3 className="metric-value">{adminMetrics.activeScholarships}</h3>
        </div>
      </div>
      <div className="card metric-card">
        <div className="metric-icon metric-icon-yellow">
          <Clock size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Pending Applications</span>
          <h3 className="metric-value">{adminMetrics.pendingApplications}</h3>
        </div>
      </div>
      <div className="card metric-card">
        <div className="metric-icon metric-icon-green">
          <CheckCircle size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Approved Scholars</span>
          <h3 className="metric-value">{adminMetrics.approvedScholars}</h3>
        </div>
      </div>
      <div className="card metric-card">
        <div className="metric-icon metric-icon-gold">
          <span>₱</span>
        </div>
        <div className="metric-content">
          <span className="metric-label">Funds Disbursed</span>
          <h3 className="metric-value">
            ₱{adminMetrics.totalDisbursed?.toLocaleString() || "0"}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
