import React, { createContext, useContext, useState, useMemo } from 'react';
import { scholarships as allScholarships } from '../mockdata';
import { computeMatch } from '../utils/matchEngine';

const ScholarshipContext = createContext(null);

export const ScholarshipProvider = ({ children, userProfile }) => {
  const [applications, setApplications] = useState([]);

  // ── Compute match percentages for all scholarships ───────────────
  const scholarshipsWithMatch = useMemo(() => {
    if (!userProfile) {
      return allScholarships.map((s) => ({ ...s, matchPercentage: 0 }));
    }
    return allScholarships
      .map((s) => ({ ...s, matchPercentage: computeMatch(userProfile, s) }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userProfile]);

  const hasApplied = (scholarshipId) =>
    applications.some((a) => a.scholarshipId === scholarshipId);

  const applyToScholarship = (scholarship) => {
    if (hasApplied(scholarship.id)) return false;
    const newApp = {
      id: Date.now(),
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Pending',
      justApproved: false
    };
    setApplications((prev) => [newApp, ...prev]);
    return true;
  };

  const simulateApproval = () => {
    setApplications((prev) => {
      // Find the first Pending or Under Review application
      const idx = prev.findIndex(a => a.status === 'Pending' || a.status === 'Under Review');
      if (idx === -1) return prev;
      
      const next = [...prev];
      next[idx] = { ...next[idx], status: 'Approved', justApproved: true };
      return next;
    });
  };

  const clearJustApproved = (appId) => {
    setApplications((prev) => 
      prev.map(a => a.id === appId ? { ...a, justApproved: false } : a)
    );
  };

  return (
    <ScholarshipContext.Provider
      value={{ 
        scholarships: scholarshipsWithMatch, 
        applications, 
        applyToScholarship, 
        hasApplied,
        simulateApproval,
        clearJustApproved
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => useContext(ScholarshipContext);
