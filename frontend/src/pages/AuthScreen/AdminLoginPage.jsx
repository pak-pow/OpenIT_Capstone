/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = ({ onNavigateLogin }) => {
  const { loginAsAdmin } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    // Mock admin credentials after delay
    setTimeout(() => {
      if (form.username === "admin" && form.password === "admin123") {
        loginAsAdmin({ firstName: "Admin", username: form.username });
      } else {
        setError("Invalid administrator credentials.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon admin-theme">
            <GraduationCap size={28} color="#FFC000" />
          </div>
          <div className="admin-badge">
              <GraduationCap size={14} />
            Restricted Access — Authorized Personnel Only
          </div>
          <h1 className="auth-title">Admin Sign In</h1>
          <p className="auth-subtitle">Barangay/LGU Officials only</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">
              Username
            </label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="admin-username"
                className="form-input"
                type="text"
                name="username"
                placeholder="Administrator username"
                value={form.username}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="admin-password"
                className="form-input"
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Administrator password"
                value={form.password}
                onChange={handleChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="form-error auth-error-msg">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-full auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    marginRight: "8px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Signing In...
              </>
            ) : (
              "Sign In as Administrator"
            )}
          </button>
        </form>

        <div className="auth-footer auth-footer-admin">
          This page is confidential. Unauthorized access is strictly prohibited.
        </div>

        {onNavigateLogin && (
          <button
            type="button"
            onClick={onNavigateLogin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: "0.75rem auto 0",
              background: "none",
              border: "none",
              color: "var(--text-medium)",
              fontSize: "var(--font-size-sm)",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
