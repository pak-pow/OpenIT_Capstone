using System;
using System.ComponentModel.DataAnnotations;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Dtos;

public class DocumentDto
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public DocumentType Type { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; }
    public DateTime UploadedAt { get; set; }
}

public class DocumentCreateDto
{
    public int ApplicationId { get; set; }
    public DocumentType Type { get; set; }
    [Required]
    public string FileName { get; set; } = string.Empty;
    [Required]
    public string FilePath { get; set; } = string.Empty;
}

public class DocumentStatusUpdateDto
{
    public DocumentStatus Status { get; set; }
}
