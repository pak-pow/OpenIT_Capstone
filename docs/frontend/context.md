# Frontend — Contexts (walkthrough)

This file explains React Contexts under `frontend/src/context`.

- `AuthContext.jsx` — Provides `user`, `login()`, `logout()` and token state to the app. It wraps `AuthService` calls and exposes authentication state to components.
- `ScholarshipContext.jsx` — Holds current scholarship lists, filters, and match results. Pages that need scholarship data subscribe to this context.
- `AdminContext.jsx` — Admin-specific state (selected program, filters, active modals) used by the admin dashboard.

Pattern:
1. Context provider maintains state and exposes actions as functions.
2. Components call context actions instead of calling services directly when state must be shared.
