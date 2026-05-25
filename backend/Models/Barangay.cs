using System.Collections.Generic;

namespace Kaagapay.Api.Models;

public class Barangay
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<StudentProfile> Students { get; set; } = new List<StudentProfile>();
    public ICollection<Scholarship> Scholarships { get; set; } = new List<Scholarship>();
}
