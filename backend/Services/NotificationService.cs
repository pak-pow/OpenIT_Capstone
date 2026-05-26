using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Services;

public class NotificationService
{
    private readonly KaagapayContext _context;

    public NotificationService(KaagapayContext context)
    {
        _context = context;
    }

    public Task<List<Notification>> GetByUserAsync(string userId) =>
        _context.Notifications.AsNoTracking().Where(n => n.UserId == userId).ToListAsync();

    public Task<Notification?> GetByIdAsync(int id) =>
        _context.Notifications.AsNoTracking().FirstOrDefaultAsync(n => n.Id == id);

    public async Task<Notification> CreateAsync(NotificationCreateDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Message = dto.Message,
            RelatedType = dto.RelatedType,
            RelatedId = dto.RelatedId,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<bool> UpdateReadAsync(int id, bool isRead)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification is null)
        {
            return false;
        }

        notification.IsRead = isRead;
        await _context.SaveChangesAsync();
        return true;
    }
}
