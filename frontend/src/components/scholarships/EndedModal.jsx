/* eslint-disable no-unused-vars */
import React from "react";
import { GraduationCap, X } from "lucide-react";
import "../../styles/modal.css";

const EndedModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card modal-celebration-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn modal-celebration-close"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="celebration-icon-container">
          <div className="celebration-icon-wrapper info" style={{ backgroundColor: 'var(--navy-blue)', color: 'var(--golden-yellow)' }}>
            <GraduationCap size={48} />
          </div>
        </div>

        <h2 className="celebration-title celebration-title-large">
          Term Completed! 🎓
        </h2>

        <p className="celebration-message">
          Your active scholarship term for <br />
          <strong>{application.scholarshipName}</strong>
          <br /> has officially concluded.
        </p>

        <div className="celebration-info-box" style={{ backgroundColor: 'var(--light-gray)' }}>
          <span className="celebration-stipend-label">Status</span>
          <span className="celebration-stipend-value" style={{ color: 'var(--navy-blue)' }}>
            Successfully Completed
          </span>
        </div>

        <p className="celebration-message" style={{ fontSize: '0.9rem', marginTop: '16px' }}>
          You are now eligible to apply for new scholarship opportunities in your dashboard!
        </p>

        <button className="btn btn-primary celebration-btn" onClick={onClose}>
          Explore New Opportunities
        </button>
      </div>
    </div>
  );
};

export default EndedModal;
