using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/barangays")]
public class BarangaysController : ControllerBase
{
    private readonly BarangayService _service;

    public BarangaysController(BarangayService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BarangayDto>>> GetAll()
    {
        var barangays = await _service.GetAllAsync();
        return Ok(barangays.Select(b => b.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BarangayDto>> GetById(int id)
    {
        var barangay = await _service.GetByIdAsync(id);
        if (barangay is null)
        {
            return NotFound();
        }

        return Ok(barangay.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<BarangayDto>> Create([FromBody] BarangayCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] BarangayUpdateDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
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
