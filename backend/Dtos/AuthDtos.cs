using System.ComponentModel.DataAnnotations;

namespace Kaagapay.Api.Dtos;

public class AuthUserDto
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    public string UserName { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
    public string? Role { get; set; }
}

public class LoginRequest
{
    [Required]
    public string UserName { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public AuthUserDto User { get; set; } = new();
}
