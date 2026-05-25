using Kaagapay.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Data;

public static class SeedData
{
    public static async Task EnsureSeededAsync(KaagapayContext context)
    {
        if (await context.Users.AnyAsync()
            || await context.Barangays.AnyAsync()
            || await context.Students.AnyAsync()
            || await context.Scholarships.AnyAsync())
        {
            return;
        }

        var passwordHasher = new PasswordHasher<AuthUser>();
        var users = new List<AuthUser>
        {
            new()
            {
                Id = "admin-01",
                UserName = "admin",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "student-ana",
                UserName = "ana",
                Role = "Student",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "student-miguel",
                UserName = "miguel",
                Role = "Student",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "student-rachel",
                UserName = "rachel",
                Role = "Student",
                CreatedAt = DateTime.UtcNow
            }
        };

        users[0].PasswordHash = passwordHasher.HashPassword(users[0], "Admin123!");
        users[1].PasswordHash = passwordHasher.HashPassword(users[1], "Student123!");
        users[2].PasswordHash = passwordHasher.HashPassword(users[2], "Student123!");
        users[3].PasswordHash = passwordHasher.HashPassword(users[3], "Student123!");

        var barangay = new Barangay { Name = "Barangay San Isidro" };

        var students = new List<StudentProfile>
        {
            new()
            {
                UserId = users[1].Id,
                FullName = "Ana Dela Cruz",
                Gwa = 1.75,
                HouseholdIncome = 15000m,
                Course = "BSIT",
                YearLevel = 2,
                School = "City University",
                Barangay = barangay
            },
            new()
            {
                UserId = users[2].Id,
                FullName = "Miguel Santos",
                Gwa = 2.25,
                HouseholdIncome = 32000m,
                Course = "BSBA",
                YearLevel = 3,
                School = "Metro College",
                Barangay = barangay
            },
            new()
            {
                UserId = users[3].Id,
                FullName = "Rachel Reyes",
                Gwa = 1.5,
                HouseholdIncome = 12000m,
                Course = "BSCS",
                YearLevel = 1,
                School = "City University",
                Barangay = barangay
            }
        };

        var scholarships = new List<Scholarship>
        {
            new()
            {
                Title = "Barangay Merit Grant",
                Description = "Merit-based assistance for top performing residents.",
                RequiredGwa = 2.0,
                MaxHouseholdIncome = 20000m,
                EligibleCourses = "BSIT,BSCS",
                Deadline = DateTime.UtcNow.AddMonths(1),
                AvailableSlots = 10,
                Status = ScholarshipStatus.Open,
                Barangay = barangay
            },
            new()
            {
                Title = "Needs-Based Scholar",
                Description = "Support for low-income students across all courses.",
                RequiredGwa = 2.5,
                MaxHouseholdIncome = 18000m,
                EligibleCourses = string.Empty,
                Deadline = DateTime.UtcNow.AddDays(21),
                AvailableSlots = 15,
                Status = ScholarshipStatus.Open,
                Barangay = barangay
            },
            new()
            {
                Title = "Business Track Support",
                Description = "Scholarship for business students with good standing.",
                RequiredGwa = 2.25,
                MaxHouseholdIncome = 35000m,
                EligibleCourses = "BSBA",
                Deadline = DateTime.UtcNow.AddDays(30),
                AvailableSlots = 8,
                Status = ScholarshipStatus.Open,
                Barangay = barangay
            }
        };

        context.Users.AddRange(users);
        context.Barangays.Add(barangay);
        context.Students.AddRange(students);
        context.Scholarships.AddRange(scholarships);
        await context.SaveChangesAsync();

        var applications = new List<Application>
        {
            new()
            {
                StudentId = students[0].Id,
                ScholarshipId = scholarships[0].Id,
                Status = ApplicationStatus.Submitted,
                SubmittedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                StudentId = students[1].Id,
                ScholarshipId = scholarships[2].Id,
                Status = ApplicationStatus.UnderReview,
                SubmittedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                StudentId = students[2].Id,
                ScholarshipId = scholarships[0].Id,
                Status = ApplicationStatus.Approved,
                SubmittedAt = DateTime.UtcNow.AddDays(-10),
                ReviewedAt = DateTime.UtcNow.AddDays(-3),
                Remarks = "Approved for first semester."
            }
        };

        context.Applications.AddRange(applications);
        await context.SaveChangesAsync();

        var documents = new List<Document>
        {
            new()
            {
                ApplicationId = applications[0].Id,
                Type = DocumentType.Indigency,
                FileName = "indigency-ana.pdf",
                FilePath = "/uploads/indigency-ana.pdf",
                Status = DocumentStatus.Verified,
                UploadedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                ApplicationId = applications[1].Id,
                Type = DocumentType.Grades,
                FileName = "grades-miguel.pdf",
                FilePath = "/uploads/grades-miguel.pdf",
                Status = DocumentStatus.Pending,
                UploadedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                ApplicationId = applications[2].Id,
                Type = DocumentType.SchoolId,
                FileName = "schoolid-rachel.pdf",
                FilePath = "/uploads/schoolid-rachel.pdf",
                Status = DocumentStatus.Verified,
                UploadedAt = DateTime.UtcNow.AddDays(-9)
            }
        };

        var notifications = new List<Notification>
        {
            new()
            {
                UserId = students[0].UserId,
                Title = "Application submitted",
                Message = "Your Barangay Merit Grant application is now submitted.",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                UserId = students[1].UserId,
                Title = "Application under review",
                Message = "Your Business Track Support application is under review.",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                UserId = students[2].UserId,
                Title = "Application approved",
                Message = "Congratulations! Your Barangay Merit Grant was approved.",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        context.Documents.AddRange(documents);
        context.Notifications.AddRange(notifications);
        await context.SaveChangesAsync();
    }
}
