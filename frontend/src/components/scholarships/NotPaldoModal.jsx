/* eslint-disable no-unused-vars */
import React from 'react';
import { Frown, X, ArrowRight } from 'lucide-react';
import '../../styles/modal.css';

const NotPaldoModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-card modal-celebration-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn modal-celebration-close" onClick={onClose}>
          <X size={22} />
        </button>
        
        <div className="celebration-icon-container">
          <div className="celebration-icon-wrapper danger">
            <Frown size={48} color="var(--text-light)" />
          </div>
        </div>
        
        <h2 className="celebration-title">
          Aw, Hindi Paldo! 😅
        </h2>
        
        <p className="celebration-message">
          Don't worry, hindi pa tapos ang laban! Your application for <br/><strong>{application.scholarshipName}</strong><br/> wasn't approved this time.
        </p>
        
        <div className="celebration-info-box danger">
          <span className="celebration-info-text">
            There are still plenty of other opportunities in your dashboard. Keep applying!
          </span>
        </div>
        
        <button className="btn btn-primary celebration-btn" onClick={onClose}>
          Laban Lang! <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotPaldoModal;
