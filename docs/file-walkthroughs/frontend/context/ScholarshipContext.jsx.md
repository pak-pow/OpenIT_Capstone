# Frontend File Walkthrough: `ScholarshipContext.jsx`

This context owns scholarship loading, matching, applications, and dev simulation actions.

## Normalizers

### `normalizeScholarshipType(rawType)`

Converts backend enums or strings into a consistent display label like `Government`, `Private/NGO`, `Barangay`, or `LGU`.

### `normalizeScholarshipStatus(rawStatus)`

Converts backend status values into frontend labels such as `Active`, `Closed`, or `Archived`.

## `ScholarshipProvider`

The provider loads scholarships and applications from the API and keeps them in local state.

### Initial fetch effect

The `useEffect` block:

1. Fetches scholarships and applications.
2. Normalizes their shape for frontend rendering.
3. Refreshes every 15 seconds.

Key mapping behavior:

```jsx
const mappedScholarships = scholarships.map((s) => ({
  id: s.id,
  title: s.title,
  provider: s.provider || normalizeScholarshipType(s.type),
  type: normalizeScholarshipType(s.type),
  ...
}));
```

```jsx
const mappedApplications = (applicationsRes || []).map((app) => ({
  id: app.id,
  scholarshipId: app.scholarshipId,
  ...
}));
```

### `scholarshipsWithMatch`

This memoized value computes a match score for each scholarship using `computeMatch(userProfile || {}, s)` and sorts the list from best fit to worst fit.

### `activeScholarship`

This derived value finds the most recent approved application and treats it as the active scholarship.

### `hasApplied(scholarshipId)`

Checks whether the user has already applied to a scholarship.

### `applyToScholarship(scholarship)`

This is the student application action.

It blocks:

- missing profile
- an already active scholarship
- duplicate applications to the same scholarship

If the backend call succeeds, it optimistically adds a local pending application. If it fails with a profile error, it returns `missing_profile`.

### Simulation helpers

- `simulateApproval()` marks the first pending/under-review app as approved in dev mode.
- `simulateRejection()` marks the first pending/under-review app as rejected in dev mode.
- `simulateEnded()` marks the active scholarship as completed in dev mode.

These are demo helpers for keyboard shortcuts and local testing.

### Clear-state helpers

- `clearJustApproved(appId)`
- `clearJustRejected(appId)`
- `clearJustEnded(appId)`

These reset one-time UI flags after modals close.

## `useScholarships`

Exports the context hook used by the dashboard and scholarship views.
