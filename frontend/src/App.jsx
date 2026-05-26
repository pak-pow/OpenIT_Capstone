/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import "./index.css";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";

// Auth Pages
import LoginPage from "./pages/AuthScreen/LoginPage";
import RegisterPage from "./pages/AuthScreen/RegisterPage";
import AdminLoginPage from "./pages/AuthScreen/AdminLoginPage";

// Student Dashboard
import UserDashboard from "./pages/UserScreen/UserDashboard";

// Admin Layout & Components
import AdminDashboardIndex from "./pages/AdminDashboard/index";
import ToastContainer from "./components/common/Toast";

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // If they are logged in but wrong role, send them to their respective dashboard
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

// --- Default Route Redirector ---
const RootRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />;
};

const StudentWrapper = ({ addToast }) => {
  const { currentUser } = useAuth();
  return (
    <ScholarshipProvider userProfile={currentUser?.profile}>
      <UserDashboard addToast={addToast} />
    </ScholarshipProvider>
  );
};

const InnerApp = () => {
  const navigate = useNavigate();

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Secret & Navigation keyboard shortcuts ──────────────────────
  //   Shift + \  (or |) → Secret Admin Login
  //   Shift + 1          → Normal Login
  //   Shift + 2          → Register Page
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only fire when NOT inside an input/textarea/select
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.shiftKey && (e.key === "\\" || e.key === "|")) {
        navigate("/admin-login");
      }
      if (e.shiftKey && e.key === "!") {
        // Shift+1 = '!'
        navigate("/login");
      }
      if (e.shiftKey && e.key === "@") {
        // Shift+2 = '@'
        navigate("/register");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboardIndex addToast={addToast} />
          </ProtectedRoute>
        } />
        
        <Route path="/student/*" element={
          <ProtectedRoute allowedRole="student">
            <StudentWrapper addToast={addToast} />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
