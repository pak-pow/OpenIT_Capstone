import React from "react";
import { Home, FileText } from "lucide-react";

const BottomNav = ({ activeView, setView }) => (
  <nav className="bottom-nav">
    <div
      className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
      onClick={() => setView("dashboard")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setView("dashboard")}
    >
      <Home size={22} />
      <span>Home</span>
    </div>
    <div
      className={`nav-item ${activeView === "all" ? "active" : ""}`}
      onClick={() => setView("all")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setView("all")}
    >
      <FileText size={22} />
      <span>Scholarships</span>
    </div>
  </nav>
);

export default BottomNav;
