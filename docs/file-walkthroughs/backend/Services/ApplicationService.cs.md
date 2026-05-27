# Backend File Walkthrough: `ApplicationService.cs`

This service controls application creation, querying, status transitions, and deletion.

## Constructor

```csharp
public ApplicationService(KaagapayContext context)
```

The service depends on EF Core context injection and uses it for all database work.

## `GetAllAsync(int? studentId, int? scholarshipId)`

This method loads applications with their scholarship and student relationships.

Important query shape:

```csharp
var query = _context.Applications
    .Include(a => a.Scholarship)
        .ThenInclude(s => s!.Barangay)
    .Include(a => a.Student)
    .AsNoTracking()
    .AsQueryable();
```

Optional filters:

```csharp
if (studentId.HasValue)
{
    query = query.Where(a => a.StudentId == studentId.Value);
}
```

```csharp
if (scholarshipId.HasValue)
{
    query = query.Where(a => a.ScholarshipId == scholarshipId.Value);
}
```

This is the read path used by admin and student lists.

## `GetByIdAsync(int id)`

Loads one application with full related data, again using `Include()` and `AsNoTracking()` so it can be converted to a DTO cleanly.

## `CreateAsync(ApplicationCreateDto dto)`

This method enforces the key application rules.

Steps:

1. Confirm the student exists.
2. Load the target scholarship and its applications.
3. Reject duplicate active applications for the same scholarship.
4. Reject submissions when slots are already full.
5. Create a new application with `Submitted` status.

Important checks:

```csharp
var hasActive = await _context.Applications.AnyAsync(a => 
    a.StudentId == dto.StudentId && 
    a.ScholarshipId == dto.ScholarshipId && 
    a.Status != ApplicationStatus.Rejected);
```

```csharp
var slotsFilled = scholarship.Applications.Count(a => a.Status == ApplicationStatus.Approved);
if (scholarship.AvailableSlots <= slotsFilled)
{
    throw new ArgumentException("This scholarship has no available slots left.");
}
```

This is the main guardrail for the student application flow.

## `UpdateStatusAsync(int id, ApplicationStatusUpdateDto dto)`

This method updates the status and handles side effects.

### Approve branch

If the new status is `Approved`, the service checks for any already-approved scholarship for the same student and rejects duplicate active awards.

It then auto-withdraws other pending applications for that student:

```csharp
var pendingApps = await _context.Applications
    .Where(a => a.StudentId == application.StudentId && a.Id != id && 
               (a.Status == ApplicationStatus.Submitted || 
                a.Status == ApplicationStatus.UnderReview || 
                a.Status == ApplicationStatus.NeedsInfo))
    .ToListAsync();
```

```csharp
foreach (var app in pendingApps)
{
    app.Status = ApplicationStatus.Withdrawn;
    app.Remarks = "Auto-withdrawn because another scholarship was approved.";
    app.ReviewedAt = DateTime.UtcNow;
}
```

### Completed branch

When the status becomes `Completed`, withdrawn applications are deleted so the student can apply again later if the scholarship remains open.

### Final update

The application status, remarks, and reviewed timestamp are saved, then the record is reloaded with navigation properties so the DTO can be rebuilt with full context.

## `DeleteAsync(int id)`

Deletes an application row when it exists and returns `false` if the id is missing.
