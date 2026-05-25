import { INCOME_RANK } from "../mockdata/constants";

// ============================================================
//  computeMatch — Smart Eligibility Matching Engine
//
//  Scoring breakdown (100 pts total):
//    Special Conditions → (0 if not met)
//    GWA               → 35 pts
//    Income            → 30 pts
//    Barangay          → 20 pts
//    Course            → 15 pts
// ============================================================
export function computeMatch(profile, scholarship) {
  const {
    gwa,
    incomeBracket,
    barangay,
    course,
    isPwd = false,
    isSoloParent = false,
    gender = "",
    isIndigenous = false,
  } = profile;

  const { eligibility } = scholarship;
  const conditions = eligibility.specialConditions || [];
  if (conditions.length > 0) {
    const meetsAny = conditions.some((cond) => {
      if (cond === "pwd_or_solo_parent") return isPwd || isSoloParent;
      if (cond === "pwd") return isPwd;
      if (cond === "solo_parent") return isSoloParent;
      if (cond === "female") return gender === "female";
      if (cond === "indigenous") return isIndigenous;
      return false;
    });
    if (!meetsAny) return 0;
  }

  let score = 0;

  // ── GWA (35 pts) ─────────────────────────────────────────────────
  // Scale: 1.00 = highest grade, 5.00 = lowest. Lower = better.
  const userGwa = parseFloat(gwa);
  const minGwa = eligibility.minGwa;

  if (!isNaN(userGwa) && userGwa <= minGwa) {
    score += 35; // meets or exceeds requirement
  } else if (!isNaN(userGwa) && userGwa <= minGwa + 0.25) {
    score += 15; // close but not quite — partial
  }

  // ── Income (30 pts) ──────────────────────────────────────────────
  const userRank = INCOME_RANK[incomeBracket] || 0;
  if (userRank > 0 && userRank <= eligibility.maxIncomeRank) {
    score += 30;
  }

  // ── Barangay (20 pts) ────────────────────────────────────────────
  const openBarangay =
    !eligibility.eligibleBarangays ||
    eligibility.eligibleBarangays.length === 0;

  if (openBarangay || eligibility.eligibleBarangays.includes(barangay)) {
    score += 20;
  }

  // ── Course (15 pts) ──────────────────────────────────────────────
  const openCourse =
    !eligibility.eligibleCourses || eligibility.eligibleCourses.length === 0;
  if (openCourse || eligibility.eligibleCourses.includes(course)) {
    score += 15;
  }

  return Math.min(score, 100);
}
