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
    <div className="modal-overlay admin-modal-overlay" onClick={onClose}>
      <div
        className="modal-card review-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Review Application</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <div className="review-info-container">
            <div className="review-info-box">
              <p className="review-info-label">
                Applicant Name
              </p>
              <h3 className="review-info-value">
                {applicant.name}
              </h3>
              <p className="review-info-sub">
                {applicant.course || "No course specified"}
              </p>
            </div>
            <div className="review-info-box">
              <p className="review-info-label">
                Scholarship Program
              </p>
              <h3 className="review-info-value-sm">
                {applicant.program}
              </h3>
              <p className="review-info-sub">
                Applied: {applicant.appliedDate}
              </p>
            </div>
          </div>

          <div>
            <h4 className="review-section-title">
              Academic & Financial Profile
            </h4>
            <div className="review-gwa-box">
              <div>
                <span className="review-gwa-label">
                  GWA
                </span>
                <span className="review-gwa-val">
                  {applicant.gpa}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="review-section-title">
              Submitted Documents
            </h4>
            <div className="review-docs-list">
              {(applicant.documents || ["Certificate of Grades", "Barangay Indigency", "Valid ID"]).map(
                (doc, idx) => (
                  <div
                    key={idx}
                    className="review-doc-item"
                  >
                    <div className="review-doc-name">
                      <FileText size={18} color="var(--navy-blue)" />
                      <span className="review-doc-text">
                        {doc}.pdf
                      </span>
                    </div>
                    <button className="btn btn-ghost review-doc-btn">
                      View
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="review-actions">
            <button
              className="btn btn-danger review-btn"
              onClick={handleReject}
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              className="btn btn-success review-btn"
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
