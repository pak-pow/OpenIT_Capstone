using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/documents")]
public class DocumentsController : ControllerBase
{
    private readonly DocumentService _service;

    public DocumentsController(DocumentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAll([FromQuery] int? applicationId)
    {
        var documents = await _service.GetAllAsync(applicationId);
        return Ok(documents.Select(d => d.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DocumentDto>> GetById(int id)
    {
        var document = await _service.GetByIdAsync(id);
        if (document is null)
        {
            return NotFound();
        }

        return Ok(document.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create([FromBody] DocumentCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        if (created is null)
        {
            return NotFound(new { message = "Application not found." });
        }

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<DocumentDto>> UpdateStatus(int id, [FromBody] DocumentStatusUpdateDto dto)
    {
        var updated = await _service.UpdateStatusAsync(id, dto);
        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated.ToDto());
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
