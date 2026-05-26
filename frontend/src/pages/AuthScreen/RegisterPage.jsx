import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  BookOpen,
  Home,
  TrendingUp,
  Heart,
  Banknote,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  CITIES,
  BARANGAYS_BY_CITY,
  SCHOOLS_BY_CITY,
  COURSES,
  INCOME_BRACKETS,
  EDUCATION_LEVELS,
  GRADE_LEVELS,
  SHS_STRANDS,
  JHS_TRACKS,
  VOCATIONAL_COURSES,
} from "../../mockdata/constants";

// Helper: return the right "course" options based on education level
const getCourseOptions = (educationLevel) => {
  switch (educationLevel) {
    case "jhs":
      return JHS_TRACKS;
    case "shs":
      return SHS_STRANDS;
    case "college":
      return COURSES;
    case "vocational":
      return VOCATIONAL_COURSES;
    default:
      return [];
  }
};

const getCourseLabel = (educationLevel) => {
  switch (educationLevel) {
    case "jhs":
      return "Program / Track";
    case "shs":
      return "Strand";
    case "college":
      return "Course / Program";
    case "vocational":
      return "TESDA Qualification";
    default:
      return "Course";
  }
};

const getYearLabel = (educationLevel) => {
  switch (educationLevel) {
    case "jhs":
      return "Grade Level";
    case "shs":
      return "Grade Level";
    case "vocational":
      return "Year Level";
    default:
      return "Year Level";
  }
};

