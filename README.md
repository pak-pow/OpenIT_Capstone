# Paldo: Barangay Scholarship System

Paldo is a full-stack scholarship application system (Capstone Project) that connects students and local government scholarship providers. This README summarizes how to run the project, available docs, and quick development workflows.

---

## Quick Links
- Backend docs: [docs/backend.md](docs/backend.md)
- Frontend docs: [docs/frontend.md](docs/frontend.md)
- Docker & Compose notes: [docs/docker.md](docs/docker.md)

---

## Architecture Overview

The repository contains two main components:

- `backend/` — ASP.NET Core Web API (C#, EF Core, PostgreSQL)
- `frontend/` — React + Vite Single Page Application

Both components are intended to run independently during development or together via Docker Compose.

---

## Quickstart — Local (native)

Prerequisites:
- Node.js v18+ (frontend)
- .NET 8.0 SDK (backend)
- PostgreSQL (or use the Docker DB from the Compose setup)

<<<<<<< HEAD
### Administrator Portal
* **Centralized Dashboard**: Provides administrators with a high-level overview of active scholarships, pending applications, disbursed funds, and approved scholars.
* **Program Management**: Create and configure new scholarships with a "Term End Date" that automatically dictates when an approved scholar's stipend concludes.
* **Application Processing**: Administrators can review, approve, or reject applications. (Note: Approving an application automatically withdraws the student's other pending applications to free up community slots).
* **Metrics and Analytics**: Built-in data visualization for monitoring approval rates and demographic distributions.

---

## Technology Stack

### Frontend
* **Framework**: React.js 18
* **Build Tool**: Vite (for optimized bundling and Fast Refresh)
* **Styling**: Vanilla CSS (implementing modern design aesthetics including Glassmorphism, CSS variables for theming, and responsive layouts)
* **Icons**: Lucide React
* **Data Management**: Context API with decoupled JSON mock data (scholarships, applicants, metrics) for localization and API simulation.

### Backend
* **Framework**: ASP.NET Core 8.0 Web API
* **Language**: C#
* **ORM**: Entity Framework Core
* **Database**: PostgreSQL
* **Architecture**: MVC Pattern (Models, Views/DTOs, Controllers)

---

## Project Structure

```text
OpenIT_Capstone/
├── backend/                       # ASP.NET Core Web API
│   ├── Controllers/               # API endpoint definitions
│   ├── Data/                      # Entity Framework DbContext & Migrations
│   ├── Dtos/                      # Data Transfer Objects for API requests/responses
│   ├── Models/                    # Database Domain Models
│   ├── appsettings.json           # Environment variables and DB connection strings
│   └── Program.cs                 # Application entry point and DI configuration
│
└── frontend/                      # React SPA (Vite)
    ├── public/                    # Static assets
    └── src/
        ├── assets/                # Images and local static files
        ├── components/            # Reusable UI components (layout, common, scholarships)
        ├── context/               # Global state management (AuthContext, ScholarshipContext)
        ├── mockdata/              # Local JSON files for decoupled API simulation
        ├── pages/                 # Full-page views (UserScreen, AdminDashboard, Login)
        ├── services/              # API and third-party service integrations
        ├── styles/                # Vanilla CSS modules and design tokens
        ├── utils/                 # Helper functions and formatters
        ├── App.jsx                # Root routing component
        └── main.jsx               # React DOM entry point
```

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* .NET 8.0 SDK
* PostgreSQL Server

### Frontend Configuration
The frontend can be run locally using the Vite development server.
=======
Frontend (dev server):
>>>>>>> 30d2348 (fix: readme instructions)

```bash
cd frontend
npm install
npm run dev
```

Backend (run locally):

```bash
cd backend
dotnet restore
dotnet run
```

By default Vite runs on port 5173 and the backend listens on the port configured in `appsettings.Development.json` (or as printed in the console). Use the frontend docs for proxy configuration details.

---

## Quickstart — Docker (recommended for parity)

<<<<<<< HEAD
For demonstration and development purposes, the frontend supports hidden developer hotkeys that allow you to simulate application lifecycle changes. These hotkeys trigger live authenticated API requests to the PostgreSQL database, perfectly synchronizing the Student and Admin dashboards:

* `Shift + 3` (or `#`): **Simulate Approval**. Approves the first pending application on the backend, decrements global available slots, and auto-withdraws the student's other pending applications.
* `Shift + 4` (or `$`): **Simulate Rejection**. Rejects the oldest pending application.
* `Shift + 5` (or `%`): **Simulate Application Completed**. Forcefully concludes an active (or pending) application by marking it as "Completed" (Status 6), mimicking the natural end of a term.
=======
Start the full stack (backend, frontend, database) using Docker Compose:

```bash
docker compose up --build
```

Notes:
- The Compose stack wires service hostnames (e.g., `db`) so the backend can connect to the database without changing localhost-based connection strings.
- See [docs/docker.md](docs/docker.md) for Dockerfile patterns and development tips.
>>>>>>> 30d2348 (fix: readme instructions)

---

## Project structure (high-level)

```
backend/    # ASP.NET Core API, controllers, services, EF Core migrations
frontend/   # React (Vite) app, components, pages, services
docs/       # Explanatory docs (backend, frontend, docker)
```

See the docs links above for per-file explanations and example snippets.

---

## Development tips

- Use `dotnet watch run` inside `backend/` for automatic recompiles while developing the API.
- Use the Vite dev server (`npm run dev`) for fast frontend iteration and hot reload.
- For end-to-end local parity use `docker compose up --build` and the included service networking.

---

## Tests

Unit and integration tests live under `backend/Kaagapay.Api.Tests` — run them with:

```bash
cd backend
dotnet test
```

---

## Contributing

Open a PR against `main`; include a short description of your change and any migration or configuration steps required.

---

If you want, I can add direct file links to each controller and service inside `docs/backend.md` for quick navigation or generate a `docker-compose.override.yml` optimized for local development with mounted volumes.
