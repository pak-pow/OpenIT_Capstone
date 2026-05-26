using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _service;

    public NotificationsController(NotificationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAll([FromQuery] string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest(new { message = "userId is required." });
        }

        var isAdmin = User.IsInRole("Admin");
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (!isAdmin && !string.Equals(currentUserId, userId, StringComparison.OrdinalIgnoreCase))
        {
            return Forbid();
        }

        var notifications = await _service.GetByUserAsync(userId);
        return Ok(notifications.Select(n => n.ToDto()));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NotificationDto>> Create([FromBody] NotificationCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { userId = created.UserId }, created.ToDto());
    }

    [HttpPut("{id:int}/read")]
    public async Task<IActionResult> UpdateRead(int id, [FromBody] NotificationReadUpdateDto dto)
    {
        var notification = await _service.GetByIdAsync(id);
        if (notification is null)
        {
            return NotFound();
        }

        var isAdmin = User.IsInRole("Admin");
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (!isAdmin && !string.Equals(currentUserId, notification.UserId, StringComparison.OrdinalIgnoreCase))
        {
            return Forbid();
        }

        var updated = await _service.UpdateReadAsync(id, dto.IsRead);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }
}
