import React, { useState, useEffect } from "react";
import { LogOut, X } from "lucide-react";
import "../../styles/modal.css"; // We can reuse standard modal styling

const LogoutModal = ({ onConfirm, onCancel }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay slightly to trigger fade-in animation
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onCancel, 300); // wait for fade out
  };

  return (
    <div className={`modal-overlay ${show ? "visible" : ""}`} onClick={handleClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px", padding: "32px 24px", textAlign: "center", position: "relative" }}
      >
        <button 
          className="modal-close-btn" 
          onClick={handleClose}
          style={{ position: "absolute", top: "12px", right: "12px" }}
        >
          <X size={20} />
        </button>

        <div className="modal-header-icon info-icon" style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", color: "#dc2626", margin: "0 auto 16px auto" }}>
          <LogOut size={32} />
        </div>

        <h2 className="modal-title" style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Sign Out</h2>
        
        <p className="modal-subtitle" style={{ fontSize: "0.95rem", marginBottom: "24px" }}>
          Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.
        </p>

        <div className="modal-actions" style={{ display: "flex", gap: "12px", marginTop: "0" }}>
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
