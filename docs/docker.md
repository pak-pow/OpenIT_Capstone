# Docker & Compose — Explanations

This doc explains the `Dockerfile`s and `docker-compose.yaml` in this repository and what each part does.

## `backend/Dockerfile`
- Purpose: containerize the ASP.NET Core backend for production or local testing.
- Common multi-stage pattern:
  1. Build stage: use `mcr.microsoft.com/dotnet/sdk` to restore, build, and publish the app.
  2. Runtime stage: copy published output into `mcr.microsoft.com/dotnet/aspnet` (smaller) and set the entrypoint.

Example (concept):

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet","backend.dll"]
```

What it does: produces a small runtime image with the compiled application ready to accept HTTP requests.

## `frontend/Dockerfile`
- Purpose: build the frontend assets and serve them from a static web server (nginx) or as a static bundle for hosting.
- Typical steps:
  1. `node` image to install and build production assets.
  2. Copy `dist/` into `nginx` image and configure `nginx.conf` for routing and SPA fallback.

Example (concept):

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

What it does: serves the compiled SPA over HTTP.

## `docker-compose.yaml`
- Purpose: orchestrate multi-container setup for local development (backend, frontend, DB, others).
- Common sections and meaning:
  - `services`: each service defines a container (`build` context or `image`, `ports`, `volumes`, `environment`).
  - `ports`: maps host port to container port (`HOST:CONTAINER`).
  - `volumes`: persist data (e.g., database files) or mount source code for live reload.
  - `depends_on`: controls start order (does not wait for readiness).

Example entries and what they mean:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "5000:80" # host 5000 -> container 80
    environment:
      - ConnectionStrings__Default=Server=... # example env var for DB

  frontend:
    build: ./frontend
    ports:
      - "3000:80"

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

What it does: starts the stack with networking so the frontend can call the backend and the backend can reach the DB using service hostnames like `db`.

## Environment and secrets
- Use environment variables for connection strings and JWT secrets. For local development prefer an `.env` file referenced by Compose or `appsettings.Development.json` for the backend.

## Development tips
- For iterative backend work, mount source into the container and run `dotnet watch` to get live reload (use a docker-compose override for dev).
- For frontend, mount `src/` into the container and use the dev server; for production builds, use the multi-stage build described above.

---
If you want, I can:
- Add file links to specific Dockerfiles in the repo.
- Generate a `docker-compose.override.yml` for dev with mounted volumes and watch commands.
