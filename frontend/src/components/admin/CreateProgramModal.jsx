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
    <div className="modal-overlay admin-modal-overlay" onClick={onClose}>
      <div
        className="modal-card create-prog-card"
        onClick={(e) => e.stopPropagation()}
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
            className="create-prog-form"
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

            <div className="form-row">
              <div className="form-group form-group-flex">
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
              <div className="form-group form-group-flex">
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

            <div className="form-row">
              <div className="form-group form-group-flex">
                <label className="form-label">Stipend Amount *</label>
                <div
                  className="form-input input-with-prefix"
                >
                  <span className="input-prefix">
                    ₱
                  </span>
                  <input
                    type="number"
                    name="amount"
                    className="input-prefixed-field"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>
              <div className="form-group form-group-flex">
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

            <div className="form-row">
              <div className="form-group form-group-flex">
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
              <div className="form-group form-group-flex">
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

            <hr className="prog-hr" />
            <h4 className="prog-section-title">Eligibility Requirements</h4>

            <div className="form-row">
              <div className="form-group form-group-flex">
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
              <div className="form-group form-group-flex">
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

            <div className="form-row">
              <div className="form-group form-group-flex">
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
              <div className="form-group form-group-flex">
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

            <hr className="prog-hr" />
            <h4 className="prog-section-title">Required Documents</h4>
            <p className="prog-desc">
              Add the documents that applicants must submit. Each entry becomes a required document in the application form.
            </p>

            <div className="prog-req-list">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="prog-req-item"
                >
                  <span className="prog-req-num">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    className="form-input prog-req-input"
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                    placeholder={`e.g. Certified true copy of grades`}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      className="prog-req-remove"
                      onClick={() => removeRequirement(idx)}
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
              className="prog-add-btn"
              onClick={addRequirement}
            >
              <Plus size={16} /> Add Document Requirement
            </button>

            <div className="form-actions prog-form-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary prog-save-btn"
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
