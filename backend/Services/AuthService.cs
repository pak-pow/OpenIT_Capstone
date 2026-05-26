using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Kaagapay.Api.Services;

public class AuthService
{
    private readonly KaagapayContext _context;
    private readonly JwtOptions _options;
    private readonly PasswordHasher<AuthUser> _passwordHasher = new();

    public AuthService(KaagapayContext context, IOptions<JwtOptions> options)
    {
        _context = context;
        _options = options.Value;
    }

    public async Task<AuthUser> RegisterAsync(RegisterRequest dto)
    {
        var userName = NormalizeUserName(dto.UserName);
        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ArgumentException("Password is required.", nameof(dto.Password));
        }

        var role = NormalizeRole(dto.Role);
        var exists = await _context.Users.AnyAsync(u => u.UserName.ToLower() == userName.ToLower());
        if (exists)
        {
            throw new InvalidOperationException("A user with that username already exists.");
        }

        var user = new AuthUser
        {
            UserName = userName,
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<AuthUser?> ValidateAsync(LoginRequest dto)
    {
        var userName = NormalizeUserName(dto.UserName);
        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return null;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName.ToLower() == userName.ToLower());
        if (user is null)
        {
            return null;
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        return result == PasswordVerificationResult.Success ? user : null;
    }

    public AuthResponse BuildAuthResponse(AuthUser user)
    {
        return new AuthResponse
        {
            Token = CreateToken(user),
            User = new AuthUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Role = user.Role
            }
        };
    }

    public AuthUserDto BuildUser(AuthUser user)
    {
        return new AuthUserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Role = user.Role
        };
    }

    private string CreateToken(AuthUser user)
    {
        if (string.IsNullOrWhiteSpace(_options.Key))
        {
            throw new InvalidOperationException("JWT signing key is not configured.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpiresMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string NormalizeUserName(string userName)
    {
        if (string.IsNullOrWhiteSpace(userName))
        {
            throw new ArgumentException("Username is required.", nameof(userName));
        }

        return userName.Trim();
    }

    private static string NormalizeRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
        {
            return "Student";
        }

        var normalized = role.Trim();
        if (!string.Equals(normalized, "Student", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(normalized, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Role must be Student or Admin.", nameof(role));
        }

        return char.ToUpperInvariant(normalized[0]) + normalized[1..].ToLowerInvariant();
    }
}
