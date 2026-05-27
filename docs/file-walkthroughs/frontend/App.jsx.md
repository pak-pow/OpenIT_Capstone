# Frontend File Walkthrough: `App.jsx`

This file defines the app router, authentication gates, toast state, and keyboard shortcuts.

## `ProtectedRoute`

```jsx
const ProtectedRoute = ({ children, allowedRole }) => { ... }
```

What it does:

- Reads the current session from `useAuth()`.
- Redirects unauthenticated users to `/login`.
- Redirects logged-in users to the correct dashboard if their role does not match the route.

This is the main auth boundary for admin and student routes.

## `RootRedirect`

```jsx
const RootRedirect = () => { ... }
```

This sends users away from `/` to the correct page based on login state:

- not logged in -> `/login`
- admin -> `/admin`
- student -> `/student`

## `StudentWrapper`

This wraps the student dashboard in `ScholarshipProvider` and passes the current student profile into it.

## `InnerApp`

This is where the route table and toast state live.

### Toast helpers

```jsx
const [toasts, setToasts] = useState([]);
```

```jsx
const addToast = useCallback((message, type = "success") => { ... }, []);
```

```jsx
const removeToast = useCallback((id) => { ... }, []);
```

These functions drive the shared toast system used across the dashboard and admin screens.

### Keyboard shortcuts

The `useEffect` handler listens for global key shortcuts when the user is not typing in an input:

- `Shift + \` or `Shift + |` -> admin login
- `Shift + 1` -> student login
- `Shift + 2` -> register

This is a developer/demo convenience feature.

### Routes

```jsx
<Route path="/admin/*" element={...} />
<Route path="/student/*" element={...} />
```

The app routes public auth pages separately from protected dashboard flows.

## `App`

The exported `App` component only provides `AuthProvider` and renders `InnerApp`.

That keeps the session state available to every route and child component.
