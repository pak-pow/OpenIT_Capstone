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
    };
    setApplications((prev) => [newApp, ...prev]);
    return true;
  };

  return (
    <ScholarshipContext.Provider
      value={{ scholarships: scholarshipsWithMatch, applications, applyToScholarship, hasApplied }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => useContext(ScholarshipContext);
