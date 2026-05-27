# Backend — Models (walkthrough)

This file summarizes the domain models in `backend/Models`.

- `Application.cs` — Represents a student's application to a scholarship. Contains status, timestamps, references to `StudentProfile` and `Scholarship`, and possibly uploaded document references.
- `AuthUser.cs` — User account model used for authentication (username, email, hashed password, roles/claims).
- `Barangay.cs` — Represents a barangay (local administrative area) used for scoping scholarships and student addresses.
- `Document.cs` — Represents uploaded documents attached to an application, with metadata and validation status.
- `Notification.cs` — Notification entity stored for users (message, read/unread, type, createdAt).
- `Scholarship.cs` — Scholarship program entity with fields for name, provider, slots, requirements, term/dates, and navigation properties to applications.
- `StudentProfile.cs` — Student profile and demographics used by the match engine (GPA, income rank, address, contact details).
- `Enums.cs` — Shared enumerations (e.g., `ApplicationStatus`, `ScholarshipTerm`, `NotificationType`) used across models and DTOs.

Models map directly to database tables and are transformed to/from DTOs in the `Dtos` layer before being returned by controllers.
