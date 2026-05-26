using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/students")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly StudentProfileService _service;

    public StudentsController(StudentProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<StudentProfileDto>>> GetAll()
    {
        var students = await _service.GetAllAsync();
        return Ok(students.Select(s => s.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<StudentProfileDto>> GetById(int id)
    {
        var student = await _service.GetByIdAsync(id);
        if (student is null)
        {
            return NotFound();
        }

        var isAdmin = User.IsInRole("Admin");
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (!isAdmin && student.UserId != userId)
        {
            return Forbid();
        }

        return Ok(student.ToDto());
    }

    [HttpGet("me")]
    public async Task<ActionResult<StudentProfileDto>> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(userId))
        {
            return Forbid();
        }

        var student = await _service.GetByUserIdAsync(userId);
        if (student is null)
        {
            return NotFound();
        }

        return Ok(student.ToDto());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentProfileDto>> Create([FromBody] StudentProfileCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] StudentProfileUpdateDto dto)
    {
        var student = await _service.GetByIdAsync(id);
        if (student is null)
        {
            return NotFound();
        }

        var isAdmin = User.IsInRole("Admin");
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (!isAdmin && student.UserId != userId)
        {
            return Forbid();
        }

        if (!isAdmin)
        {
            dto.UserId = student.UserId;
        }

        var updated = await _service.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var removed = await _service.DeleteAsync(id);
        if (!removed)
        {
            return NotFound();
        }

        return NoContent();
    }
}
