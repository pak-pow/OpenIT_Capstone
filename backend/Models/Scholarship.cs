using System;
using System.Collections.Generic;

namespace Kaagapay.Api.Models;

public class Scholarship
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double RequiredGwa { get; set; }
    public decimal MaxHouseholdIncome { get; set; }
    public string EligibleCourses { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int AvailableSlots { get; set; }
    public ScholarshipStatus Status { get; set; } = ScholarshipStatus.Open;

    public int BarangayId { get; set; }
    public Barangay? Barangay { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
