/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import {
  applicants as initialApplicants,
  scholarships as initialScholarships,
} from "../mockdata";

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

const normalizeApplicationStatus = (rawStatus) => {
  if (rawStatus === undefined || rawStatus === null) return "Pending";
  if (typeof rawStatus === "number") {
    if (rawStatus === 0) return "Pending";
    if (rawStatus === 1) return "Under Review";
    if (rawStatus === 2) return "Approved";
    if (rawStatus === 3) return "Rejected";
    if (rawStatus === 4) return "Under Review";
    return String(rawStatus);
  }

  const s = String(rawStatus);
  if (s === "Submitted") return "Pending";
  if (s === "UnderReview") return "Under Review";
  if (s === "Approved") return "Approved";
  if (s === "Rejected") return "Rejected";
  if (s === "NeedsInfo") return "Under Review";
  return s;
};

const toApiScholarshipType = (uiType) => {
  const t = String(uiType || "Government").toLowerCase();
  if (t.includes("private")) return 1;
  if (t.includes("ngo")) return 2;
  return 0;
};

const toApiScholarshipStatus = (uiStatus) => {
  const s = String(uiStatus || "Active").toLowerCase();
  if (s === "closed") return 1;
  if (s === "archived") return 2;
  return 0;
};

const toApiApplicationStatus = (uiStatus) => {
  const s = String(uiStatus || "Pending").toLowerCase();
  if (s === "under review") return 1;
  if (s === "approved") return 2;
  if (s === "rejected") return 3;
  if (s === "needs info") return 4;
  return 0;
};

