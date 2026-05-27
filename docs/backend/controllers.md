# Backend — Controllers (walkthrough)

This file lists the controllers in `backend/Controllers` and explains their responsibilities and common actions.

- `ApplicationsController.cs` — Handles scholarship application lifecycle: submit application, list applications for a student or scholarship, withdraw, and status transitions.
- `AuthController.cs` — Authentication endpoints: login, register, token issuance, and possibly refresh/revoke paths.
- `BarangaysController.cs` — CRUD endpoints for `Barangay` entities (list barangays, get by id), used for addresses and provider scopes.
- `DocumentsController.cs` — Upload, list, and validate required documents for applications (file handling, status checks).
- `EligibilityController.cs` — Endpoints that compute or expose eligibility rules and matching results between students and scholarships.
- `NotificationsController.cs` — Exposes endpoints to read/send notifications related to application updates, system messages, or admin alerts.
- `ScholarshipsController.cs` — Manage scholarship programs: create, update, list, search, enable/disable, and term/slot handling.
- `StudentsController.cs` — Student profile endpoints: fetch and update student profiles, view applications, and personal dashboard data.

Each controller follows the pattern:

1. Validate input (model binding + attributes)
2. Call a service in `Services/` to perform business logic
3. Map domain models to DTOs and return appropriate HTTP status codes

To inspect a specific controller, see the controller file in `backend/Controllers/`.
