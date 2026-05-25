/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
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

const InnerApp = () => {
  const { currentUser } = useAuth();

  // 'login' | 'register' | 'admin-login'
  const [authPage, setAuthPage] = useState("login");

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
        setAuthPage("admin-login");
      }
      if (e.shiftKey && e.key === "!") {
        // Shift+1 = '!'
        setAuthPage("login");
      }
      if (e.shiftKey && e.key === "@") {
        // Shift+2 = '@'
        setAuthPage("register");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── If user is logged in → show their dashboard ──────────────────
  if (currentUser) {
    if (currentUser.role === "admin") {
      return (
        <>
          <AdminDashboardIndex addToast={addToast} />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
      );
    }

    // Student role
    return (
      <ScholarshipProvider userProfile={currentUser.profile}>
        <UserDashboard addToast={addToast} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </ScholarshipProvider>
    );
  }

  // ── Not logged in → show auth pages ──────────────────────────────
  return (
    <>
      {authPage === "login" && (
        <LoginPage
          onNavigateRegister={() => setAuthPage("register")}
          onNavigateAdminLogin={() => setAuthPage("admin-login")}
        />
      )}
      {authPage === "register" && (
        <RegisterPage onNavigateLogin={() => setAuthPage("login")} />
      )}
      {authPage === "admin-login" && (
        <AdminLoginPage onNavigateLogin={() => setAuthPage("login")} />
      )}
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
