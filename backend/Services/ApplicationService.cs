using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class ApplicationService
{
    private readonly KaagapayContext _context;

    public ApplicationService(KaagapayContext context)
    {
        _context = context;
    }

    public async Task<List<Application>> GetAllAsync(int? studentId, int? scholarshipId)
    {
        var query = _context.Applications
            .Include(a => a.Scholarship)
                .ThenInclude(s => s!.Barangay)
            .Include(a => a.Student)
            .AsNoTracking()
            .AsQueryable();

        if (studentId.HasValue)
        {
            query = query.Where(a => a.StudentId == studentId.Value);
        }

        if (scholarshipId.HasValue)
        {
            query = query.Where(a => a.ScholarshipId == scholarshipId.Value);
        }

        return await query.ToListAsync();
    }

    public Task<Application?> GetByIdAsync(int id) =>
        _context.Applications
            .Include(a => a.Scholarship)
                .ThenInclude(s => s!.Barangay)
            .Include(a => a.Student)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<Application?> CreateAsync(ApplicationCreateDto dto)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == dto.StudentId);
        var scholarship = await _context.Scholarships
            .Include(s => s.Applications)
            .FirstOrDefaultAsync(s => s.Id == dto.ScholarshipId);

        if (!studentExists || scholarship is null)
        {
            return null;
        }

        var hasActive = await _context.Applications.AnyAsync(a => 
            a.StudentId == dto.StudentId && 
            a.ScholarshipId == dto.ScholarshipId && 
            a.Status != ApplicationStatus.Rejected);
            
        if (hasActive)
        {
            throw new InvalidOperationException("You already have an active application for this scholarship.");
        }

        var slotsFilled = scholarship.Applications.Count(a => a.Status == ApplicationStatus.Approved);
        if (scholarship.AvailableSlots <= slotsFilled)
        {
            throw new ArgumentException("This scholarship has no available slots left.");
        }

        var application = new Application
        {
            StudentId = dto.StudentId,
            ScholarshipId = dto.ScholarshipId,
            Status = ApplicationStatus.Submitted,
            SubmittedAt = DateTime.UtcNow,
            Remarks = dto.Remarks
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();
        return application;
    }

    public async Task<Application?> UpdateStatusAsync(int id, ApplicationStatusUpdateDto dto)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application is null)
        {
            return null;
        }

        application.Status = dto.Status;
        application.Remarks = dto.Remarks;
        application.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Reload with includes for complete DTO mapping
        return await _context.Applications
            .Include(a => a.Scholarship)
                .ThenInclude(s => s!.Barangay)
            .Include(a => a.Student)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application is null)
        {
            return false;
        }

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();
        return true;
    }
}
