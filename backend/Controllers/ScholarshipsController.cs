using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/scholarships")]
[Authorize]
public class ScholarshipsController : ControllerBase
{
    private readonly ScholarshipService _service;

    public ScholarshipsController(ScholarshipService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ScholarshipDto>>> GetAll()
    {
        var scholarships = await _service.GetAllAsync();
        return Ok(scholarships.Select(s => s.ToDto()));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ScholarshipDto>> GetById(int id)
    {
        var scholarship = await _service.GetByIdAsync(id);
        if (scholarship is null)
        {
            return NotFound();
        }

        return Ok(scholarship.ToDto());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ScholarshipDto>> Create([FromBody] ScholarshipCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ScholarshipUpdateDto dto)
    {
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
