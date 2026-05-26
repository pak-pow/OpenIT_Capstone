using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class DocumentService
{
    private readonly KaagapayContext _context;

    public DocumentService(KaagapayContext context)
    {
        _context = context;
    }

    public async Task<List<Document>> GetAllAsync(int? applicationId)
    {
        var query = _context.Documents.AsNoTracking().AsQueryable();
        if (applicationId.HasValue)
        {
            query = query.Where(d => d.ApplicationId == applicationId.Value);
        }

        return await query.ToListAsync();
    }

    public Task<Document?> GetByIdAsync(int id) =>
        _context.Documents.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);

    public Task<Document?> GetByIdWithApplicationAsync(int id) =>
        _context.Documents.AsNoTracking()
            .Include(d => d.Application)
            .ThenInclude(a => a!.Student)
            .FirstOrDefaultAsync(d => d.Id == id);

    public Task<Application?> GetApplicationAsync(int applicationId) =>
        _context.Applications.AsNoTracking().Include(a => a.Student)
            .FirstOrDefaultAsync(a => a.Id == applicationId);

    public async Task<Document?> CreateAsync(DocumentCreateDto dto)
    {
        var applicationExists = await _context.Applications.AnyAsync(a => a.Id == dto.ApplicationId);
        if (!applicationExists)
        {
            return null;
        }

        var document = new Document
        {
            ApplicationId = dto.ApplicationId,
            Type = dto.Type,
            FileName = dto.FileName,
            FilePath = dto.FilePath,
            Status = DocumentStatus.Pending,
            UploadedAt = DateTime.UtcNow
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document?> CreateFromUploadAsync(int applicationId, DocumentType type, string fileName, string filePath)
    {
        var applicationExists = await _context.Applications.AnyAsync(a => a.Id == applicationId);
        if (!applicationExists)
        {
            return null;
        }

        var document = new Document
        {
            ApplicationId = applicationId,
            Type = type,
            FileName = fileName,
            FilePath = filePath,
            Status = DocumentStatus.Pending,
            UploadedAt = DateTime.UtcNow
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document?> UpdateStatusAsync(int id, DocumentStatusUpdateDto dto)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document is null)
        {
            return null;
        }

        document.Status = dto.Status;
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document is null)
        {
            return false;
        }

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();
        return true;
    }
}
