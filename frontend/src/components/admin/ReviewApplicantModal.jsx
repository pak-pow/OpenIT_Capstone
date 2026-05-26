import React from "react";
import { X, Check, XCircle, FileText } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";

const ReviewApplicantModal = ({ applicant, onClose, addToast }) => {
  const { approveApplicant, rejectApplicant } = useAdminContext();

  if (!applicant) return null;

  const handleApprove = async () => {
    const ok = await approveApplicant(applicant.id);
    if (ok) {
      addToast(`${applicant.name} has been approved!`, "success");
      onClose();
      return;
    }

    addToast("Unable to approve applicant right now.", "error");
  };

  const handleReject = async () => {
    const ok = await rejectApplicant(applicant.id);
    if (ok) {
      addToast(`${applicant.name} has been rejected.`, "error");
      onClose();
      return;
    }

    addToast("Unable to reject applicant right now.", "error");
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Review Application</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}
          >
            <div
              style={{
                flex: 1,
                background: "var(--light-gray)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-light)",
                }}
              >
                Applicant Name
              </p>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--navy-blue)",
                }}
              >
                {applicant.name}
              </h3>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.9rem",
                  color: "var(--text-medium)",
                }}
              >
                {applicant.course || "Bachelor of Science"}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--light-gray)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-light)",
                }}
              >
                Scholarship Program
              </p>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  color: "var(--navy-blue)",
                }}
              >
                {applicant.program}
              </h3>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.9rem",
                  color: "var(--text-medium)",
                }}
              >
                Applied: {applicant.appliedDate}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ marginBottom: "0.5rem", color: "var(--navy-blue)" }}>
              Academic & Financial Profile
            </h4>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                background: "#fff",
                border: "1px solid var(--border-light)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-light)",
                  }}
                >
                  GWA
                </span>
                <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                  {applicant.gpa}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ marginBottom: "0.5rem", color: "var(--navy-blue)" }}>
              Submitted Documents
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {["Certificate of Grades", "Barangay Indigency", "Valid ID"].map(
                (doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FileText size={18} color="var(--navy-blue)" />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-dark)",
                        }}
                      >
                        {doc}.pdf
                      </span>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    >
                      View
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-danger"
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onClick={handleReject}
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              className="btn btn-success"
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onClick={handleApprove}
            >
              <Check size={18} /> Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplicantModal;
