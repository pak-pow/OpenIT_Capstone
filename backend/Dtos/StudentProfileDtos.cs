using System.ComponentModel.DataAnnotations;

namespace Kaagapay.Api.Dtos;

public class StudentProfileDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public double Gwa { get; set; }
    public decimal HouseholdIncome { get; set; }
    public string Course { get; set; } = string.Empty;
    public int YearLevel { get; set; }
    public string School { get; set; } = string.Empty;
    public int BarangayId { get; set; }
}

public class StudentProfileCreateDto
{
    public string UserId { get; set; } = string.Empty;
    [Required]
    public string FullName { get; set; } = string.Empty;
    public double Gwa { get; set; }
    public decimal HouseholdIncome { get; set; }
    public string Course { get; set; } = string.Empty;
    public int YearLevel { get; set; }
    public string School { get; set; } = string.Empty;
    public int BarangayId { get; set; }
}

public class StudentProfileUpdateDto : StudentProfileCreateDto
{
}
