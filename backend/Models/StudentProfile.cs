using System.Collections.Generic;

namespace Kaagapay.Api.Models;

public class StudentProfile
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
    public Barangay? Barangay { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
