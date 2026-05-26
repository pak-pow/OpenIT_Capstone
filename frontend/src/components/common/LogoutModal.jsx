import React, { useState, useEffect } from "react";
import { LogOut, X } from "lucide-react";
import "../../styles/modal.css"; 

const LogoutModal = ({ onConfirm, onCancel }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay slightly to trigger fade-in animation
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onCancel, 300);
  };

  return (
    <div className={`modal-overlay logout-modal-overlay ${show ? "visible" : ""}`} onClick={handleClose}>
      <div 
        className="modal-card logout-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn logout-modal-close" 
          onClick={handleClose}
        >
          <X size={20} />
        </button>

        <div className="modal-header-icon info-icon logout-modal-icon">
          <LogOut size={32} />
        </div>

        <h2 className="modal-title logout-modal-title">Sign Out</h2>
        
        <p className="modal-subtitle logout-modal-subtitle">
          Are you sure you want to log out of your account?
        </p>

        <div className="modal-actions logout-modal-actions">
          <button className="btn btn-ghost btn-full" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="btn btn-danger btn-full" 
            onClick={() => {
              setShow(false);
              setTimeout(onConfirm, 200);
            }}
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
