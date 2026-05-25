import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BottomNav from "./BottomNav";

const StudentLayout = ({ children, view, setView }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="student-layout">
      <header className="student-header">
        <div className="header-brand">
          <h2>Paldo</h2>
          <p>Barangay Scholarship System</p>
        </div>
        <div className="header-actions">

          <div className="user-profile">
            <span className="user-greeting">
              Hi, {currentUser?.firstName || "Student"}
            </span>
            <div className="avatar">
              {(currentUser?.firstName?.[0] || "S").toUpperCase()}
            </div>
          </div>
          <button className="icon-btn" title="Sign Out" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="student-main">{children}</main>

      <BottomNav activeView={view} setView={setView} />
    </div>
  );
};

export default StudentLayout;
