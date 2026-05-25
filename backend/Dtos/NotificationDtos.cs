using System;
using System.ComponentModel.DataAnnotations;

namespace Kaagapay.Api.Dtos;

public class NotificationDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RelatedType { get; set; }
    public int? RelatedId { get; set; }
}

public class NotificationCreateDto
{
    [Required]
    public string UserId { get; set; } = string.Empty;
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Message { get; set; } = string.Empty;
    public string? RelatedType { get; set; }
    public int? RelatedId { get; set; }
}

public class NotificationReadUpdateDto
{
    public bool IsRead { get; set; }
}
