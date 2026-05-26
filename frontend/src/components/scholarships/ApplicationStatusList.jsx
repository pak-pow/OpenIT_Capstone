import React, { useState } from "react";
import { FileText, Award } from "lucide-react";
import { useScholarships } from "../../context/ScholarshipContext";

const getBadgeClass = (status) => {
  switch (status) {
    case "Approved":    return "badge badge-success";
    case "Pending":     return "badge badge-warning";
    case "Under Review":return "badge badge-info";
    case "Rejected":    return "badge badge-danger";
    case "Ended":       return "badge badge-neutral";
    default:            return "badge";
  }
};

const ApplicationStatusList = () => {
  const { applications, activeScholarship } = useScholarships();
  const [activeTab, setActiveTab] = useState("All");

  // Count per tab for the badges
  const counts = {
    All:      applications.length,
    Pending:  applications.filter(a => a.status === "Pending" || a.status === "Under Review").length,
    Approved: applications.filter(a => a.status === "Approved").length,
    Ended:    applications.filter(a => a.status === "Ended").length,
    Rejected: applications.filter(a => a.status === "Rejected").length,
  };

  const filteredApps = applications.filter((app) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending")
      return app.status === "Pending" || app.status === "Under Review";
    return app.status === activeTab;
  });

  return (
    <section className="application-status-section">
      <div className="section-header-row status-list-header">
        <h3 className="section-title">My Applications</h3>
        <div className="status-tabs">
          {["All", "Pending", "Approved", "Ended", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`status-tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className="tab-count-badge">{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active scholar notice */}
      {activeScholarship && (
        <div className="active-scholar-notice">
          <Award size={16} />
          <span>
            You are currently an active scholar for{" "}
            <strong>{activeScholarship.scholarshipName}</strong>.
            New applications are locked until your scholarship ends.
          </span>
        </div>
      )}

      <div className="card list-card">
        {filteredApps.length === 0 ? (
          <div className="no-applications">
            <FileText size={40} />
            <p>No applications found in this category.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className={`list-item ${app.status === "Approved" ? "list-item-approved" : ""}`}>
              <div className="item-info">
                <h4 className="item-title">
                  {app.scholarshipName}
                  {app.status === "Approved" && activeScholarship?.id === app.id && (
                    <span className="active-scholar-tag">● Active</span>
                  )}
                </h4>
                <span className="item-subtitle">
                  Applied on {app.dateApplied} · {app.amount}
                </span>
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
