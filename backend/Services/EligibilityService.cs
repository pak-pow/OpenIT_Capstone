using Kaagapay.Api.Data;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class EligibilityService
{
    private readonly KaagapayContext _context;

    public EligibilityService(KaagapayContext context)
    {
        _context = context;
    }

    public async Task<List<Scholarship>> GetEligibleScholarshipsAsync(int studentId)
    {
        var student = await _context.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Id == studentId);
        if (student is null)
        {
            return new List<Scholarship>();
        }

        var scholarships = await _context.Scholarships.AsNoTracking()
            .Where(s => s.Status == ScholarshipStatus.Open)
            .ToListAsync();

        var eligible = new List<Scholarship>();
        foreach (var scholarship in scholarships)
        {
            if (IsEligible(student, scholarship))
            {
                eligible.Add(scholarship);
            }
        }

        return eligible;
    }

    private static bool IsEligible(StudentProfile student, Scholarship scholarship)
    {
        if (scholarship.RequiredGwa > 0 && student.Gwa > scholarship.RequiredGwa)
        {
            return false;
        }

        if (scholarship.MaxHouseholdIncome > 0 && student.HouseholdIncome > scholarship.MaxHouseholdIncome)
        {
            return false;
        }

        if (!CourseMatches(student.Course, scholarship.EligibleCourses))
        {
            return false;
        }

        if (student.PreferredScholarshipType.HasValue && scholarship.Type != student.PreferredScholarshipType.Value)
        {
            return false;
        }

        if (scholarship.BarangayId != 0 && student.BarangayId != scholarship.BarangayId)
        {
            return false;
        }

        return true;
    }

    private static bool CourseMatches(string course, string eligibleCourses)
    {
        if (string.IsNullOrWhiteSpace(eligibleCourses))
        {
            return true;
        }

        if (string.IsNullOrWhiteSpace(course))
        {
            return false;
        }

        var tokens = eligibleCourses
            .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return tokens.Any(token => string.Equals(token, course, StringComparison.OrdinalIgnoreCase));
    }
}
