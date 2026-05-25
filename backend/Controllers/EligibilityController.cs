using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/eligibility")]
[Authorize]
public class EligibilityController : ControllerBase
{
    private readonly EligibilityService _service;
    private readonly StudentProfileService _students;

    public EligibilityController(EligibilityService service, StudentProfileService students)
    {
        _service = service;
        _students = students;
    }

    [HttpGet("{studentId:int}")]
    public async Task<ActionResult<EligibilityResultDto>> GetEligible(int studentId)
    {
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            var student = await _students.GetByUserIdAsync(userId);
            if (student is null || student.Id != studentId)
            {
                return Forbid();
            }
        }

        var scholarships = await _service.GetEligibleScholarshipsAsync(studentId);
        var result = new EligibilityResultDto
        {
            StudentId = studentId,
            Scholarships = scholarships.Select(s => s.ToDto()).ToList()
        };

        return Ok(result);
    }
}
