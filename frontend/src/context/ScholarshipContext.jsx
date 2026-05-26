/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { computeMatch } from "../utils/matchEngine";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";


const ScholarshipContext = createContext(null);

const normalizeScholarshipType = (rawType) => {
  if (rawType === undefined || rawType === null) return "Government";
  if (typeof rawType === "number") {
    if (rawType === 0) return "Government";
    if (rawType === 1) return "Private/NGO";
    if (rawType === 2) return "Private/NGO";
    return String(rawType);
  }

  const t = String(rawType).trim();
  const lower = t.toLowerCase();
  if (lower.includes("ngo") || lower.includes("private")) return "Private/NGO";
  if (lower.includes("barangay")) return "Barangay";
  if (lower === "lgu") return "LGU";
  if (lower.includes("sk")) return "SK";
  if (lower.includes("ched")) return "CHED";
  if (lower.includes("government")) return "Government";
  return t;
};

const normalizeScholarshipStatus = (rawStatus) => {
  if (rawStatus === undefined || rawStatus === null) return "Active";
  if (typeof rawStatus === "number") {
    if (rawStatus === 0) return "Active";
    if (rawStatus === 1) return "Closed";
    if (rawStatus === 2) return "Archived";
    return String(rawStatus);
  }

  const s = String(rawStatus);
  if (s === "Open") return "Active";
  if (s === "Closed") return "Closed";
  return s;
};

