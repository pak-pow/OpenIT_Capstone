/* eslint-disable no-unused-vars */
import React from "react";
import { PartyPopper, X } from "lucide-react";
import "../../styles/modal.css";

const PaldoModal = ({ application, onClose }) => {
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
          <div className="celebration-icon-wrapper success">
            <PartyPopper size={48} color="var(--navy-blue)" />
          </div>
        </div>

        <h2 className="celebration-title celebration-title-large">
          UY PALDO!! 💸
        </h2>

        <p className="celebration-message">
          Congratulations! Your application for <br />
          <strong>{application.scholarshipName}</strong>
          <br /> has been officially approved!
        </p>

        <div className="celebration-info-box success">
          <span className="celebration-stipend-label">Expected Stipend</span>
          <span className="celebration-stipend-value">
            {application.amount}
          </span>
        </div>

        <button className="btn btn-primary celebration-btn" onClick={onClose}>
          Claim it!
        </button>
      </div>
    </div>
  );
};

export default PaldoModal;
