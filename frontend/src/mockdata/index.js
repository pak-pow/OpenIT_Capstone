export const scholarships = [
  {
    id: 1,
    title: "Mayor's Educational Assistance",
    matchPercentage: 98,
    amount: "₱10,000",
    deadline: "2026-08-15"
  },
  {
    id: 2,
    title: "Barangay Academic Excellence",
    matchPercentage: 85,
    amount: "₱5,000",
    deadline: "2026-09-01"
  },
  {
    id: 3,
    title: "Sangguniang Kabataan Sports Grant",
    matchPercentage: 70,
    amount: "₱3,000",
    deadline: "2026-07-30"
  }
];

export const applications = [
  {
    id: 101,
    scholarshipName: "Mayor's Educational Assistance",
    dateApplied: "2026-05-20",
    status: "Under Review"
  },
  {
    id: 102,
    scholarshipName: "Barangay Academic Excellence",
    dateApplied: "2026-04-15",
    status: "Approved"
  },
  {
    id: 103,
    scholarshipName: "City IT Scholarship",
    dateApplied: "2026-05-24",
    status: "Pending"
  }
];

export const applicants = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    program: "Mayor's Educational Assistance",
    gpa: "1.25",
    appliedDate: "2026-05-20",
    status: "Under Review"
  },
  {
    id: 2,
    name: "Maria Clara",
    program: "Barangay Academic Excellence",
    gpa: "1.10",
    appliedDate: "2026-05-18",
    status: "Approved"
  },
  {
    id: 3,
    name: "Jose Rizal",
    program: "Mayor's Educational Assistance",
    gpa: "1.50",
    appliedDate: "2026-05-22",
    status: "Pending"
  }
];

export const metrics = {
  activeScholarships: 12,
  pendingApplications: 45,
  approvedScholars: 128
};
