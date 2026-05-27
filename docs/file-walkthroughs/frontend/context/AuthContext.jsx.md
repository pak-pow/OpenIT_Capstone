# Frontend File Walkthrough: `AuthContext.jsx`

This context owns login, registration, logout, and session persistence.

## Stored keys

```jsx
const TOKEN_KEY = "kaagapay_token";
const USER_KEY = "kaagapay_user";
```

These are the localStorage keys used to restore the session after refresh.

## Helper functions

### `incomeBracketToValue(bracket)`

Converts a UI income-bracket label into a numeric ceiling for the backend profile payload.

### `incomeValueToBracket(value)`

Performs the reverse conversion when reading student profile data.

### `parseYearLevel(label)`

Extracts the numeric year level from labels like `1st Year` or `2nd Year`.

### `deriveFirstName(fullName, fallback)`

Builds a display first name from a student profile name or a username fallback.

### `buildProfileFromStudent(student)`

Creates the frontend profile shape from the backend student record.

This keeps the UI state consistent even when the backend returns a flatter entity.

## `AuthProvider`

This component loads existing session state from localStorage, exposes auth actions, and writes state back when the session changes.

### `saveSession(sessionToken, user)`

Stores both the token and user object in React state and localStorage.

### `clearSession()`

Clears the token and user from memory and storage.

### `loadStudentProfile(sessionToken, authUser)`

This is used after student login.

It:

1. Fetches `/api/students/me`.
2. Converts that record into the frontend profile shape.
3. Stores a full `currentUser` object with `role`, `firstName`, and `profile`.

If the profile fetch fails, it still creates a session with `profile: null`.

### `loginAsStudent({ userName, password })`

Logs in via `/api/auth/login`, then hydrates the student profile.

### `loginAsAdmin({ userName, password })`

Logs in via `/api/auth/login` and stores the admin session without student-profile hydration.

### `registerStudent(form)`

This is the largest method in the file.

It:

1. Registers the auth account at `/api/auth/register`.
2. Fetches barangays so the selected barangay can be matched to an id.
3. Builds the student profile DTO.
4. Posts the profile to `/api/students`.
5. Saves the resulting session.

Important snippet:

```jsx
const profileDto = {
  userId: response.user.id,
  fullName: `${form.firstName} ${form.lastName}`.trim(),
  gwa: parseFloat(form.gwa) || 0,
  householdIncome: incomeBracketToValue(form.incomeBracket),
  course: form.course || "",
  yearLevel: parseYearLevel(form.yearLevel),
  school: form.schoolName || "",
  preferredScholarshipType: null,
  barangayId: bId,
};
```

### `logout()`

Clears the session entirely.

## `useAuth`

Exports the context hook used across the app.
