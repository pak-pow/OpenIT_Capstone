import React from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { useAdminContext } from "../../context/AdminContext";
import { Users } from "lucide-react";

const AdminScholarships = ({ setShowCreateProgram, onEditProgram, addToast }) => {
  const { adminScholarships, endScholarship } = useAdminContext();

  const getStatus = (deadline, currentStatus) => {
    if (currentStatus && currentStatus !== "Active") return currentStatus;
    if (!deadline) return "Active";
    
    // Check if deadline is before today (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    
    return deadlineDate < today ? "Closed" : "Active";
  };

  return (
    <>
      <SectionHeader
        title="Manage Scholarships"
        buttonText="Create New Program"
        onButtonClick={() => setShowCreateProgram(true)}
      />
      <div className="card table-container" style={{ marginTop: "1rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Type</th>
              <th>Stipend Amount</th>
              <th>Slots</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminScholarships.length > 0 ? (
              adminScholarships.map((s) => (
                <tr key={s.id}>
                  <td className="table-cell-name" style={{ fontWeight: "600" }}>
                    {s.title || s.name}
                  </td>
                  <td>{s.type}</td>
                  <td
                    style={{ color: "var(--success-text)", fontWeight: "500" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {s.amount}
                    </div>
                  </td>
                  <td style={{ fontWeight: "500", color: "var(--text-medium)" }}>
                    {s.slotsFilled !== undefined ? `${s.slotsFilled} / ${s.slots}` : `0 / ${s.slots || 0}`}
                  </td>
                  <td>{s.deadline}</td>
                  <td>
                    {(() => {
                      const computedStatus = getStatus(s.deadline, s.status);
                      return (
                        <span
                          className={`badge ${computedStatus === "Active" ? "badge-success" : "badge-danger"}`}
                        >
                          {computedStatus}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        className="btn-review"
                        onClick={() => onEditProgram(s)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-medium)",
                  }}
                >
                  No scholarship programs created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminScholarships;
