# Frontend File Walkthrough: `main.jsx`

This is the React application entry point.

## Imports

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
```

These imports set up React rendering, routing, global CSS, and the root app component.

## Render tree

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

What it does:

1. Finds the DOM root element.
2. Mounts React 18’s root.
3. Wraps the app in `StrictMode` for development checks.
4. Wraps the app in `BrowserRouter` so route navigation works.
