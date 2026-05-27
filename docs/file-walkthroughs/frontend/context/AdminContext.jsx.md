# Frontend File Walkthrough: `AdminContext.jsx`

This context owns the admin dashboard data and mutating actions.

## Normalizers

### `normalizeScholarshipType(rawType)`

Converts backend scholarship type values to readable admin labels.

### `normalizeScholarshipStatus(rawStatus)`

Normalizes scholarship status values to `Active`, `Closed`, or `Archived`.

### `normalizeAppStatus(rawStatus)`

Converts application statuses into admin-friendly labels like `Pending`, `Under Review`, `Approved`, `Rejected`, `Withdrawn`, and `Completed`.

## `AdminProvider`

This provider loads admin scholarships and applicants when a token exists.

### Loading effect

The `useEffect` block fetches `/api/scholarships` and `/api/applications`, then maps both payloads into local state shapes.

### `adminMetrics`

This memoized object computes:

- active scholarship count
- pending application count
- approved scholar count
- estimated disbursed funds

### `approveApplicant(id)`

Approves one application via the backend and then locally withdraws other pending/under-review applications belonging to the same student.

### `rejectApplicant(id)`

Marks an application as rejected both on the backend and in local state.

### `endScholarship(id)`

Calls the backend scholarship-end endpoint, marks the scholarship closed locally, then refreshes the application list.

### `createScholarship(newScholarship)`

Builds the backend DTO from the UI form and posts it to `/api/scholarships`, then reloads the scholarship list.

### `updateScholarship(updatedScholarship)`

Sends a PUT update to the backend and refreshes the local scholarship list afterward.

## `useAdminContext`

Exports the context hook used by the admin dashboard pages and modals.
