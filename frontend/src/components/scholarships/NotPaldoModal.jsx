/* eslint-disable no-unused-vars */
import React from 'react';
import { Frown, X, ArrowRight } from 'lucide-react';
import '../../styles/modal.css';

const NotPaldoModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem', position: 'relative' }} 
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={22} />
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--light-gray)', borderRadius: '50%', padding: '1.5rem', display: 'inline-flex' }}>
            <Frown size={48} color="var(--text-light)" />
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-blue)', margin: '0 0 0.5rem' }}>
          Aw, Hindi Paldo! 😅
        </h2>
        
        <p style={{ fontSize: '1rem', color: 'var(--text-medium)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Don't worry, hindi pa tapos ang laban! Your application for <br/><strong>{application.scholarshipName}</strong><br/> wasn't approved this time.
        </p>
        
        <div style={{ background: 'var(--info-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(0, 114, 206, 0.2)' }}>
          <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--info-text)' }}>
            There are still plenty of other opportunities in your dashboard. Keep applying!
          </span>
        </div>
        
        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={onClose}>
          Laban Lang! <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotPaldoModal;
