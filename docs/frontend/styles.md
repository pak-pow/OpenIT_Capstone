# Frontend — Styles (walkthrough)

This file lists the CSS files and explains organization under `frontend/src/styles`.

- `variables.css` — CSS variables (colors, spacing, type scale) used across the app.
- `reset.css` — CSS reset to normalize browser defaults.
- `layout.css`, `dashboard.css`, `student.css`, `admin.css` — Page and layout-specific rules.
- `components.css` — Shared component utility classes.
- `modal.css` — Modal styling used by several modal components.

Styling approach: vanilla CSS with modular file separation per area. Import `variables.css` early to enable variables in other files.
