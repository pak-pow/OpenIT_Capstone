# Database schema

This document summarizes the database schema (EF Core models) used by the backend.

- Database: PostgreSQL (connection string in `backend/appsettings.json`)
- Migrations: `backend/Migrations`
- ORM: Entity Framework Core (`KaagapayContext`)

## Tables

### AuthUsers
- Primary key: `Id` (string, GUID-ish)
- Columns:
  - `Id` : text (PK)
  - `UserName` : text
  - `PasswordHash` : text
  - `Role` : text (default: "Student")
  - `CreatedAt` : timestamp
- Notes: Stores user accounts used for authentication. JWT tokens issued by `AuthService` contain the user id and role.

### StudentProfiles
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `UserId` : text (FK -> `AuthUsers.Id`)
  - `FullName` : text
  - `Gwa` : double precision
  - `HouseholdIncome` : numeric
  - `Course` : text
  - `YearLevel` : integer
  - `School` : text
  - `PreferredScholarshipType` : integer / enum (nullable)
  - `BarangayId` : integer (FK -> `Barangays.Id`)
- Relations: many StudentProfiles -> one `Barangay`; one StudentProfile -> many `Applications`.

### Barangays
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `Name` : text
- Relations: `Barangay` -> many `Students`; `Barangay` -> many `Scholarships`.

### Scholarships
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `Title` : text
  - `Term` : text
  - `TermEndDate` : timestamp (nullable)
  - `Description` : text
  - `Provider` : text
  - `RequiredGwa` : double precision
  - `MaxHouseholdIncome` : numeric
  - `EligibleCourses` : text (comma/list)
  - `EligibleBarangays` : text (comma/list)
  - `Requirements` : text
  - `SpecialConditions` : text
  - `Deadline` : timestamp
  - `AvailableSlots` : integer
  - `Status` : integer / enum (ScholarshipStatus)
  - `Type` : integer / enum (ScholarshipType)
  - `BarangayId` : integer (FK -> `Barangays.Id`)
- Relations: one Scholarship -> many `Applications`.

### Applications
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `ScholarshipId` : integer (FK -> `Scholarships.Id`)
  - `StudentId` : integer (FK -> `StudentProfiles.Id`)
  - `Status` : integer / enum (ApplicationStatus)
  - `SubmittedAt` : timestamp
  - `ReviewedAt` : timestamp (nullable)
  - `Remarks` : text (nullable)
- Relations: one Application -> many `Documents`.

### Documents
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `ApplicationId` : integer (FK -> `Applications.Id`)
  - `Type` : integer / enum (DocumentType)
  - `FileName` : text
  - `FilePath` : text (stored relative path under `App_Data/uploads`)
  - `Status` : integer / enum (DocumentStatus)
  - `UploadedAt` : timestamp
- Notes: Files are stored on disk; DB stores metadata and the relative path.

### Notifications
- Primary key: `Id` (integer)
- Columns:
  - `Id` : integer (PK)
  - `UserId` : text (FK -> `AuthUsers.Id`)
  - `Title` : text
  - `Message` : text
  - `IsRead` : boolean
  - `CreatedAt` : timestamp
  - `RelatedType` : text (optional)
  - `RelatedId` : integer (optional)
- Notes: Simple per-user notifications referencing other entities by `RelatedType`/`RelatedId`.

## Enums (stored as integers by default)
- `ScholarshipStatus`: Open, Closed, Archived
- `ScholarshipType`: Government, Private, Ngo
- `ApplicationStatus`: Submitted, UnderReview, Approved, Rejected, NeedsInfo, Withdrawn, Completed
- `DocumentType`: Indigency, Clearance, Grades, SchoolId, ValidId, Others
- `DocumentStatus`: Pending, Verified, Rejected

## Keys & Relations Summary
- `StudentProfiles.UserId` -> `AuthUsers.Id`
- `StudentProfiles.BarangayId` -> `Barangays.Id`
- `Scholarships.BarangayId` -> `Barangays.Id`
- `Applications.ScholarshipId` -> `Scholarships.Id`
- `Applications.StudentId` -> `StudentProfiles.Id`
- `Documents.ApplicationId` -> `Applications.Id`
- `Notifications.UserId` -> `AuthUsers.Id`

## Notes & operational details
- Connection string: `backend/appsettings.json` (`DefaultConnection`).
- JWT: `AuthService` issues tokens (claims include `NameIdentifier` == `AuthUser.Id` and `Role`) which are used by controllers to authorize access to resources.
- File uploads: stored under the app content root `App_Data/uploads`; `Document.FilePath` stores the relative path.
- Migrations present in `backend/Migrations` reflect the model structure; check the migrations for precise column types, defaults, and constraints.

---
Generated from EF Core model classes in `backend/Models` on May 28, 2026.
