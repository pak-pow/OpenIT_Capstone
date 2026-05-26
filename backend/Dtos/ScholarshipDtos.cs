using System;
using System.ComponentModel.DataAnnotations;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Dtos;

public class ScholarshipDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double RequiredGwa { get; set; }
    public decimal MaxHouseholdIncome { get; set; }
    // Additional frontend-friendly fields
    public string Provider { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
    public decimal AmountRaw { get; set; }
    public string[] Requirements { get; set; } = Array.Empty<string>();
    public ScholarshipEligibilityDto Eligibility { get; set; } = new ScholarshipEligibilityDto();
    public int SlotsFilled { get; set; }
    public string EligibleCourses { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int AvailableSlots { get; set; }
    public ScholarshipStatus Status { get; set; }
    public ScholarshipType Type { get; set; }
    public int BarangayId { get; set; }
}

public class ScholarshipEligibilityDto
{
    public double MinGwa { get; set; }
    public int MaxIncomeRank { get; set; }
    public string[] EligibleBarangays { get; set; } = Array.Empty<string>();
    public string[] EligibleCourses { get; set; } = Array.Empty<string>();
    public string[] SpecialConditions { get; set; } = Array.Empty<string>();
}

public class ScholarshipCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double RequiredGwa { get; set; }
    public decimal MaxHouseholdIncome { get; set; }
    public string EligibleCourses { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int AvailableSlots { get; set; }
    public ScholarshipStatus Status { get; set; } = ScholarshipStatus.Open;
    public ScholarshipType Type { get; set; } = ScholarshipType.Government;
    public int BarangayId { get; set; }
}

public class ScholarshipUpdateDto : ScholarshipCreateDto
{
}
