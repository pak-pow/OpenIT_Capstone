using System.Collections.Generic;

namespace Kaagapay.Api.Dtos;

public class EligibilityResultDto
{
    public int StudentId { get; set; }
    public List<ScholarshipDto> Scholarships { get; set; } = new();
}
