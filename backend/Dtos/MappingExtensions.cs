using System;
using System.Linq;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Dtos;

public static class MappingExtensions
{
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
        BarangayId = student.BarangayId
    };

    public static ScholarshipDto ToDto(this Scholarship scholarship) => new()
    {
        Id = scholarship.Id,
        Title = scholarship.Title,
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
        Provider = scholarship.Barangay != null ? scholarship.Barangay.Name : scholarship.Type.ToString(),
        Amount = scholarship.MaxHouseholdIncome > 0 ? $"₱{scholarship.MaxHouseholdIncome:N0}" : string.Empty,
        AmountRaw = scholarship.MaxHouseholdIncome,
        Requirements = Array.Empty<string>(),
        Eligibility = new ScholarshipEligibilityDto
        {
            MinGwa = scholarship.RequiredGwa,
            MaxIncomeRank = 0,
            EligibleBarangays = Array.Empty<string>(),
            EligibleCourses = !string.IsNullOrWhiteSpace(scholarship.EligibleCourses) ? scholarship.EligibleCourses.Split(',').Select(c => c.Trim()).ToArray() : Array.Empty<string>(),
            SpecialConditions = Array.Empty<string>()
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
        Remarks = application.Remarks
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
