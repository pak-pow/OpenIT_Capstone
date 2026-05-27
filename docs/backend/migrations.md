# Backend — Migrations (walkthrough)

This file explains the EF Core migrations in `backend/Migrations`.

What they are:
- Each migration contains `Up()` and `Down()` methods describing schema changes. They are generated using `dotnet ef migrations add <Name>` and applied with `dotnet ef database update`.

Existing migration files (chronological):
- `20260526071646_InitialCreate` — initial schema scaffolding.
- `20260526072937_AddRequirementsToScholarship` — adds requirements table/fields for scholarships.
- `20260526123540_AddSpecialConditions` — adds special condition columns/relations.
- `20260526124537_AddProviderAndBarangays` — introduces provider entity and barangay relations.
- `20260526134937_AddScholarshipTerm` — adds scholarship term concept.
- `20260526141120_AddTermEndDate` — adds term end date field.

Tips:
- Keep migrations small and focused.
- Run migrations in CI or before deploying to ensure DB parity.
