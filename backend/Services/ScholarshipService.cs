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
            Description = dto.Description,
            RequiredGwa = dto.RequiredGwa,
            MaxHouseholdIncome = dto.MaxHouseholdIncome,
            EligibleCourses = dto.EligibleCourses,
            Deadline = dto.Deadline,
            AvailableSlots = dto.AvailableSlots,
            Status = dto.Status,
            Type = dto.Type,
            BarangayId = dto.BarangayId,
            Requirements = dto.Requirements
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
}
