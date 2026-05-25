using System;

namespace Kaagapay.Api.Models;

public class Document
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }
    public Application? Application { get; set; }

    public DocumentType Type { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; } = DocumentStatus.Pending;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
