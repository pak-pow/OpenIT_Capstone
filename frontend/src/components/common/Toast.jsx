import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type} ${hiding ? "toast-hide" : ""}`}>
      <CheckCircle size={18} />
      <span>{message}</span>
      <button
        className="icon-btn"
        onClick={() => {
          setHiding(true);
          setTimeout(onClose, 300);
        }}
        style={{ marginLeft: "auto", padding: "2px" }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-wrapper">
    {toasts.map((t) => (
      <Toast
        key={t.id}
        message={t.message}
        type={t.type}
        onClose={() => removeToast(t.id)}
      />
    ))}
  </div>
);

export default ToastContainer;
