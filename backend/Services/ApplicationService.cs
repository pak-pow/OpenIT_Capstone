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
        var query = _context.Applications.AsNoTracking().AsQueryable();

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
        _context.Applications.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);

    public async Task<Application?> CreateAsync(ApplicationCreateDto dto)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == dto.StudentId);
        var scholarshipExists = await _context.Scholarships.AnyAsync(s => s.Id == dto.ScholarshipId);

        if (!studentExists || !scholarshipExists)
        {
            return null;
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
        return application;
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
