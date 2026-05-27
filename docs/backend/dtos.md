# Backend — DTOs & Mapping (walkthrough)

This file covers `backend/Dtos` and `MappingExtensions.cs`.

- DTO files included:
  - `ApplicationDtos.cs` — DTOs for creating and returning application data.
  - `AuthDtos.cs` — DTOs for login/register and token responses.
  - `BarangayDtos.cs` — Simple DTOs for barangay payloads.
  - `DocumentDtos.cs` — DTOs for file upload metadata and validation responses.
  - `EligibilityDtos.cs` — DTOs exposing eligibility calculations and match summaries.
  - `NotificationDtos.cs` — DTOs for notifications returned to the client.
  - `ScholarshipDtos.cs` — DTOs for create/update/listing of scholarships.
  - `StudentProfileDtos.cs` — DTOs for student profile read/write operations.

- `MappingExtensions.cs` — Extension methods that map domain models to DTOs and vice versa. Example pattern:

```csharp
public static StudentDto ToDto(this StudentProfile model) => new StudentDto { Id = model.Id, FullName = model.FullName };
```

Why DTOs: They decouple internal models from API surface, reduce over-posting risks, and allow shaping of responses for clients.
