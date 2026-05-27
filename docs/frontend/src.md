# Frontend — `src/` Walkthrough

This file explains the important files under `frontend/src` and what they do.

- `main.jsx` — Application entry. Renders the React tree and applies global providers.
- `App.jsx` — Root router and layout switcher between student/admin flows.
- `api/client.js` and `services/*` — Centralized API client and resource services used by pages and components. Examples:
  - `services/apiClient.js` or `src/api/client.js` — Axios/fetch wrapper with base URL and interceptors.
  - `services/scholarshipService.js` — Functions to `getAll`, `getById`, `apply`, and `update` scholarships.
  - `services/authService.js` — Login, logout, register, and token handling.
  - `services/applicationService.js` — Submit/withdraw and query application endpoints.
- `context/*` — React contexts for `AuthContext.jsx`, `ScholarshipContext.jsx`, `AdminContext.jsx`.
- `pages/` — Route-level components: student dashboard (`UserDashboard.jsx`), auth pages (`LoginPage.jsx`, `RegisterPage.jsx`), admin views (`AdminOverview.jsx`, `AdminScholarships.jsx`).
- `components/` — Organized into subfolders (`layout`, `scholarships`, `admin`, `common`). Notable components:
  - `components/layout/StudentLayout.jsx` — Main shell for student screens (sidebar, header).
  - `components/scholarships/SmartMatchSection.jsx` — UI for smart-matching students to scholarships using `matchEngine.js`.
  - `components/admin/DataTable.jsx` — Generic table used in admin UIs.
- `utils/matchEngine.js` — Core client-side matching logic used to filter and sort scholarships for a student.
- `mockdata/` — Local JSON mocks used in development and demos (metrics, sample students, scholarships).
- `styles/` — CSS modules and global styles (variables, layout, components styling).

How components typically interact:
1. Page mounts, calls a `services/*` function to load data.
2. Data stored in `context/*` or local state.
3. Components render data and call service functions to mutate resources.
