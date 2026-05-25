using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/documents")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly DocumentService _service;
    private readonly IWebHostEnvironment _environment;

    public DocumentsController(DocumentService service, IWebHostEnvironment environment)
    {
        _service = service;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAll([FromQuery] int? applicationId)
    {
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin)
        {
            if (!applicationId.HasValue)
            {
                return BadRequest(new { message = "applicationId is required." });
            }

            var application = await _service.GetApplicationAsync(applicationId.Value);
            if (application is null)
            {
                return NotFound(new { message = "Application not found." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (application.Student?.UserId != userId)
            {
                return Forbid();
            }
        }

        var documents = await _service.GetAllAsync(applicationId);
        return Ok(documents.Select(d => d.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DocumentDto>> GetById(int id)
    {
        var isAdmin = User.IsInRole("Admin");
        var document = isAdmin
            ? await _service.GetByIdAsync(id)
            : await _service.GetByIdWithApplicationAsync(id);
        if (document is null)
        {
            return NotFound();
        }

        if (!isAdmin)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (document.Application?.Student?.UserId != userId)
            {
                return Forbid();
            }
        }

        return Ok(document.ToDto());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DocumentDto>> Create([FromBody] DocumentCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        if (created is null)
        {
            return NotFound(new { message = "Application not found." });
        }

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPost("upload")]
    public async Task<ActionResult<DocumentDto>> Upload([FromForm] DocumentUploadRequest request)
    {
        if (request.File.Length == 0)
        {
            return BadRequest(new { message = "File is required." });
        }

        if (request.File.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size must be 5MB or less." });
        }

        var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Only PDF, JPG, and PNG files are allowed." });
        }

        var application = await _service.GetApplicationAsync(request.ApplicationId);
        if (application is null)
        {
            return NotFound(new { message = "Application not found." });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && application.Student?.UserId != userId)
        {
            return Forbid();
        }

        var uploadsRoot = Path.Combine(_environment.ContentRootPath, "App_Data", "uploads");
        Directory.CreateDirectory(uploadsRoot);
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsRoot, storedFileName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await request.File.CopyToAsync(stream);
        }

        var relativePath = $"/uploads/{storedFileName}";
        var created = await _service.CreateFromUploadAsync(request.ApplicationId, request.Type, request.File.FileName, relativePath);
        if (created is null)
        {
            return NotFound(new { message = "Application not found." });
        }

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
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