export const AdminProvider = ({ children }) => {
  const { token } = useAuth();
  const getMockScholarships = () => {
    const cached = localStorage.getItem("mock_scholarships");
    return cached ? JSON.parse(cached) : initialScholarships;
  };
  const [adminApplicants, setAdminApplicants] = useState(USE_MOCK ? initialApplicants : []);
  const [adminScholarships, setAdminScholarships] = useState(() => {
    if (!USE_MOCK) return [];
    return getMockScholarships();
  });
  const [defaultBarangayId, setDefaultBarangayId] = useState(null);

  const resolveBarangayId = useCallback(async () => {
    if (defaultBarangayId) return defaultBarangayId;
    const barangaysRaw = await apiRequest('/api/barangays', { token });
    const barangays = Array.isArray(barangaysRaw)
      ? barangaysRaw
      : (Array.isArray(barangaysRaw?.value) ? barangaysRaw.value : []);
    const firstId = barangays[0]?.id ?? null;
    if (firstId) setDefaultBarangayId(firstId);
    return firstId;
  }, [defaultBarangayId, token]);

  const loadAdminData = useCallback(async () => {
    if (USE_MOCK) return;

    const [scholarshipsRaw, applicationsRaw, studentsRaw, barangaysRaw] = await Promise.all([
      apiRequest('/api/scholarships', { token }),
      apiRequest('/api/applications', { token }),
      apiRequest('/api/students', { token }),
      apiRequest('/api/barangays', { token }),
    ]);

    const scholarships = Array.isArray(scholarshipsRaw)
      ? scholarshipsRaw
      : (Array.isArray(scholarshipsRaw?.value) ? scholarshipsRaw.value : []);
    const applications = Array.isArray(applicationsRaw)
      ? applicationsRaw
      : (Array.isArray(applicationsRaw?.value) ? applicationsRaw.value : []);
    const students = Array.isArray(studentsRaw)
      ? studentsRaw
      : (Array.isArray(studentsRaw?.value) ? studentsRaw.value : []);
    const barangays = Array.isArray(barangaysRaw)
      ? barangaysRaw
      : (Array.isArray(barangaysRaw?.value) ? barangaysRaw.value : []);

    if (barangays.length > 0) {
      setDefaultBarangayId(barangays[0].id);
    }

    const mappedScholarships = scholarships.map((s) => ({
      id: s.id,
      title: s.title,
      name: s.title,
      provider: s.provider || '',
      type: normalizeScholarshipType(s.type),
      amount: s.amount || (s.amountRaw ? `₱${s.amountRaw}` : ''),
      amountRaw: s.amountRaw || s.maxHouseholdIncome || 0,
      slots: s.availableSlots ?? s.slots ?? 0,
      slotsFilled: s.slotsFilled ?? 0,
      deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : null,
      status: normalizeScholarshipStatus(s.status),
      description: s.description || '',
      eligibility: s.eligibility || {
        minGwa: s.requiredGwa ?? 2.0,
        maxIncomeRank: 5,
        eligibleBarangays: [],
        eligibleCourses: [],
        specialConditions: [],
      },
    }));

    const studentsById = new Map(students.map((s) => [s.id, s]));
    const mappedApplicants = applications.map((a) => {
      const student = studentsById.get(a.studentId);
      return {
        id: a.id,
        studentId: a.studentId,
        scholarshipId: a.scholarshipId,
        name: student?.fullName || `Student #${a.studentId}`,
        program: a.scholarshipName || 'Scholarship',
        gpa: student?.gwa ?? '-',
        course: student?.course || '',
        appliedDate: a.dateApplied || (a.submittedAt ? String(a.submittedAt).split('T')[0] : ''),
        status: normalizeApplicationStatus(a.status),
      };
    });

    setAdminScholarships(mappedScholarships);
    setAdminApplicants(mappedApplicants);
  }, [token]);

  // If not using mock, load scholarships from backend for admin view
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (USE_MOCK) return;
      try {
        await loadAdminData();
      } catch (err) {
        // Fallback for admin view if backend is unavailable/misconfigured.
        if (mounted) {
          setAdminScholarships(getMockScholarships());
          setAdminApplicants(initialApplicants);
        }
        console.error('Failed to load admin scholarships', err);
      }
    };
    load();
    const interval = window.setInterval(() => {
      if (!mounted) return;
      load().catch((err) => console.error('Failed to refresh admin scholarships', err));
    }, 15000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [loadAdminData]);

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
    if (USE_MOCK) {
      setAdminApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)),
      );
      return true;
    }

    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: 'PUT',
        token,
        body: { status: toApiApplicationStatus('Approved') },
      });
      await loadAdminData();
      return true;
    } catch {
      return false;
    }
  };

  const rejectApplicant = async (id) => {
    if (USE_MOCK) {
      setAdminApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)),
      );
      return true;
    }

    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: 'PUT',
        token,
        body: { status: toApiApplicationStatus('Rejected') },
      });
      await loadAdminData();
      return true;
    } catch {
      return false;
    }
  };

  const createScholarship = async (newScholarship) => {
    if (!USE_MOCK) {
      try {
        const amountRaw = parseInt(String(newScholarship.amount || '').replace(/\D/g, ''), 10) || 0;
        const barangayId = newScholarship.barangayId || await resolveBarangayId();
        await apiRequest('/api/scholarships', {
          method: 'POST',
          token,
          body: {
            title: newScholarship.title,
            description: newScholarship.description || '',
            requiredGwa: newScholarship.eligibility?.minGwa ?? 2.0,
            maxHouseholdIncome: amountRaw,
            eligibleCourses: (newScholarship.eligibility?.eligibleCourses || []).join(','),
            deadline: newScholarship.deadline,
            availableSlots: newScholarship.slots || 0,
            status: toApiScholarshipStatus(newScholarship.status),
            type: toApiScholarshipType(newScholarship.type),
            barangayId: barangayId,
          },
        });
        await loadAdminData();
        return true;
      } catch {
        return false;
      }
    }

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
    setAdminScholarships((prev) => {
      const updated = [newEntry, ...prev];
      if (USE_MOCK) {
        localStorage.setItem("mock_scholarships", JSON.stringify(updated));
      }
      return updated;
    });
    return true;
  };

  const updateScholarship = async (updatedScholarship) => {
    if (!USE_MOCK) {
      try {
        const amountRaw = parseInt(String(updatedScholarship.amount || '').replace(/\D/g, ''), 10) || 0;
        const barangayId = updatedScholarship.barangayId || await resolveBarangayId();
        await apiRequest(`/api/scholarships/${updatedScholarship.id}`, {
          method: 'PUT',
          token,
          body: {
            title: updatedScholarship.title || updatedScholarship.name,
            description: updatedScholarship.description || '',
            requiredGwa: updatedScholarship.eligibility?.minGwa ?? 2.0,
            maxHouseholdIncome: amountRaw,
            eligibleCourses: (updatedScholarship.eligibility?.eligibleCourses || []).join(','),
            deadline: updatedScholarship.deadline,
            availableSlots: updatedScholarship.slots || 0,
            status: toApiScholarshipStatus(updatedScholarship.status),
            type: toApiScholarshipType(updatedScholarship.type),
            barangayId: barangayId,
          },
        });
        await loadAdminData();
        return true;
      } catch {
        return false;
      }
    }

    setAdminScholarships((prev) => {
      const updated = prev.map((s) =>
        s.id === updatedScholarship.id
          ? {
              ...s,
              ...updatedScholarship,
              amountRaw: parseInt(updatedScholarship.amount.replace(/\D/g, ""), 10) || 0,
            }
          : s
      );
      if (USE_MOCK) {
        localStorage.setItem("mock_scholarships", JSON.stringify(updated));
      }
      return updated;
    });
    return true;
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
