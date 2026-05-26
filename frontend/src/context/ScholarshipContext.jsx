import React, { createContext, useContext, useState, useMemo } from "react";
import { scholarships as allScholarships } from "../mockdata";
import { computeMatch } from "../utils/matchEngine";

const ScholarshipContext = createContext(null);

export const ScholarshipProvider = ({ children, userProfile }) => {
  const [applications, setApplications] = useState([]);
  const [scholarshipsData, setScholarshipsData] = useState(allScholarships);

  // ── Compute match percentages for all scholarships ───────────────
  const scholarshipsWithMatch = useMemo(() => {
    if (!userProfile) {
      return scholarshipsData.map((s) => ({ ...s, matchPercentage: 0 }));
    }
    return scholarshipsData
      .map((s) => ({ ...s, matchPercentage: computeMatch(userProfile, s) }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userProfile, scholarshipsData]);

  // ── Derived: the single active (Approved) scholarship, if any ────
  // Uses the most recently approved one (highest id = Date.now())
  const activeScholarship = useMemo(() => {
    const approved = applications.filter((a) => a.status === "Approved");
    if (approved.length === 0) return null;
    return approved.reduce((latest, a) => (a.id > latest.id ? a : latest));
  }, [applications]);

  const hasApplied = (scholarshipId) =>
    applications.some((a) => a.scholarshipId === scholarshipId);

  // ── Apply: blocked if user already has an active (Approved) scholarship ──
  const applyToScholarship = (scholarship) => {
    // Guard 1: already an active scholar
    if (activeScholarship) return "active_scholar";
    // Guard 2: already applied to this specific scholarship
    if (hasApplied(scholarship.id)) return false;

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
  };

  // ── Simulate approval: only approves ONE at a time ────────────────
  // If an approved scholarship already exists, this is a no-op.
  const simulateApproval = () => {
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
        activeScholarship,       // ← single source of truth for "am I an active scholar?"
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
