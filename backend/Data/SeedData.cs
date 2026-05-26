using Kaagapay.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;

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
        // Try to seed from frontend mockdata if available
        var frontendScholarshipsPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "src", "mockdata", "scholarships.json");
        var frontendApplicantsPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "src", "mockdata", "applicants.json");

        if (File.Exists(frontendScholarshipsPath))
        {
            var passwordHasher = new PasswordHasher<AuthUser>();
            var raw = await File.ReadAllTextAsync(frontendScholarshipsPath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var frontendScholarships = JsonSerializer.Deserialize<List<FrontendScholarship>>(raw, options) ?? new List<FrontendScholarship>();

            // create default barangay
            var barangay = new Barangay { Name = "Seed Barangay" };

            var users = new List<AuthUser>
            {
                new() { Id = "admin-01", UserName = "admin", Role = "Admin", CreatedAt = DateTime.UtcNow }
            };
            users[0].PasswordHash = passwordHasher.HashPassword(users[0], "Admin123!");

            var scholarships = new List<Scholarship>();
            foreach (var fs in frontendScholarships)
            {
                var s = new Scholarship
                {
                    Title = fs.Title,
                    Description = fs.Description ?? string.Empty,
                    RequiredGwa = fs.Eligibility?.MinGwa ?? 0,
                    MaxHouseholdIncome = fs.AmountRaw != 0 ? Convert.ToDecimal(fs.AmountRaw) : 0m,
                    EligibleCourses = fs.Eligibility?.EligibleCourses != null ? string.Join(',', fs.Eligibility.EligibleCourses) : string.Empty,
                    Deadline = ParseDateOrDefault(fs.Deadline, DateTime.UtcNow.AddMonths(1)),
                    AvailableSlots = fs.Slots ?? 0,
                    Status = (fs.Status != null && fs.Status.Equals("Active", StringComparison.OrdinalIgnoreCase)) ? ScholarshipStatus.Open : ScholarshipStatus.Closed,
                    Type = MapTypeString(fs.Type),
                    Barangay = barangay
                };
                scholarships.Add(s);
            }

            context.Users.AddRange(users);
            context.Barangays.Add(barangay);
            context.Scholarships.AddRange(scholarships);
            await context.SaveChangesAsync();

            // Seed applicants if file exists
            if (File.Exists(frontendApplicantsPath))
            {
                var rawApplicants = await File.ReadAllTextAsync(frontendApplicantsPath);
                var frontendApplicants = JsonSerializer.Deserialize<List<FrontendApplicant>>(rawApplicants, options) ?? new List<FrontendApplicant>();

                var studentUsers = new List<AuthUser>();
                var students = new List<StudentProfile>();
                var applications = new List<Application>();

                var idx = 1;
                foreach (var fa in frontendApplicants)
                {
                    var user = new AuthUser { Id = $"applicant-{idx}", UserName = fa.Name.Replace(' ', '.').ToLowerInvariant(), Role = "Student", CreatedAt = DateTime.UtcNow };
                    user.PasswordHash = passwordHasher.HashPassword(user, "Student123!");
                    studentUsers.Add(user);

                    var student = new StudentProfile
                    {
                        UserId = user.Id,
                        FullName = fa.Name,
                        Gwa = double.TryParse(fa.Gpa, out var g) ? g : 0,
                        HouseholdIncome = 20000m,
                        Course = "",
                        YearLevel = 1,
                        School = string.Empty,
                        Barangay = barangay
                    };
                    students.Add(student);
                    idx++;
                }

                context.Users.AddRange(studentUsers);
                context.Students.AddRange(students);
                await context.SaveChangesAsync();

                // create applications by matching program title to scholarship title
                foreach (var fa in frontendApplicants)
                {
                    var student = students.FirstOrDefault(s => s.FullName == fa.Name);
                    var scholarship = context.Scholarships.FirstOrDefault(s => s.Title == fa.Program);
                    if (student is null || scholarship is null) continue;

                    var app = new Application
                    {
                        StudentId = student.Id,
                        ScholarshipId = scholarship.Id,
                        Status = MapApplicationStatus(fa.Status),
                        SubmittedAt = ParseDateOrDefault(fa.AppliedDate, DateTime.UtcNow)
                    };
                    applications.Add(app);
                }

                context.Applications.AddRange(applications);
                await context.SaveChangesAsync();
            }

            return;
        }

        // Fallback: original inline seed
        var fallbackPasswordHasher = new PasswordHasher<AuthUser>();
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

        users[0].PasswordHash = fallbackPasswordHasher.HashPassword(users[0], "Admin123!");
        users[1].PasswordHash = fallbackPasswordHasher.HashPassword(users[1], "Student123!");
        users[2].PasswordHash = fallbackPasswordHasher.HashPassword(users[2], "Student123!");
        users[3].PasswordHash = fallbackPasswordHasher.HashPassword(users[3], "Student123!");

        var barangayFallback = new Barangay { Name = "Barangay San Isidro" };

        var studentsFallback = new List<StudentProfile>
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
                PreferredScholarshipType = ScholarshipType.Government,
                Barangay = barangayFallback
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
                Barangay = barangayFallback
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
                Barangay = barangayFallback
            }
        };

        var scholarshipsFallback = new List<Scholarship>
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
                Type = ScholarshipType.Government,
                Barangay = barangayFallback
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
                Type = ScholarshipType.Ngo,
                Barangay = barangayFallback
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
                Type = ScholarshipType.Private,
                Barangay = barangayFallback
            }
        };

        context.Users.AddRange(users);
        context.Barangays.Add(barangayFallback);
        context.Students.AddRange(studentsFallback);
        context.Scholarships.AddRange(scholarshipsFallback);
        await context.SaveChangesAsync();

        var applicationsFallback = new List<Application>
        {
            new()
            {
                StudentId = studentsFallback[0].Id,
                ScholarshipId = scholarshipsFallback[0].Id,
                Status = ApplicationStatus.Submitted,
                SubmittedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                StudentId = studentsFallback[1].Id,
                ScholarshipId = scholarshipsFallback[2].Id,
                Status = ApplicationStatus.UnderReview,
                SubmittedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                StudentId = studentsFallback[2].Id,
                ScholarshipId = scholarshipsFallback[0].Id,
                Status = ApplicationStatus.Approved,
                SubmittedAt = DateTime.UtcNow.AddDays(-10),
                ReviewedAt = DateTime.UtcNow.AddDays(-3),
                Remarks = "Approved for first semester."
            }
        };

        context.Applications.AddRange(applicationsFallback);
        await context.SaveChangesAsync();

        var documentsFallback = new List<Document>
        {
            new()
            {
                ApplicationId = applicationsFallback[0].Id,
                Type = DocumentType.Indigency,
                FileName = "indigency-ana.pdf",
                FilePath = "/uploads/indigency-ana.pdf",
                Status = DocumentStatus.Verified,
                UploadedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                ApplicationId = applicationsFallback[1].Id,
                Type = DocumentType.Grades,
                FileName = "grades-miguel.pdf",
                FilePath = "/uploads/grades-miguel.pdf",
                Status = DocumentStatus.Pending,
                UploadedAt = DateTime.UtcNow.AddDays(-4)
            },
            new()
            {
                ApplicationId = applicationsFallback[2].Id,
                Type = DocumentType.SchoolId,
                FileName = "schoolid-rachel.pdf",
                FilePath = "/uploads/schoolid-rachel.pdf",
                Status = DocumentStatus.Verified,
                UploadedAt = DateTime.UtcNow.AddDays(-9)
            }
        };

        var notificationsFallback = new List<Notification>
        {
            new()
            {
                UserId = studentsFallback[0].UserId,
                Title = "Application submitted",
                Message = "Your Barangay Merit Grant application is now submitted.",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                UserId = studentsFallback[1].UserId,
                Title = "Application under review",
                Message = "Your Business Track Support application is under review.",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                UserId = studentsFallback[2].UserId,
                Title = "Application approved",
                Message = "Congratulations! Your Barangay Merit Grant was approved.",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        context.Documents.AddRange(documentsFallback);
        context.Notifications.AddRange(notificationsFallback);
        await context.SaveChangesAsync();
    }

    private static DateTime ParseDateOrDefault(string? s, DateTime fallback)
    {
        if (string.IsNullOrWhiteSpace(s)) return fallback;
        if (DateTime.TryParse(s, out var dt)) return dt;
        return fallback;
    }

    private static ScholarshipType MapTypeString(string? t)
    {
        if (string.IsNullOrWhiteSpace(t)) return ScholarshipType.Government;
        var low = t.ToLowerInvariant();
        if (low.Contains("private") || low.Contains("ngo") || low.Contains("sm")) return ScholarshipType.Private;
        if (low.Contains("goven") || low.Contains("government") || low.Contains("lgu") || low.Contains("ched") || low.Contains("dost") || low.Contains("department") || low.Contains("dswd") || low.Contains("pcw")) return ScholarshipType.Government;
        // default
        return ScholarshipType.Ngo;
    }

    private static ApplicationStatus MapApplicationStatus(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return ApplicationStatus.Submitted;
        var low = s.ToLowerInvariant();
        if (low.Contains("under")) return ApplicationStatus.UnderReview;
        if (low.Contains("approve")) return ApplicationStatus.Approved;
        if (low.Contains("reject")) return ApplicationStatus.Rejected;
        if (low.Contains("pending") || low.Contains("submitted")) return ApplicationStatus.Submitted;
        return ApplicationStatus.Submitted;
    }

    private class FrontendScholarship
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Provider { get; set; }
        public string? Type { get; set; }
        public string? Amount { get; set; }
        public decimal AmountRaw { get; set; }
        public string? Deadline { get; set; }
        public int? Slots { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public string[]? Requirements { get; set; }
        public FrontendEligibility? Eligibility { get; set; }
    }

    private class FrontendEligibility
    {
        [JsonPropertyName("minGwa")]
        public double MinGwa { get; set; }
        [JsonPropertyName("maxIncomeRank")]
        public int MaxIncomeRank { get; set; }
        [JsonPropertyName("eligibleBarangays")]
        public string[]? EligibleBarangays { get; set; }
        [JsonPropertyName("eligibleCourses")]
        public string[]? EligibleCourses { get; set; }
        [JsonPropertyName("specialConditions")]
        public string[]? SpecialConditions { get; set; }
    }

    private class FrontendApplicant
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Program { get; set; }
        public string? Gpa { get; set; }
        public int MatchScore { get; set; }
        public string? AppliedDate { get; set; }
        public string? Status { get; set; }
    }
}
