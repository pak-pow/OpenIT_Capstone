# Frontend — Components (walkthrough)

This file lists and describes the major component groups found in `frontend/src/components`.

- `components/layout/`:
  - `Sidebar.jsx` — Navigation component for student/admin sections.
  - `BottomNav.jsx` — Mobile bottom navigation.
  - `StudentLayout.jsx` / `AdminLayout.jsx` — Page shells providing consistent UI chrome.

- `components/scholarships/`:
  - `SmartMatchSection.jsx` — Shows matched scholarships and triggers `ApplyModal`.
  - `ApplyModal.jsx`, `PaldoModal.jsx`, `NotPaldoModal.jsx`, `EndedModal.jsx` — Modals for the application flow and alerts.
  - `AllScholarshipsView.jsx` — Lists all scholarships with filters.
  - `ApplicationStatusList.jsx` — Shows a student's application statuses.

- `components/admin/`:
  - `AdminScholarships.jsx` — Admin listing and management UI for scholarships.
  - `DataTable.jsx`, `MetricCards.jsx`, `CreateProgramModal.jsx` — Admin utilities for data and creation flows.

- `components/common/`:
  - `Toast.jsx` — Small notification toasts.
  - `SectionHeader.jsx` — Reusable section title with optional actions.
  - `LogoutModal.jsx` — Confirmation modal for logout.

Component design notes:
- Prefer small, focused components. Pages compose these into flows.
- Most components receive data via props and call `services/*` functions or `context` updaters for side effects.
