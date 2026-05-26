/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
// Mock data imports removed

const AdminContext = createContext(null);

import { useAuth } from './AuthContext';
import { apiRequest } from '../api/client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const normalizeScholarshipType = (rawType) => {
  if (rawType === undefined || rawType === null) return 'Government';
  if (typeof rawType === 'number') {
    if (rawType === 0) return 'Government';
    if (rawType === 1) return 'Private/NGO';
    if (rawType === 2) return 'Private/NGO';
    return String(rawType);
  }

  const t = String(rawType).trim();
  const lower = t.toLowerCase();
  if (lower.includes('ngo') || lower.includes('private')) return 'Private/NGO';
  if (lower.includes('barangay')) return 'Barangay';
  if (lower === 'lgu') return 'LGU';
  if (lower.includes('sk')) return 'SK';
  if (lower.includes('ched')) return 'CHED';
  if (lower.includes('government')) return 'Government';
  return t;
};

const normalizeScholarshipStatus = (rawStatus) => {
  if (rawStatus === undefined || rawStatus === null) return 'Active';
  if (typeof rawStatus === 'number') {
    if (rawStatus === 0) return 'Active';
    if (rawStatus === 1) return 'Closed';
    if (rawStatus === 2) return 'Archived';
    return String(rawStatus);
  }

  const s = String(rawStatus);
  if (s === 'Open') return 'Active';
  if (s === 'Closed') return 'Closed';
  return s;
};

const normalizeAppStatus = (rawStatus) => {
  if (typeof rawStatus === 'number') {
    const map = { 0: 'Pending', 1: 'Under Review', 2: 'Approved', 3: 'Rejected', 4: 'Needs Info', 5: 'Withdrawn' };
    return map[rawStatus] || 'Pending';
  }
  const s = String(rawStatus);
  if (s === 'Submitted') return 'Pending';
  if (s === 'UnderReview') return 'Under Review';
  if (s === 'Withdrawn') return 'Withdrawn';
  return s;
};

