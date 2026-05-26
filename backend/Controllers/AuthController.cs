using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest dto)
    {
        if (dto.Role?.Equals("Admin", StringComparison.OrdinalIgnoreCase) == true && !User.IsInRole("Admin"))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Only admins can create other admin accounts." });
        }

        try
        {
            var user = await _service.RegisterAsync(dto);
            return Ok(_service.BuildAuthResponse(user));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest dto)
    {
        var user = await _service.ValidateAsync(dto);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        return Ok(_service.BuildAuthResponse(user));
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<AuthUserDto> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var userName = User.Identity?.Name ?? string.Empty;
        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        return Ok(new AuthUserDto
        {
            Id = userId,
            UserName = userName,
            Role = role
        });
    }
}
