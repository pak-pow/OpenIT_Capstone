# Frontend — Services & API (walkthrough)

This file documents the network layer and service modules used by the frontend.

- `api/client.js` (or `services/apiClient.js`) — Configures an Axios instance or `fetch` wrapper with base URL, JSON handling, and error interceptors.
- `services/authService.js` — Exposes `login`, `register`, `logout`, and token storage helpers. Called by `AuthContext`.
- `services/scholarshipService.js` — `getAll`, `getById`, `create`, `update`, and `apply` functions for scholarships.
- `services/applicationService.js` — Submit applications, fetch student applications, withdraw, and status updates.

Best practices in this codebase:
- Services return parsed JSON and throw on non-2xx responses so callers can `try/catch`.
- Token is stored in `localStorage` or managed by `AuthContext` and added to request headers by an interceptor.
