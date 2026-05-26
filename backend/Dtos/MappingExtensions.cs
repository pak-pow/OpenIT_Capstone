using System;
using System.Linq;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Dtos;

public static class MappingExtensions
{
    private static int GetIncomeRank(decimal maxHouseholdIncome)
    {
        if (maxHouseholdIncome <= 10000m) return 1;
        if (maxHouseholdIncome <= 20000m) return 2;
        if (maxHouseholdIncome <= 40000m) return 3;
        if (maxHouseholdIncome <= 60000m) return 4;
        return 5;
    }

    public static BarangayDto ToDto(this Barangay barangay) => new()
    {
        Id = barangay.Id,
        Name = barangay.Name
    };

    public static StudentProfileDto ToDto(this StudentProfile student) => new()
    {
        Id = student.Id,
        UserId = student.UserId,
        FullName = student.FullName,
        Gwa = student.Gwa,
        HouseholdIncome = student.HouseholdIncome,
        Course = student.Course,
        YearLevel = student.YearLevel,
        School = student.School,
        PreferredScholarshipType = student.PreferredScholarshipType,
        BarangayId = student.BarangayId,
        BarangayName = student.Barangay?.Name ?? string.Empty
    };

    public static ScholarshipDto ToDto(this Scholarship scholarship) => new()
    {
        Id = scholarship.Id,
        Title = scholarship.Title,
        Term = scholarship.Term,
        TermEndDate = scholarship.TermEndDate,
        Description = scholarship.Description,
        RequiredGwa = scholarship.RequiredGwa,
        MaxHouseholdIncome = scholarship.MaxHouseholdIncome,
        EligibleCourses = scholarship.EligibleCourses,
        Deadline = scholarship.Deadline,
        AvailableSlots = scholarship.AvailableSlots,
        Status = scholarship.Status,
        Type = scholarship.Type,
        BarangayId = scholarship.BarangayId,
        // frontend-friendly
        Provider = !string.IsNullOrWhiteSpace(scholarship.Provider) ? scholarship.Provider : (scholarship.Barangay != null ? scholarship.Barangay.Name : scholarship.Type.ToString()),
        Amount = scholarship.MaxHouseholdIncome > 0 ? $"₱{scholarship.MaxHouseholdIncome:N0}" : string.Empty,
        AmountRaw = scholarship.MaxHouseholdIncome,
        Requirements = !string.IsNullOrWhiteSpace(scholarship.Requirements) ? scholarship.Requirements.Split('|').Select(r => r.Trim()).ToArray() : Array.Empty<string>(),
        Eligibility = new ScholarshipEligibilityDto
        {
            MinGwa = scholarship.RequiredGwa,
            MaxIncomeRank = GetIncomeRank(scholarship.MaxHouseholdIncome),
            EligibleBarangays = !string.IsNullOrWhiteSpace(scholarship.EligibleBarangays) ? scholarship.EligibleBarangays.Split('|').Select(b => b.Trim()).ToArray() : Array.Empty<string>(),
            EligibleCourses = !string.IsNullOrWhiteSpace(scholarship.EligibleCourses) ? scholarship.EligibleCourses.Split('|').Select(c => c.Trim()).ToArray() : Array.Empty<string>(),
            SpecialConditions = !string.IsNullOrWhiteSpace(scholarship.SpecialConditions) ? scholarship.SpecialConditions.Split('|').Select(s => s.Trim()).ToArray() : Array.Empty<string>()
        },
        SlotsFilled = scholarship.Applications?.Count(a => a.Status == Models.ApplicationStatus.Approved) ?? 0
    };

    public static ApplicationDto ToDto(this Application application) => new()
    {
        Id = application.Id,
        ScholarshipId = application.ScholarshipId,
        StudentId = application.StudentId,
        Status = application.Status,
        SubmittedAt = application.SubmittedAt,
        ReviewedAt = application.ReviewedAt,
        Remarks = application.Remarks,
        StudentName = application.Student?.FullName,
        ScholarshipName = application.Scholarship?.Title,
        Provider = application.Scholarship != null 
            ? (!string.IsNullOrWhiteSpace(application.Scholarship.Provider) ? application.Scholarship.Provider : (application.Scholarship.Barangay != null ? application.Scholarship.Barangay.Name : application.Scholarship.Type.ToString()))
            : null,
        Amount = application.Scholarship != null
            ? (application.Scholarship.MaxHouseholdIncome > 0 ? $"₱{application.Scholarship.MaxHouseholdIncome:N0}" : string.Empty)
            : null,
        DateApplied = application.SubmittedAt.ToString("yyyy-MM-dd"),
        Gpa = application.Student?.Gwa.ToString("0.00") ?? "N/A"
    };

    public static DocumentDto ToDto(this Document document) => new()
    {
        Id = document.Id,
        ApplicationId = document.ApplicationId,
        Type = document.Type,
        FileName = document.FileName,
        FilePath = document.FilePath,
        Status = document.Status,
        UploadedAt = document.UploadedAt
    };

    public static NotificationDto ToDto(this Notification notification) => new()
    {
        Id = notification.Id,
        UserId = notification.UserId,
        Title = notification.Title,
        Message = notification.Message,
        IsRead = notification.IsRead,
        CreatedAt = notification.CreatedAt,
        RelatedType = notification.RelatedType,
        RelatedId = notification.RelatedId
    };
}
