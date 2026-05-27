# Paldo: Barangay Scholarship System

Paldo is a full-stack scholarship application system that connects students and local government scholarship providers. This README covers the repo layout, local and Docker startup, and links to the walkthrough docs.

## Quick Links
- Backend docs: [docs/backend.md](docs/backend.md)
- Frontend docs: [docs/frontend.md](docs/frontend.md)
- Docker docs: [docs/docker.md](docs/docker.md)
- File walkthroughs: [docs/file-walkthroughs/README.md](docs/file-walkthroughs/README.md)

## Architecture Overview

The repository contains two main parts:

- `backend/` - ASP.NET Core Web API with EF Core and PostgreSQL.
- `frontend/` - React + Vite single-page application.

Both can run independently in development or together via Docker Compose.

## Quickstart - Local

Prerequisites:

- Node.js v18+
- .NET 8.0 SDK
- PostgreSQL, or the Docker database from the Compose setup

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
dotnet restore
dotnet run
```

By default, Vite runs on port 5173. The backend port comes from `appsettings.Development.json` or the console output.

## Quickstart - Docker

Start the full stack with Docker Compose:

```bash
docker compose up --build
```

Notes:

- The Compose stack uses service hostnames so the backend can reach the database without changing localhost-based connection strings.
- See [docs/docker.md](docs/docker.md) for Dockerfile patterns and development tips.

## Project Structure

```text
backend/    # ASP.NET Core API, controllers, services, EF Core models and migrations
frontend/   # React (Vite) app, components, pages, services, and styles
docs/       # Overview docs and per-file walkthroughs
```

## Development Tips

- Use `dotnet watch run` inside `backend/` for automatic recompiles.
- Use the Vite dev server (`npm run dev`) for fast frontend iteration.
- For end-to-end local parity, use `docker compose up --build`.

## Tests

Run backend tests with:

```bash
cd backend
dotnet test
```

## Frontend Hotkeys

The frontend includes developer/demo shortcuts to simulate application lifecycle changes from the student dashboard:

- `Shift + 3` - simulate approval
- `Shift + 4` - simulate rejection
- `Shift + 5` - simulate completion/end

## Contributing

Open a PR against `main` and include any migration or configuration steps needed for your change.
