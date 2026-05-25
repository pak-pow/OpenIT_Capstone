import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminOverview from "./AdminOverview";
import AdminScholarships from "./AdminScholarships";
import CreateProgramModal from "../../components/admin/CreateProgramModal";
import { AdminProvider } from "../../context/AdminContext";

const AdminDashboardIndex = ({ addToast }) => {
  const [adminActiveTab, setAdminActiveTab] = useState("Dashboard");
  const [editingProgram, setEditingProgram] = useState(null);

  return (
    <AdminProvider>
      <AdminLayout activeTab={adminActiveTab} setActiveTab={setAdminActiveTab}>
        {adminActiveTab === "Dashboard" && (
          <AdminOverview
            setShowCreateProgram={() => setEditingProgram(true)}
            addToast={addToast}
          />
        )}

        {adminActiveTab === "Scholarships" && (
          <AdminScholarships
            setShowCreateProgram={() => setEditingProgram(true)}
            onEditProgram={(program) => setEditingProgram(program)}
            addToast={addToast}
          />
        )}

        {["Documents", "Reports"].includes(adminActiveTab) && (
          <div className="card empty-state">
            <h3>Coming Soon</h3>
            <p>The {adminActiveTab} module is currently under development.</p>
          </div>
        )}

        {editingProgram && (
          <CreateProgramModal
            onClose={() => setEditingProgram(null)}
            addToast={addToast}
            editData={typeof editingProgram === "object" ? editingProgram : null}
          />
        )}
      </AdminLayout>
    </AdminProvider>
  );
};

export default AdminDashboardIndex;
