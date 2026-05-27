# Backend — Services (walkthrough)

This file lists `backend/Services` files and explains the responsibilities of each service.

- `ApplicationService.cs` — Core application logic for creating, updating, and querying scholarship applications. Handles status transitions and ensures business rules (e.g., withdrawing other pending apps when one is approved).
- `AuthService.cs` — Authentication and user management logic: password hashing, credential verification, user lookup, and integration with `JwtOptions` for token creation.
- `BarangayService.cs` — CRUD and lookup operations for barangays used in student addresses and provider-scoped filters.
- `DocumentService.cs` — Handles file metadata, storage coordination (if any), and document validation for application requirements.
- `EligibilityService.cs` — Encapsulates eligibility logic used by `EligibilityController` and the match engine; computes whether a student meets scholarship requirements.
- `JwtOptions.cs` — Holds JWT configuration (Issuer, Audience, SigningKey, Expiration) and helper methods; used by `AuthService` and middleware configuration.
- `NotificationService.cs` — Creates and retrieves notifications for users and admins; may integrate with background jobs or real-time push.
- `ScholarshipService.cs` — CRUD and business logic for scholarships, slot management, term handling, and requirement evaluation.
- `StudentProfileService.cs` — Manage student profiles, mappings to DTOs, and queries used by student-facing endpoints.

Services are registered with DI in `Program.cs` and typically accept `KaagapayContext` via constructor injection.