export const AdminProvider = ({ children }) => {
  const { token } = useAuth();
  const [adminApplicants, setAdminApplicants] = useState([]);
  const [adminScholarships, setAdminScholarships] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [schData, appData] = await Promise.all([
          apiRequest('/api/scholarships', { token }),
          apiRequest('/api/applications', { token })
        ]);
        if (!mounted) return;
        
        const scholarships = Array.isArray(schData) ? schData : (Array.isArray(schData?.value) ? schData.value : []);
        const apps = Array.isArray(appData) ? appData : (Array.isArray(appData?.value) ? appData.value : []);

        const mappedSch = scholarships.map((s) => ({
          id: s.id,
          title: s.title,
          name: s.title,
          type: normalizeScholarshipType(s.type),
          amount: s.amount || (s.amountRaw ? `₱${s.amountRaw}` : ''),
          amountRaw: s.amountRaw || s.maxHouseholdIncome || 0,
          slots: s.availableSlots ?? s.slots ?? 0,
          slotsFilled: s.slotsFilled ?? 0,
          deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : null,
          status: normalizeScholarshipStatus(s.status),
        }));
        
        const mappedApp = apps.map(a => ({
          id: a.id,
          name: a.studentName || "Unknown",
          program: a.scholarshipName || "Unknown",
          gpa: "N/A",
          matchScore: 0,
          appliedDate: a.dateApplied,
          status: normalizeAppStatus(a.status)
        }));

        setAdminScholarships(mappedSch);
        setAdminApplicants(mappedApp);
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };
    if (token) load();
    return () => { mounted = false; };
  }, [token]);

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

  const approveApplicant = async (id) => {
    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: "PUT",
        token,
        body: { status: 2 } // 2 is Approved in backend enum
      });
      // Find the approved applicant to get their name
      const approved = adminApplicants.find((a) => a.id === id);
      setAdminApplicants((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, status: "Approved" };
          // Auto-withdraw other pending/under-review apps for the same student
          if (
            approved &&
            a.name === approved.name &&
            (a.status === "Pending" || a.status === "Under Review")
          ) {
            return { ...a, status: "Withdrawn" };
          }
          return a;
        })
      );
    } catch(e) {
      console.error(e);
      alert(e.message || "Failed to approve applicant. They might already have an active scholarship.");
    }
  };

  const rejectApplicant = async (id) => {
    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: "PUT",
        token,
        body: { status: 3 } // 3 is Rejected in backend enum
      });
      setAdminApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)));
    } catch(e) {
      console.error(e);
    }
  };

  const completeApplicant = async (id) => {
    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: "PUT",
        token,
        body: { status: 6 } // 6 is Completed in backend enum
      });
      setAdminApplicants((prev) => {
        const completed = prev.find(a => a.id === id);
        // Remove the student's withdrawn apps from state and mark this one Completed
        return prev
          .filter(a => !(a.name === completed?.name && a.status === "Withdrawn"))
          .map(a => (a.id === id ? { ...a, status: "Completed" } : a));
      });
    } catch(e) {
      console.error(e);
      alert(e.message || "Failed to complete applicant.");
    }
  };

  const createScholarship = async (newScholarship) => {
    try {
      const dto = {
        title: newScholarship.title,
        description: newScholarship.description || "",
        requiredGwa: newScholarship.eligibility?.minGwa || 0,
        maxHouseholdIncome: parseInt(newScholarship.amount?.replace(/\D/g, ""), 10) || 0,
        requirements: (newScholarship.requirements || []).join("|"),
        provider: newScholarship.provider || "",
        eligibleBarangays: (newScholarship.eligibility?.eligibleBarangays || []).join("|"),
        eligibleCourses: (newScholarship.eligibility?.eligibleCourses || []).join("|"),
        specialConditions: (newScholarship.eligibility?.specialConditions || []).join("|"),
        deadline: newScholarship.deadline || new Date().toISOString(),
        availableSlots: newScholarship.slots || 0,
        status: 0, // Open
        type: 0, // Need mapping logic for type if needed
        barangayId: 1, // Defaulting to 1 for now if UI doesn't provide
      };
      
      const created = await apiRequest('/api/scholarships', {
        method: "POST",
        token,
        body: dto
      });
      
      // reload scholarships instead of manually appending to state, to keep it simple
      const data = await apiRequest('/api/scholarships', { token });
      const mappedSch = (Array.isArray(data) ? data : data.value).map((s) => ({
        id: s.id,
        title: s.title,
        name: s.title,
        type: normalizeScholarshipType(s.type),
        amount: s.amount || (s.amountRaw ? `₱${s.amountRaw}` : ''),
        amountRaw: s.amountRaw || s.maxHouseholdIncome || 0,
        slots: s.availableSlots ?? s.slots ?? 0,
        slotsFilled: s.slotsFilled ?? 0,
        deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : null,
        status: normalizeScholarshipStatus(s.status),
      }));
      setAdminScholarships(mappedSch);
    } catch(e) {
      console.error(e);
    }
  };

  const updateScholarship = async (updatedScholarship) => {
    try {
      const dto = {
        title: updatedScholarship.title,
        description: updatedScholarship.description || "",
        requiredGwa: updatedScholarship.eligibility?.minGwa || 0,
        maxHouseholdIncome: parseInt(updatedScholarship.amount?.replace(/\D/g, ""), 10) || 0,
        requirements: (updatedScholarship.requirements || []).join("|"),
        provider: updatedScholarship.provider || "",
        eligibleBarangays: (updatedScholarship.eligibility?.eligibleBarangays || []).join("|"),
        eligibleCourses: (updatedScholarship.eligibility?.eligibleCourses || []).join("|"),
        specialConditions: (updatedScholarship.eligibility?.specialConditions || []).join("|"),
        deadline: updatedScholarship.deadline || new Date().toISOString(),
        availableSlots: updatedScholarship.slots || 0,
        status: 0, 
        type: 0, 
        barangayId: 1, 
      };
      
      await apiRequest(`/api/scholarships/${updatedScholarship.id}`, {
        method: "PUT",
        token,
        body: dto
      });
      
      const data = await apiRequest('/api/scholarships', { token });
      const mappedSch = (Array.isArray(data) ? data : data.value).map((s) => ({
        id: s.id,
        title: s.title,
        name: s.title,
        type: normalizeScholarshipType(s.type),
        amount: s.amount || (s.amountRaw ? `₱${s.amountRaw}` : ''),
        amountRaw: s.amountRaw || s.maxHouseholdIncome || 0,
        slots: s.availableSlots ?? s.slots ?? 0,
        slotsFilled: s.slotsFilled ?? 0,
        deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : null,
        status: normalizeScholarshipStatus(s.status),
      }));
      setAdminScholarships(mappedSch);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminApplicants,
        adminScholarships,
        adminMetrics,
        approveApplicant,
        rejectApplicant,
        completeApplicant,
        createScholarship,
        updateScholarship,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
