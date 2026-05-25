using System;
using System.Collections.Generic;

namespace Kaagapay.Api.Models;

public class Application
{
    public int Id { get; set; }

    public int ScholarshipId { get; set; }
    public Scholarship? Scholarship { get; set; }

    public int StudentId { get; set; }
    public StudentProfile? Student { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
    public string? Remarks { get; set; }

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
