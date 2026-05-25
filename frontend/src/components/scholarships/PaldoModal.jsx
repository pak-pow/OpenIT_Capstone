/* eslint-disable no-unused-vars */
import React from 'react';
import { PartyPopper, X } from 'lucide-react';
import '../../styles/modal.css';

const PaldoModal = ({ application, onClose }) => {
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
          <div style={{ background: 'var(--golden-yellow)', borderRadius: '50%', padding: '1.5rem', display: 'inline-flex' }}>
            <PartyPopper size={48} color="var(--navy-blue)" />
          </div>
        </div>
        
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-blue)', margin: '0 0 0.5rem' }}>
          UY PALDO!! 💸
        </h2>
        
        <p style={{ fontSize: '1rem', color: 'var(--text-medium)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Congratulations! Your application for <br/><strong>{application.scholarshipName}</strong><br/> has been officially approved!
        </p>
        
        <div style={{ background: 'var(--light-gray)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '4px' }}>Expected Stipend</span>
          <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-text)' }}>
            {application.amount}
          </span>
        </div>
        
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Claim it!
        </button>
      </div>
    </div>
  );
};

export default PaldoModal;
