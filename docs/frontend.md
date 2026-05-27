# Frontend — Code Overview and Snippets

This document explains the main frontend files and folders, their responsibilities, and example snippets (Vite + React). Use it as a quick reference for the UI code.

## Project layout
- Top-level: `package.json`, `vite.config.js`, `index.html`, `src/`, `public/`.
- `src/main.jsx`: application entry — mounts React app, global providers, router.
- `src/App.jsx`: root component handling top-level routes and layout.

Example `main.jsx` responsibilities:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App/>);
```

What it does: initializes the React tree and loads CSS/global context.

## `src/components/`
- Purpose: Reusable UI components (buttons, forms, cards, lists).
- What they do: encapsulate presentational logic and local state. Keep them small and pure when possible.

Component snippet pattern:

```jsx
export default function StudentCard({student}){
  return <div className="card">{student.fullName}</div>;
}
```

## `src/pages/`
- Purpose: Route-level components (pages) that compose components and call services.
- What they do: load data on mount, manage page-level loading / error states, render UI.

## `src/services/` and `src/api/`
- Purpose: Centralize HTTP calls and business-facing client logic.
- Typical pattern: one module per resource, returning parsed JSON and throwing on errors.

Example API client snippet (pseudo):

```js
import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
export const getStudents = () => api.get('/students').then(r => r.data);
```

What it does: encapsulates network layer, so components call `getStudents()` instead of `fetch()` directly.

## `src/context/`
- Purpose: React Contexts for auth, global UI state, or configuration.
- What they do: provide state and updater functions to deep component trees (e.g., `AuthContext` supplies `user`, `login()`, `logout()`).

## Styling and assets
- `src/index.css` (or other files in `src/styles/`) hold global CSS variables and utility classes.
- `src/assets/` contains images, icons and static resources.

## `vite.config.js` and dev server
- Purpose: Vite configuration for dev server, proxies, build options.
- Common responsibility in this repo: proxy `/api` to backend server during development, e.g.:

```js
server: { proxy: { '/api': 'http://localhost:5000' } }
```

What it does: simplifies local development by forwarding API calls to the backend.

## `Dockerfile` (frontend)
- Purpose: build the React app and serve it (often with a lightweight web server like `nginx` or `serve`).
- Typical steps:
  1. Use node image to `npm install` + `npm run build`.
  2. Copy `dist` to an nginx image and expose HTTP port.

## `package.json`
- Purpose: lists dependencies, scripts (`dev`, `build`, `preview`, `lint`).
- What it does: scripts are used locally and by CI and Docker build steps.

---
If you want, I can generate a per-file breakdown linking directly to files in the repo, or expand the `services/` section with real code examples from `src/services`.
