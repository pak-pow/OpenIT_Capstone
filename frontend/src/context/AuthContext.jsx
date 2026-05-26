/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import { INCOME_RANK } from "../mockdata/constants";

const AuthContext = createContext(null);
const TOKEN_KEY = "kaagapay_token";
const USER_KEY = "kaagapay_user";

const incomeBracketToValue = (bracket) => {
  switch (bracket) {
    case "below-10k":
      return 10000;
    case "10k-20k":
      return 20000;
    case "20k-40k":
      return 40000;
    case "40k-60k":
      return 60000;
    case "above-60k":
      return 60001;
    default:
      return 0;
  }
};

const incomeValueToBracket = (value) => {
  if (!value && value !== 0) return "";
  if (value <= 10000) return "below-10k";
  if (value <= 20000) return "10k-20k";
  if (value <= 40000) return "20k-40k";
  if (value <= 60000) return "40k-60k";
  return "above-60k";
};

const parseYearLevel = (label) => {
  if (!label) return 1;
  const match = String(label).match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
};

const deriveFirstName = (fullName, fallback) => {
  if (fullName) return fullName.split(" ")[0];
  if (fallback) return fallback.split("@")[0];
  return "Student";
};

const buildProfileFromStudent = (student) => ({
  educationLevel: "",
  gwa: student?.gwa ?? "",
  yearLevel: student?.yearLevel ?? "",
  course: student?.course ?? "",
  city: "",
  barangay: student?.barangayName ?? "",
  incomeBracket: incomeValueToBracket(student?.householdIncome ?? 0),
  gender: "",
  isPwd: false,
  isSoloParent: false,
  isIndigenous: false,
  payment: {
    schoolName: student?.school ?? "",
    schoolEmail: "",
    schoolAccount: "",
  },
});

const buildStudentProfileDto = (form, userId) => ({
  userId,
  fullName: `${form.firstName} ${form.lastName}`.trim(),
  gwa: parseFloat(form.gwa) || 0,
  householdIncome: incomeBracketToValue(form.incomeBracket),
  course: form.course || "",
  yearLevel: parseYearLevel(form.yearLevel),
  school: form.schoolName || "",
  preferredScholarshipType: null,
  barangayId: 1,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const saveSession = (sessionToken, user) => {
    setToken(sessionToken);
    setCurrentUser(user);
    localStorage.setItem(TOKEN_KEY, sessionToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const clearSession = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const loadStudentProfile = async (sessionToken, authUser) => {
    try {
      const student = await apiRequest("/api/students/me", {
        token: sessionToken,
      });
      const profile = buildProfileFromStudent(student);
      const user = {
        id: authUser.id,
        userName: authUser.userName,
        role: authUser.role.toLowerCase(),
        firstName: deriveFirstName(student?.fullName, authUser.userName),
        profile,
      };
      saveSession(sessionToken, user);
      return profile;
    } catch (error) {
      const user = {
        id: authUser.id,
        userName: authUser.userName,
        role: authUser.role.toLowerCase(),
        firstName: deriveFirstName("", authUser.userName),
        profile: null,
      };
      saveSession(sessionToken, user);
      return null;
    }
  };

  const loginAsStudent = async ({ userName, password }) => {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { userName, password },
    });

    await loadStudentProfile(response.token, response.user);
  };

  const loginAsAdmin = async ({ userName, password }) => {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { userName, password },
    });

    const user = {
      id: response.user.id,
      userName: response.user.userName,
      role: response.user.role.toLowerCase(),
      firstName: deriveFirstName("", response.user.userName),
      profile: null,
    };
    saveSession(response.token, user);
  };

  const registerStudent = async (form) => {
    const response = await apiRequest("/api/auth/register", {
      method: "POST",
      body: {
        userName: form.email,
        password: form.password,
        role: "Student",
      },
    });

    const profileDto = buildStudentProfileDto(form, response.user.id);
    await apiRequest("/api/students", {
      method: "POST",
      token: response.token,
      body: profileDto,
    });

    const profile = buildProfileFromStudent({
      gwa: profileDto.gwa,
      course: profileDto.course,
      yearLevel: profileDto.yearLevel,
      householdIncome: profileDto.householdIncome,
      school: profileDto.school,
    });

    const user = {
      id: response.user.id,
      userName: response.user.userName,
      role: response.user.role.toLowerCase(),
      firstName: deriveFirstName(profileDto.fullName, response.user.userName),
      profile,
    };

    saveSession(response.token, user);
  };

  const logout = () => clearSession();

  const contextValue = useMemo(
    () => ({
      currentUser,
      token,
      loginAsStudent,
      loginAsAdmin,
      registerStudent,
      logout,
    }),
    [currentUser, token],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