export const ScholarshipProvider = ({ children, userProfile }) => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [scholarshipsData, setScholarshipsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch scholarships and applications from backend and map to frontend shape
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [scholarshipsRes, applicationsRes] = await Promise.all([
          apiRequest("/api/scholarships", { token }),
          token ? apiRequest("/api/applications", { token }) : Promise.resolve([]),
        ]);

        const scholarships = Array.isArray(scholarshipsRes)
          ? scholarshipsRes
          : (Array.isArray(scholarshipsRes?.value) ? scholarshipsRes.value : []);

        const mappedScholarships = scholarships.map((s) => ({
          id: s.id,
          title: s.title,
          provider: s.provider || normalizeScholarshipType(s.type),
          type: normalizeScholarshipType(s.type),
          amount: s.amount || s.maxAmount || `₱${(s.maxHouseholdIncome || 0).toString()}`,
          amountRaw: s.amountRaw || 0,
          deadline: s.deadline ? new Date(s.deadline).toISOString().split("T")[0] : null,
          slots: s.availableSlots ?? s.slots ?? 0,
          slotsFilled: s.slotsFilled ?? 0,
          status: normalizeScholarshipStatus(s.status),
          description: s.description,
          requirements: (Array.isArray(s.requirements) && s.requirements.length > 0)
            ? s.requirements
            : [],
          eligibility: {
            minGwa: s.eligibility?.minGwa ?? s.requiredGwa ?? s.minGwa ?? 0,
            maxIncomeRank: (s.eligibility?.maxIncomeRank ?? s.maxIncomeRank ?? 0) > 0
              ? (s.eligibility?.maxIncomeRank ?? s.maxIncomeRank)
              : 5,
            eligibleBarangays: s.eligibility?.eligibleBarangays ?? s.eligibleBarangays ?? [],
            eligibleCourses: Array.isArray(s.eligibility?.eligibleCourses)
              ? s.eligibility.eligibleCourses
              : (Array.isArray(s.eligibleCourses)
                ? s.eligibleCourses
                : (s.eligibleCourses ? String(s.eligibleCourses).split(",").map((c) => c.trim()) : [])),
            specialConditions: s.eligibility?.specialConditions ?? s.specialConditions ?? [],
          },
        }));

        const mappedApplications = (applicationsRes || []).map((app) => ({
          id: app.id,
          scholarshipId: app.scholarshipId,
          scholarshipName: app.scholarshipName || "Scholarship",
          provider: app.provider || "Provider",
          amount: app.amount || "₱0",
          dateApplied: app.dateApplied || (app.submittedAt ? app.submittedAt.split("T")[0] : ""),
          status: (() => {
            const s = String(app.status);
            if (s === "Submitted" || s === "0") return "Pending";
            if (s === "UnderReview" || s === "1") return "Under Review";
            if (s === "Approved" || s === "2") return "Approved";
            if (s === "Rejected" || s === "3") return "Rejected";
            if (s === "NeedsInfo" || s === "4") return "Under Review";
            return s;
          })(),
          justApproved: false,
          justRejected: false,
          justEnded: false,
        }));

        if (mounted) {
          setScholarshipsData(mappedScholarships);
          setApplications(mappedApplications);
        }
      } catch (err) {
        setError(err?.message || String(err));
        // fallback to empty lists
        if (mounted) {
          setScholarshipsData([]);
          setApplications([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ── Compute match percentages for all scholarships ───────────────
  const scholarshipsWithMatch = useMemo(() => {
    return scholarshipsData
      .map((s) => ({ ...s, matchPercentage: computeMatch(userProfile || {}, s) }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userProfile, scholarshipsData]);

  // ── Derived: the single active (Approved) scholarship, if any ────
  // Uses the most recently approved one (highest id = Date.now())
  const activeScholarship = useMemo(() => {
    const approved = applications.filter((a) => a.status === "Approved");
    if (approved.length === 0) return null;
    return approved.reduce((latest, a) => (a.id > latest.id ? a : latest));
  }, [applications]);

  const hasApplied = (scholarshipId) => applications.some((a) => a.scholarshipId === scholarshipId);

  // ── Apply: blocked if user already has an active (Approved) scholarship ──
  const applyToScholarship = async (scholarship) => {
    // Guard 1: already an active scholar
    if (activeScholarship) return "active_scholar";
    // Guard 2: already applied to this specific scholarship
    if (hasApplied(scholarship.id)) return false;

    // Try to create application via backend; if it fails, fall back to local simulation
    try {
      await apiRequest("/api/applications", {
        method: "POST",
        token: token,
        body: { scholarshipId: scholarship.id },
      });
      // optimistically add to local state
      const newApp = {
        id: Date.now(),
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.title,
        provider: scholarship.provider,
        amount: scholarship.amount,
        dateApplied: new Date().toISOString().split("T")[0],
        status: "Pending",
        justApproved: false,
        justRejected: false,
        justEnded: false,
      };
      setApplications((prev) => [newApp, ...prev]);
      return true;
    } catch {
      return "failed";
    }
  };

  // ── Simulate approval: only approves ONE at a time ────────────────
  // If an approved scholarship already exists, this is a no-op.
  const simulateApproval = () => {
    if (!import.meta.env.DEV) return;
    // Block if any scholarship is already Approved
    const alreadyHasActive = applications.some((a) => a.status === "Approved");
    if (alreadyHasActive) return;

    // Find the first Pending or Under Review application
    const idx = applications.findIndex(
      (a) => a.status === "Pending" || a.status === "Under Review"
    );
    if (idx === -1) return;
    
    const approvedApp = applications[idx];

    // Decrease the available slots for this scholarship
    setScholarshipsData((currentData) => 
      currentData.map((s) => 
        s.id === approvedApp.scholarshipId 
          ? { ...s, slots: Math.max(0, s.slots - 1) } 
          : s
      )
    );

    setApplications((prev) => {
      // Make the selected one Approved, and change all other Pending/Under Review to Withdrawn
      return prev.map((app, index) => {
        if (index === idx) {
          return { ...app, status: "Approved", justApproved: true };
        }
        if (app.status === "Pending" || app.status === "Under Review") {
          return { ...app, status: "Withdrawn" };
        }
        return app;
      });
    });
  };

  // ── Simulate rejection: only rejects ONE at a time ────────────────
  const simulateRejection = () => {
    if (!import.meta.env.DEV) return;
    setApplications((prev) => {
      const idx = prev.findIndex(
        (a) => a.status === "Pending" || a.status === "Under Review"
      );
      if (idx === -1) return prev;

      const next = [...prev];
      next[idx] = { ...next[idx], status: "Rejected", justRejected: true };
      return next;
    });
  };

  // ── Simulate end: changes the active scholarship to Ended ────────────────
  const simulateEnded = () => {
    if (!import.meta.env.DEV) return;
    const idx = applications.findIndex((a) => a.status === "Approved");
    if (idx === -1) return;
    
    const endedApp = applications[idx];

    // Increase the available slots back for this scholarship
    setScholarshipsData((currentData) => 
      currentData.map((s) => 
        s.id === endedApp.scholarshipId 
          ? { ...s, slots: s.slots + 1 } 
          : s
      )
    );

    setApplications((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: "Ended", justEnded: true };
      return next;
    });
  };

  const clearJustApproved = (appId) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, justApproved: false } : a))
    );
  };

  const clearJustRejected = (appId) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, justRejected: false } : a))
    );
  };

  const clearJustEnded = (appId) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, justEnded: false } : a))
    );
  };

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships: scholarshipsWithMatch,
        applications,
        activeScholarship,
        loading,
        error,
        applyToScholarship,
        hasApplied,
        simulateApproval,
        simulateRejection,
        simulateEnded,
        clearJustApproved,
        clearJustRejected,
        clearJustEnded,
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => useContext(ScholarshipContext);
