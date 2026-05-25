/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo } from "react";
import {
  applicants as initialApplicants,
  scholarships as initialScholarships,
} from "../mockdata";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminApplicants, setAdminApplicants] = useState(initialApplicants);
  const [adminScholarships, setAdminScholarships] =
    useState(initialScholarships);

  // Computed metrics
  const adminMetrics = useMemo(() => {
    const activeScholarships = adminScholarships.length;
    const pendingApplications = adminApplicants.filter(
      (a) => a.status === "Pending" || a.status === "Under Review",
    ).length;
    const approvedScholars = adminApplicants.filter(
      (a) => a.status === "Approved",
    ).length;

    // Calculate disbursed funds based on approved scholars
    let totalDisbursed = 0;
    adminApplicants.forEach((app) => {
      if (app.status === "Approved") {
        const scholarship = adminScholarships.find((s) => s.title === app.program || s.name === app.program);
        if (scholarship && scholarship.amountRaw) {
          totalDisbursed += scholarship.amountRaw;
        }
      }
    });

    return {
      activeScholarships,
      pendingApplications,
      approvedScholars,
      totalDisbursed,
    };
  }, [adminApplicants, adminScholarships]);

  const approveApplicant = (id) => {
    setAdminApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)),
    );
  };

  const rejectApplicant = (id) => {
    setAdminApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)),
    );
  };

  const createScholarship = (newScholarship) => {
    const newEntry = {
      ...newScholarship,
      id: Date.now(),
      amountRaw: parseInt(newScholarship.amount.replace(/\D/g, ""), 10) || 0,
      eligibility: newScholarship.eligibility || {
        minGwa: 2.0,
        maxIncomeRank: 5,
        eligibleBarangays: [],
        eligibleCourses: [],
        specialConditions: [],
      },
    };
    setAdminScholarships((prev) => [newEntry, ...prev]);
  };

  const updateScholarship = (updatedScholarship) => {
    setAdminScholarships((prev) =>
      prev.map((s) =>
        s.id === updatedScholarship.id
          ? {
              ...s,
              ...updatedScholarship,
              amountRaw: parseInt(updatedScholarship.amount.replace(/\D/g, ""), 10) || 0,
            }
          : s
      )
    );
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
        updateScholarship,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
