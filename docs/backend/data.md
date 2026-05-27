# Backend — Data (walkthrough)

This file explains `backend/Data` files.

- `KaagapayContext.cs` — EF Core `DbContext`. Declares `DbSet<T>` for domain entities, configures indexes and relationships in `OnModelCreating`, and is the main entry point for database queries and updates.
- `SeedData.cs` — Helper for seeding initial data into the database on startup or during tests. Typically inserts sample scholarships, barangays, and admin/test users.
- `MockDataJson.cs` — Provides mock JSON data (used during development or tests) to populate the database or to simulate API responses.

Common patterns:

- `KaagapayContext` is injected into services via DI.
- Use LINQ or `Include()` for eager loading of navigation properties in services.