// ──────────────────────────────────────────────────────────────────
const RegisterPage = ({ onNavigateLogin }) => {
  const { registerStudent } = useAuth();

  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    // Step 1 — Account
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2 — Academic profile
    educationLevel: "",
    gwa: "",
    yearLevel: "",
    course: "",
    city: "",
    barangay: "",
    incomeBracket: "",
    // Step 2 — Special conditions (for matching engine)
    gender: "",
    isPwd: false,
    isSoloParent: false,
    isIndigenous: false,
    // Step 2 — Grant disbursement info
    schoolName: "",
    schoolEmail: "",
    schoolAccount: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset dependent fields when education level changes
    if (name === "educationLevel") {
      setForm((prev) => ({
        ...prev,
        educationLevel: value,
        yearLevel: "",
        course: "",
      }));
    } else if (name === "city") {
      setForm((prev) => ({
        ...prev,
        city: value,
        barangay: "",
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────
  const validateStep1 = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (!form.gender) errs.gender = "Please select your gender identity.";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.educationLevel)
      errs.educationLevel = "Please select your education level.";
    const gwaNum = parseFloat(form.gwa);
    if (!form.gwa || isNaN(gwaNum) || gwaNum < 1.0 || gwaNum > 5.0)
      errs.gwa = "GWA must be between 1.00 (highest) and 5.00.";
    if (!form.yearLevel)
      errs.yearLevel = "Please select your grade/year level.";
    if (!form.course) errs.course = "Please select your course/strand/track.";
    if (!form.city) errs.city = "Please select your city/municipality.";
    if (!form.barangay) errs.barangay = "Please select your barangay.";
    if (!form.incomeBracket)
      errs.incomeBracket = "Please select a household income bracket.";
    if (!form.schoolName.trim() || form.schoolName === '__other__')
      errs.schoolName = "Please enter your school or institution name.";
    return errs;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await registerStudent(form);
    } catch (err) {
      setSubmitError(err?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseOptions = getCourseOptions(form.educationLevel);
  const gradeLevels = form.educationLevel
    ? GRADE_LEVELS[form.educationLevel]
    : [];
  const availableBarangays = form.city
    ? [...new Set(BARANGAYS_BY_CITY[form.city])]
    : [];

  return (
    <div className="auth-page">
      <div
        className={`auth-card auth-card-wide ${step === 2 ? "auth-card-scroll" : ""}`}
      >
        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <GraduationCap size={28} color="#FFC000" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            {step === 1
              ? "Step 1 of 2 — Account Information"
              : "Step 2 of 2 — Your Scholarship Profile"}
          </p>
        </div>

        {/* Progress dots */}
        <div className="register-steps">
          <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
        </div>

        {/* ══════════════ STEP 1 ══════════════ */}
        {step === 1 && (
          <form className="auth-form compact" onSubmit={handleNextStep}>
            <div className="name-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    id="firstName"
                    className="form-input"
                    type="text"
                    name="firstName"
                    placeholder="Juan"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && (
                  <span className="form-error">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    id="lastName"
                    className="form-input"
                    type="text"
                    name="lastName"
                    placeholder="Dela Cruz"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && (
                  <span className="form-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                Gender Identity
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <select
                  id="gender"
                  className="form-input form-select"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary / Third Gender</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <span className="form-error">{errors.gender}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="reg-email"
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="reg-password"
                  className="form-input"
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPwd((p) => !p)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full auth-submit-btn"
            >
              Next: My Profile →
            </button>
          </form>
        )}

        {/* ══════════════ STEP 2 ══════════════ */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Hint */}
            <div className="profile-hint">
              <TrendingUp size={16} />
              <span>
                This profile powers your <strong>Smart Match Score</strong> —
                we'll rank scholarships by how well you qualify. Be as accurate
                as possible.
              </span>
            </div>

            {/* ── 1. Residence & Demographics ── */}
            <div className="form-section-label">
              <Home size={14} />
              1. Residence & Demographics
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City / Municipality
              </label>
              <div className="input-wrapper">
                <Home size={18} className="input-icon" />
                <select
                  id="city"
                  className="form-input form-select"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                >
                  <option value="">Select city or municipality</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="barangay">
                Barangay of Residence
              </label>
              <div className="input-wrapper">
                <Home size={18} className="input-icon" />
                <select
                  id="barangay"
                  className="form-input form-select"
                  name="barangay"
                  value={form.barangay}
                  onChange={handleChange}
                  disabled={!form.city}
                >
                  <option value="">
                    {form.city ? "Select your barangay" : "Select city first"}
                  </option>
                  {availableBarangays.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              {errors.barangay && (
                <span className="form-error">{errors.barangay}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="incomeBracket">
                Monthly Household Income
              </label>
              <div className="peso-prefix-wrapper">
                <span className="peso-prefix">₱</span>
                <select
                  id="incomeBracket"
                  className="form-input form-select"
                  name="incomeBracket"
                  value={form.incomeBracket}
                  onChange={handleChange}
                >
                  <option value="">Select income bracket</option>
                  {INCOME_BRACKETS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.incomeBracket && (
                <span className="form-error">{errors.incomeBracket}</span>
              )}
            </div>

            {/* ── 2. Academic Profile ── */}
            <div className="form-section-label">
              <GraduationCap size={14} />
              2. Academic Profile
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="schoolName">
                School / Institution Name <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
              {form.city && SCHOOLS_BY_CITY[form.city] ? (
                <div className="input-wrapper">
                  <GraduationCap size={18} className="input-icon" />
                  <select
                    id="schoolName"
                    className="form-input form-select"
                    name="schoolName"
                    value={form.schoolName}
                    onChange={handleChange}
                  >
                    <option value="">Select your school</option>
                    {SCHOOLS_BY_CITY[form.city].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="__other__">Other / Not listed</option>
                  </select>
                </div>
              ) : (
                <div className="input-wrapper">
                  <GraduationCap size={18} className="input-icon" />
                  <input
                    id="schoolName"
                    className="form-input"
                    type="text"
                    name="schoolName"
                    placeholder={form.city ? "Type your school name" : "Select city first to see schools"}
                    value={form.schoolName === '__other__' ? '' : form.schoolName}
                    onChange={handleChange}
                    disabled={!form.city}
                  />
                </div>
              )}
              {form.schoolName === '__other__' && (
                <div className="input-wrapper" style={{ marginTop: '8px' }}>
                  <GraduationCap size={18} className="input-icon" />
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Type your school name"
                    onChange={(e) => setForm(prev => ({ ...prev, schoolName: e.target.value }))}
                  />
                </div>
              )}
              <span className="form-hint">Select your city first to see schools in your area.</span>
              {errors.schoolName && (
                <span className="form-error">{errors.schoolName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="educationLevel">
                Education Level
              </label>
              <div className="input-wrapper">
                <GraduationCap size={18} className="input-icon" />
                <select
                  id="educationLevel"
                  className="form-input form-select"
                  name="educationLevel"
                  value={form.educationLevel}
                  onChange={handleChange}
                >
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.educationLevel && (
                <span className="form-error">{errors.educationLevel}</span>
              )}
            </div>

            {/* GWA + Year Level (side by side) */}
            <div className="name-row">
              <div className="form-group">
                <label className="form-label" htmlFor="yearLevel">
                  {getYearLabel(form.educationLevel)}
                </label>
                <div className="input-wrapper">
                  <BookOpen size={18} className="input-icon" />
                  <select
                    id="yearLevel"
                    className="form-input form-select"
                    name="yearLevel"
                    value={form.yearLevel}
                    onChange={handleChange}
                    disabled={!form.educationLevel}
                  >
                    <option value="">Select level</option>
                    {gradeLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.yearLevel && (
                  <span className="form-error">{errors.yearLevel}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gwa">
                  GWA
                </label>
                <input
                  id="gwa"
                  className="form-input"
                  type="number"
                  name="gwa"
                  placeholder="e.g. 1.50"
                  min="1.00"
                  max="5.00"
                  step="0.01"
                  value={form.gwa}
                  onChange={handleChange}
                />
                <span className="form-hint">
                  1.00 = highest · 5.00 = lowest
                </span>
                {errors.gwa && <span className="form-error">{errors.gwa}</span>}
              </div>
            </div>

            {/* Course / Strand / Track */}
            <div className="form-group">
              <label className="form-label" htmlFor="course">
                {getCourseLabel(form.educationLevel)}
              </label>
              <div className="input-wrapper">
                <BookOpen size={18} className="input-icon" />
                <select
                  id="course"
                  className="form-input form-select"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  disabled={!form.educationLevel}
                >
                  <option value="">
                    {form.educationLevel
                      ? `Select ${getCourseLabel(form.educationLevel).toLowerCase()}`
                      : "Select education level first"}
                  </option>
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.course && (
                <span className="form-error">{errors.course}</span>
              )}
            </div>

            {/* ── 3. Grant Disbursement Info ── */}
            <div className="form-section-label">
              <Banknote size={14} />
              3. Grant Disbursement Info
            </div>

            <div className="profile-hint" style={{ marginBottom: '12px' }}>
              <Banknote size={16} />
              <span>
                This tells us <strong>where to send your scholarship grant</strong> once approved.
                Your grant will be released within 30 working days after approval.
              </span>
            </div>

            <div className="name-row">
              <div className="form-group">
                <label className="form-label" htmlFor="schoolEmail">
                  School Email <span className="form-optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="schoolEmail"
                    className="form-input"
                    type="email"
                    name="schoolEmail"
                    placeholder="you@school.edu.ph"
                    value={form.schoolEmail}
                    onChange={handleChange}
                  />
                </div>
                <span className="form-hint">For registrar notifications</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="schoolAccount">
                  School Account No. <span className="form-optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <Banknote size={18} className="input-icon" />
                  <input
                    id="schoolAccount"
                    className="form-input"
                    type="text"
                    name="schoolAccount"
                    placeholder="e.g. 1234-5678-90"
                    value={form.schoolAccount}
                    onChange={handleChange}
                  />
                </div>
                <span className="form-hint">Landbank / UnionBank school account</span>
              </div>
            </div>

            {/* ── 4. Additional Eligibility ── */}
            <div className="form-section-label">
              <Heart size={14} />
              4. Additional Eligibility
            </div>

            <p className="form-hint">
              Check all circumstances that apply to you. Some scholarships have
              specific matching criteria based on these.
            </p>

            {/* Special Condition Checkboxes */}
            <div className="eligibility-checks">
              <label className="check-item">
                <input
                  type="checkbox"
                  name="isPwd"
                  checked={form.isPwd}
                  onChange={handleChange}
                />
                <div className="check-text">
                  <span className="check-title">
                    I have a PWD (Person with Disability) ID
                  </span>
                  <span className="check-sub">
                    Issued by a local government unit or NCDA
                  </span>
                </div>
              </label>

              <label className="check-item">
                <input
                  type="checkbox"
                  name="isSoloParent"
                  checked={form.isSoloParent}
                  onChange={handleChange}
                />
                <div className="check-text">
                  <span className="check-title">
                    I am a solo parent or a child of a solo parent
                  </span>
                  <span className="check-sub">
                    Under Republic Act 8972 (Solo Parents' Welfare Act)
                  </span>
                </div>
              </label>

              <label className="check-item">
                <input
                  type="checkbox"
                  name="isIndigenous"
                  checked={form.isIndigenous}
                  onChange={handleChange}
                />
                <div className="check-text">
                  <span className="check-title">
                    I belong to an Indigenous Peoples (IP) community
                  </span>
                  <span className="check-sub">
                    Recognized by the National Commission on Indigenous Peoples
                    (NCIP)
                  </span>
                </div>
              </label>
            </div>

            {/* Actions */}
            {submitError && (
              <p className="form-error auth-error-msg">{submitError}</p>
            )}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn btn-ghost form-action-btn-secondary"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary form-action-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register & Match"}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          Already have an account?{" "}
          <button className="auth-link" onClick={onNavigateLogin}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
