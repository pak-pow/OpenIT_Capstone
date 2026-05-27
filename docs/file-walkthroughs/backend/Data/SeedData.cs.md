# Backend File Walkthrough: `SeedData.cs`

This file is responsible for seeding demo data and keeping the seeded database aligned with the mock JSON fixtures.

## `EnsureSeededAsync`

```csharp
public static async Task EnsureSeededAsync(KaagapayContext context)
```

This is the entry point. It chooses one of three paths:

1. If scholarships already exist, it performs sync/cleanup work only.
2. If mock JSON exists, it seeds the database from that JSON.
3. If neither path is available, it falls back to a built-in demo dataset.

## Sync branch when data already exists

When scholarships already exist, the method updates stored scholarship fields from `MockDataJson.ScholarshipsJson` if the mock data changed.

Important snippet:

```csharp
if (s.Requirements != expectedReqs)
{
    s.Requirements = expectedReqs;
    changed = true;
}
```

This keeps the database aligned with the frontend fixture format without dropping existing rows.

### Auto-withdraw cleanup

```csharp
var studentsWithApproved = await context.Applications
    .Where(a => a.Status == ApplicationStatus.Approved)
    .Select(a => a.StudentId)
    .Distinct()
    .ToListAsync();
```

```csharp
foreach (var app in pendingApps) {
    app.Status = ApplicationStatus.Withdrawn;
    app.Remarks = "Auto-withdrawn because another scholarship was approved.";
}
```

This prevents a student from keeping multiple active pending applications after one scholarship has already been approved.

## Mock-data seeding branch

If `MockDataJson.ScholarshipsJson` is present, the method:

- Creates an admin account
- Creates a default barangay
- Imports scholarships from the frontend-shaped JSON
- Creates student accounts and student profiles from applicant JSON
- Creates applications by matching applicant programs to scholarship titles

Key mapping snippet:

```csharp
var s = new Scholarship
{
    Title = fs.Title ?? string.Empty,
    Term = "AY 2026-2027",
    Description = fs.Description ?? string.Empty,
    RequiredGwa = fs.Eligibility?.MinGwa ?? 0,
    MaxHouseholdIncome = fs.AmountRaw != 0 ? Convert.ToDecimal(fs.AmountRaw) : 0m,
    EligibleCourses = fs.Eligibility?.EligibleCourses != null ? string.Join('|', fs.Eligibility.EligibleCourses) : string.Empty,
    Requirements = fs.Requirements != null ? string.Join('|', fs.Requirements) : string.Empty,
    SpecialConditions = fs.Eligibility?.SpecialConditions != null ? string.Join('|', fs.Eligibility.SpecialConditions) : string.Empty,
    EligibleBarangays = fs.Eligibility?.EligibleBarangays != null ? string.Join('|', fs.Eligibility.EligibleBarangays) : string.Empty,
    Provider = fs.Provider ?? string.Empty,
    Deadline = ParseDateOrDefault(fs.Deadline, DateTime.UtcNow.AddMonths(1)),
    AvailableSlots = fs.Slots ?? 0,
    Status = (fs.Status != null && fs.Status.Equals("Active", StringComparison.OrdinalIgnoreCase)) ? ScholarshipStatus.Open : ScholarshipStatus.Closed,
    Type = MapTypeString(fs.Type),
    Barangay = barangay
};
```

This transforms frontend-readable JSON into normalized EF entities.

## Applicant import branch

Applicant JSON is used to create student users, student profiles, and applications.

Important snippet:

```csharp
var user = new AuthUser { Id = $"applicant-{idx}", UserName = userName, Role = "Student", CreatedAt = DateTime.UtcNow };
```

```csharp
var app = new Application
{
    StudentId = student.Id,
    ScholarshipId = scholarship.Id,
    Status = MapApplicationStatus(fa.Status),
    SubmittedAt = ParseDateOrDefault(fa.AppliedDate, DateTime.UtcNow)
};
```

This turns mock applicant rows into live student/application records.

## Fallback demo seed

If JSON fixtures are absent, the method seeds a smaller hardcoded dataset for admin, students, scholarships, applications, documents, and notifications.

## Helper methods

### `ParseDateOrDefault`

```csharp
private static DateTime ParseDateOrDefault(string? s, DateTime fallback)
```

Parses a date string safely and falls back to a default when parsing fails.

### `MapTypeString`

```csharp
private static ScholarshipType MapTypeString(string? t)
```

Maps loose text labels like private, NGO, LGU, or CHED into the domain enum.

### `MapApplicationStatus`

```csharp
private static ApplicationStatus MapApplicationStatus(string? s)
```

Maps JSON status strings into the application status enum.

### Embedded helper DTOs

`FrontendScholarship`, `FrontendEligibility`, and `FrontendApplicant` mirror the mock JSON shape so the seeder can deserialize the frontend fixtures directly.
