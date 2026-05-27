# Backend File Walkthrough: `MappingExtensions.cs`

This file converts EF entities into API-friendly DTOs.

## `GetIncomeRank`

```csharp
private static int GetIncomeRank(decimal maxHouseholdIncome)
```

This helper converts a numeric household-income ceiling into a rank bucket used by eligibility logic.

## `ToDto(this Barangay barangay)`

```csharp
public static BarangayDto ToDto(this Barangay barangay)
```

Maps only the barangay id and name. This keeps the API payload small and stable.

## `ToDto(this StudentProfile student)`

This maps student identity, academic profile, household income, preferred scholarship type, and barangay display name.

Important detail:

```csharp
BarangayName = student.Barangay?.Name ?? string.Empty
```

This makes the frontend view independent from navigation loading logic.

## `ToDto(this Scholarship scholarship)`

This is the largest mapping function in the file. It builds a frontend-ready scholarship DTO with derived display fields.

Notable derived values:

```csharp
Provider = !string.IsNullOrWhiteSpace(scholarship.Provider) ? scholarship.Provider : (scholarship.Barangay != null ? scholarship.Barangay.Name : scholarship.Type.ToString())
```

```csharp
Amount = scholarship.MaxHouseholdIncome > 0 ? $"₱{scholarship.MaxHouseholdIncome:N0}" : string.Empty
```

```csharp
Requirements = !string.IsNullOrWhiteSpace(scholarship.Requirements) ? scholarship.Requirements.Split('|').Select(r => r.Trim()).ToArray() : Array.Empty<string>()
```

```csharp
SlotsFilled = scholarship.Applications?.Count(a => a.Status == Models.ApplicationStatus.Approved) ?? 0
```

This method turns the normalized database model into something the frontend can render directly, including provider display text, formatted amount, requirement arrays, eligibility arrays, and filled slot counts.

## `ToDto(this Application application)`

This method combines the application, scholarship, and student into one view model.

It derives:

- `StudentName`
- `ScholarshipName`
- `Provider`
- formatted `Amount`
- display-friendly `DateApplied`
- `Gpa`
- `Course`
- requirement list

This is the main bridge between EF entities and the dashboard tables/cards.

## `ToDto(this Document document)`

This maps document metadata without exposing internal navigation state.

## `ToDto(this Notification notification)`

This maps read/unread notification data and optional related-object pointers for the frontend notification UI.
