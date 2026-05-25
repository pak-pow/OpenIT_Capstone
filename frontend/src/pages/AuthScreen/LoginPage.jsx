import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginPage = ({ onNavigateRegister, onNavigateAdminLogin }) => {
  const { loginAsStudent } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Mock login — accepts any email/password after a delay
    setTimeout(() => {
      const name = form.email.split("@")[0];
      loginAsStudent({
        firstName: name.charAt(0).toUpperCase() + name.slice(1),
        email: form.email,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Shield size={28} color="#FFC000" />
          </div>
          <h1 className="auth-title">Paldo</h1>
          <p className="auth-subtitle">
            Barangay Scholarship Management System
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                className="form-input"
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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
                  className="animate-spin"
                  style={{
                    marginRight: "8px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <button className="auth-link" onClick={onNavigateRegister}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
