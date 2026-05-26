using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class StudentProfileService
{
    private readonly KaagapayContext _context;

    public StudentProfileService(KaagapayContext context)
    {
        _context = context;
    }

    public Task<List<StudentProfile>> GetAllAsync() =>
        _context.Students
            .AsNoTracking()
            .Include(s => s.Barangay)
            .ToListAsync();

    public Task<StudentProfile?> GetByIdAsync(int id) =>
        _context.Students
            .AsNoTracking()
            .Include(s => s.Barangay)
            .FirstOrDefaultAsync(s => s.Id == id);

    public Task<StudentProfile?> GetByUserIdAsync(string userId) =>
        _context.Students
            .AsNoTracking()
            .Include(s => s.Barangay)
            .FirstOrDefaultAsync(s => s.UserId == userId);

    public async Task<StudentProfile> CreateAsync(StudentProfileCreateDto dto)
    {
        var barangayExists = await _context.Barangays.AnyAsync(b => b.Id == dto.BarangayId);
        if (!barangayExists)
        {
            var firstBarangay = await _context.Barangays.FirstOrDefaultAsync();
            if (firstBarangay != null)
            {
                dto.BarangayId = firstBarangay.Id;
            }
            else
            {
                var defaultBarangay = new Barangay { Name = "Default Barangay" };
                _context.Barangays.Add(defaultBarangay);
                await _context.SaveChangesAsync();
                dto.BarangayId = defaultBarangay.Id;
            }
        }

        var student = new StudentProfile
        {
            UserId = dto.UserId,
            FullName = dto.FullName,
            Gwa = dto.Gwa,
            HouseholdIncome = dto.HouseholdIncome,
            Course = dto.Course,
            YearLevel = dto.YearLevel,
            School = dto.School,
            PreferredScholarshipType = dto.PreferredScholarshipType,
            BarangayId = dto.BarangayId
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<bool> UpdateAsync(int id, StudentProfileUpdateDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null)
        {
            return false;
        }

        var barangayExists = await _context.Barangays.AnyAsync(b => b.Id == dto.BarangayId);
        if (!barangayExists)
        {
            var firstBarangay = await _context.Barangays.FirstOrDefaultAsync();
            if (firstBarangay != null)
            {
                dto.BarangayId = firstBarangay.Id;
            }
        }

        student.UserId = dto.UserId;
        student.FullName = dto.FullName;
        student.Gwa = dto.Gwa;
        student.HouseholdIncome = dto.HouseholdIncome;
        student.Course = dto.Course;
        student.YearLevel = dto.YearLevel;
        student.School = dto.School;
        student.PreferredScholarshipType = dto.PreferredScholarshipType;
        student.BarangayId = dto.BarangayId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null)
        {
            return false;
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return true;
    }
}
