/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo } from 'react';
import { applicants as initialApplicants, scholarships as initialScholarships } from '../mockdata';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminApplicants, setAdminApplicants] = useState(initialApplicants);
  const [adminScholarships, setAdminScholarships] = useState(initialScholarships);

  // Computed metrics
  const adminMetrics = useMemo(() => {
    const activeScholarships = adminScholarships.length;
    const pendingApplications = adminApplicants.filter(
      (a) => a.status === 'Pending' || a.status === 'Under Review'
    ).length;
    const approvedScholars = adminApplicants.filter(
      (a) => a.status === 'Approved'
    ).length;

    return {
      activeScholarships,
      pendingApplications,
      approvedScholars,
    };
  }, [adminApplicants, adminScholarships]);

  const approveApplicant = (id) => {
    setAdminApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a))
    );
  };

  const rejectApplicant = (id) => {
    setAdminApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a))
    );
  };

  const createScholarship = (newScholarship) => {
    const newEntry = {
      ...newScholarship,
      id: Date.now(),
      amountRaw: parseInt(newScholarship.amount.replace(/\D/g, ''), 10) || 0,
      eligibility: {
        minGwa: 2.0,
        maxIncomeRank: 5,
        eligibleBarangays: [],
        eligibleCourses: [],
        specialConditions: [],
      },
    };
    setAdminScholarships((prev) => [newEntry, ...prev]);
  };

  return (
    <AdminContext.Provider
      value={{
        adminApplicants,
        adminScholarships,
        adminMetrics,
        approveApplicant,
        rejectApplicant,
        createScholarship,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
