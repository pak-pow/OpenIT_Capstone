import React, { useState } from "react";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import LogoutModal from "../common/LogoutModal";

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main-wrapper">
        <header className="admin-header">
          <h2 className="header-title">Admin Dashboard</h2>
          <div className="header-actions">

            <div className="user-profile">
              <span className="user-greeting">
                {currentUser?.firstName || "Admin"}
              </span>
              <div
                className="avatar"
                style={{
                  backgroundColor: "var(--navy-blue)",
                  color: "var(--golden-yellow)",
                }}
              >
                {(currentUser?.firstName?.[0] || "A").toUpperCase()}
              </div>
            </div>
            <button
              className="icon-btn"
              style={{ color: "var(--text-medium)" }}
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>

      {showLogoutModal && (
        <LogoutModal 
          onConfirm={logout} 
          onCancel={() => setShowLogoutModal(false)} 
        />
      )}
    </div>
  );
};

export default AdminLayout;
