import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";
import { BARANGAYS_BY_CITY, COURSES, VOCATIONAL_COURSES, SHS_STRANDS, JHS_TRACKS } from "../../mockdata/constants";

const allBarangays = [...new Set(Object.values(BARANGAYS_BY_CITY).flat())].sort();
const allCourses = [...COURSES, ...VOCATIONAL_COURSES, ...SHS_STRANDS, ...JHS_TRACKS].sort();

const CreateProgramModal = ({ onClose, addToast, editData }) => {
  const { createScholarship, updateScholarship } = useAdminContext();
  const [formData, setFormData] = useState({
    title: editData?.title || editData?.name || "",
    provider: editData?.provider || "",
    type: editData?.type || "LGU",
    amount: editData?.amountRaw || editData?.amount?.replace(/\D/g, "") || "",
    slots: editData?.slots || "",
    deadline: editData?.deadline || "",
    termEndDate: editData?.termEndDate || "",
    description: editData?.description || "",
    minGwa: editData?.eligibility?.minGwa || 2.0,
    maxIncomeRank: editData?.eligibility?.maxIncomeRank || 5,
    eligibleBarangay: editData?.eligibility?.eligibleBarangays?.[0] || "All",
    eligibleCourse: editData?.eligibility?.eligibleCourses?.[0] || "All",
  });

  const [requirements, setRequirements] = useState(
    editData?.requirements?.length > 0
      ? editData.requirements
      : [""]
  );

  const addRequirement = () => setRequirements((prev) => [...prev, ""]);
  const removeRequirement = (idx) =>
    setRequirements((prev) => prev.filter((_, i) => i !== idx));
  const updateRequirement = (idx, value) =>
    setRequirements((prev) => prev.map((r, i) => (i === idx ? value : r)));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.deadline) {
      addToast("Please fill in all required fields.", "error");
      return;
    }

    const cleanedRequirements = requirements.map((r) => r.trim()).filter(Boolean);

    // Convert to the required format
    const newProgram = {
      ...formData,
      amount: `₱${formData.amount}`,
      slots: parseInt(formData.slots, 10) || 0,
      requirements: cleanedRequirements,
      eligibility: {
        minGwa: parseFloat(formData.minGwa) || 2.0,
        maxIncomeRank: parseInt(formData.maxIncomeRank, 10) || 5,
        eligibleBarangays: formData.eligibleBarangay === "All" ? [] : [formData.eligibleBarangay],
        eligibleCourses: formData.eligibleCourse === "All" ? [] : [formData.eligibleCourse],
        specialConditions: editData?.eligibility?.specialConditions || [],
      },
    };

    if (editData) {
      const ok = await updateScholarship({ ...editData, ...newProgram });
      if (ok) addToast("Program updated successfully!", "success");
      else addToast("Unable to update program right now.", "error");
    } else {
      const ok = await createScholarship(newProgram);
      if (ok) addToast("New program created successfully!", "success");
      else addToast("Unable to create program right now.", "error");
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px" }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {editData ? "Edit Program" : "Create New Program"}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        <div className="modal-body">
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div className="form-group">
              <label className="form-label">Program Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Mayor's Honor Roll"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Provider</label>
                <input
                  type="text"
                  name="provider"
                  className="form-input"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="e.g. LGU"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Type</label>
                <select
                  name="type"
                  className="form-input"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="LGU">LGU</option>
                  <option value="SK">SK</option>
                  <option value="CHED">CHED</option>
                  <option value="Private/NGO">Private/NGO</option>
                  <option value="Barangay">Barangay</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stipend Amount *</label>
                <div
                  className="form-input"
                  style={{
                    display: "flex",
                    padding: 0,
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      padding: "0 0.75rem",
                      color: "var(--text-medium)",
                      fontWeight: "600",
                    }}
                  >
                    ₱
                  </span>
                  <input
                    type="number"
                    name="amount"
                    style={{
                      border: "none",
                      padding: "0.75rem 0",
                      width: "100%",
                      outline: "none",
                      background: "transparent",
                      fontSize: "var(--font-size-base)",
                      color: "var(--text-dark)",
                    }}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Slots</label>
                <input
                  type="number"
                  name="slots"
                  className="form-input"
                  value={formData.slots}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Application Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">End Term Date (Stipend End)</label>
                <input
                  type="date"
                  name="termEndDate"
                  className="form-input"
                  value={formData.termEndDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the scholarship..."
              />
            </div>

            <hr style={{ margin: "1rem 0", borderColor: "var(--border-light)" }} />
            <h4 style={{ marginBottom: "0.5rem", color: "var(--navy-blue)" }}>Eligibility Requirements</h4>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Minimum GWA (e.g. 1.5)</label>
                <input
                  type="number"
                  step="0.01"
                  name="minGwa"
                  className="form-input"
                  value={formData.minGwa}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Max Income Bracket</label>
                <select
                  name="maxIncomeRank"
                  className="form-input"
                  value={formData.maxIncomeRank}
                  onChange={handleChange}
                >
                  <option value={1}>Below ₱10,000</option>
                  <option value={2}>Up to ₱20,000</option>
                  <option value={3}>Up to ₱40,000</option>
                  <option value={4}>Up to ₱60,000</option>
                  <option value={5}>Any Income / Open</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Barangay Restriction</label>
                <select
                  name="eligibleBarangay"
                  className="form-input"
                  value={formData.eligibleBarangay}
                  onChange={handleChange}
                >
                  <option value="All">Open to All Barangays</option>
                  {allBarangays.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Course Restriction</label>
                <select
                  name="eligibleCourse"
                  className="form-input"
                  value={formData.eligibleCourse}
                  onChange={handleChange}
                >
                  <option value="All">Open to All Courses</option>
                  {allCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr style={{ margin: "1rem 0", borderColor: "var(--border-light)" }} />
            <h4 style={{ marginBottom: "0.5rem", color: "var(--navy-blue)" }}>Required Documents</h4>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-medium)", marginBottom: "0.75rem" }}>
              Add the documents that applicants must submit. Each entry becomes a required document in the application form.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      minWidth: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "var(--info-bg)",
                      color: "var(--info-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                    placeholder={`e.g. Certified true copy of grades`}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--danger-text)",
                        padding: "4px",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        transition: "background var(--transition-fast)",
                      }}
                      title="Remove this document"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRequirement}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.5rem",
                background: "none",
                border: "1.5px dashed var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "var(--font-size-sm)",
                transition: "all var(--transition-fast)",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Plus size={16} /> Add Document Requirement
            </button>

            <div
              className="form-actions"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Save size={18} /> {editData ? "Save Changes" : "Save Program"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;
