using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class BarangayService
{
    private readonly KaagapayContext _context;

    public BarangayService(KaagapayContext context)
    {
        _context = context;
    }

    public Task<List<Barangay>> GetAllAsync() => _context.Barangays.AsNoTracking().ToListAsync();

    public Task<Barangay?> GetByIdAsync(int id) =>
        _context.Barangays.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Barangay> CreateAsync(BarangayCreateDto dto)
    {
        var barangay = new Barangay { Name = dto.Name };
        _context.Barangays.Add(barangay);
        await _context.SaveChangesAsync();
        return barangay;
    }

    public async Task<bool> UpdateAsync(int id, BarangayUpdateDto dto)
    {
        var barangay = await _context.Barangays.FindAsync(id);
        if (barangay is null)
        {
            return false;
        }

        barangay.Name = dto.Name;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var barangay = await _context.Barangays.FindAsync(id);
        if (barangay is null)
        {
            return false;
        }

        _context.Barangays.Remove(barangay);
        await _context.SaveChangesAsync();
        return true;
    }
}
