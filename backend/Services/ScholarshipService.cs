using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class ScholarshipService
{
    private readonly KaagapayContext _context;

    public ScholarshipService(KaagapayContext context)
    {
        _context = context;
    }

    public Task<List<Scholarship>> GetAllAsync() =>
        _context.Scholarships
            .AsNoTracking()
            .Include(s => s.Barangay)
            .Include(s => s.Applications)
            .ToListAsync();

    public Task<Scholarship?> GetByIdAsync(int id) =>
        _context.Scholarships
            .AsNoTracking()
            .Include(s => s.Barangay)
            .Include(s => s.Applications)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<Scholarship> CreateAsync(ScholarshipCreateDto dto)
    {
        var scholarship = new Scholarship
        {
            Title = dto.Title,
            Term = dto.Term ?? string.Empty,
            TermEndDate = dto.TermEndDate,
            Description = dto.Description,
            RequiredGwa = dto.RequiredGwa,
            MaxHouseholdIncome = dto.MaxHouseholdIncome,
            EligibleCourses = dto.EligibleCourses,
            Deadline = dto.Deadline,
            AvailableSlots = dto.AvailableSlots,
            Status = dto.Status,
            Type = dto.Type,
            BarangayId = dto.BarangayId,
            Requirements = dto.Requirements,
            Provider = dto.Provider,
            EligibleBarangays = dto.EligibleBarangays,
            SpecialConditions = dto.SpecialConditions
        };

        _context.Scholarships.Add(scholarship);
        await _context.SaveChangesAsync();
        return scholarship;
    }

    public async Task<bool> UpdateAsync(int id, ScholarshipUpdateDto dto)
    {
        var scholarship = await _context.Scholarships.FindAsync(id);
        if (scholarship is null)
        {
            return false;
        }

        scholarship.Title = dto.Title;
        scholarship.Term = dto.Term ?? string.Empty;
        scholarship.TermEndDate = dto.TermEndDate;
        scholarship.Description = dto.Description;
        scholarship.RequiredGwa = dto.RequiredGwa;
        scholarship.MaxHouseholdIncome = dto.MaxHouseholdIncome;
        scholarship.EligibleCourses = dto.EligibleCourses;
        scholarship.Deadline = dto.Deadline;
        scholarship.AvailableSlots = dto.AvailableSlots;
        scholarship.Status = dto.Status;
        scholarship.Type = dto.Type;
        scholarship.BarangayId = dto.BarangayId;
        scholarship.Requirements = dto.Requirements;
        scholarship.Provider = dto.Provider;
        scholarship.EligibleBarangays = dto.EligibleBarangays;
        scholarship.SpecialConditions = dto.SpecialConditions;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var scholarship = await _context.Scholarships.FindAsync(id);
        if (scholarship is null)
        {
            return false;
        }

        _context.Scholarships.Remove(scholarship);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> EndScholarshipAsync(int id)
    {
        var scholarship = await _context.Scholarships.FindAsync(id);
        if (scholarship is null)
        {
            return false;
        }

        // Set scholarship to Closed
        scholarship.Status = ScholarshipStatus.Closed;

        // Find all approved applications
        var approvedApps = await _context.Applications
            .Where(a => a.ScholarshipId == id && a.Status == ApplicationStatus.Approved)
            .ToListAsync();

        var studentIds = approvedApps.Select(a => a.StudentId).Distinct().ToList();

        // Mark them as completed
        foreach (var app in approvedApps)
        {
            app.Status = ApplicationStatus.Completed;
            app.Remarks = "Completed at the end of the scholarship term.";
        }

        // Find all withdrawn applications for these students across any scholarship
        var withdrawnApps = await _context.Applications
            .Where(a => studentIds.Contains(a.StudentId) && a.Status == ApplicationStatus.Withdrawn)
            .ToListAsync();

        // Remove the withdrawn applications to allow re-applying
        _context.Applications.RemoveRange(withdrawnApps);

        await _context.SaveChangesAsync();
        return true;
    }
}
