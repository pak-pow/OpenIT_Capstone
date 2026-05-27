# Backend — Code Overview and Snippets

This document explains the main backend files, their responsibilities, and important code snippets from this repository (ASP.NET Core). Use this as a quick developer reference.

## `Program.cs`
- Purpose: Application bootstrap — configures the web host, services, middleware, and routing.
- Key responsibilities:
  - Build and configure `IHost` / `WebApplication`.
  - Register services (DbContext, Authentication, custom services).
  - Configure middleware (CORS, Authentication, Authorization, Routing).

Example responsibilities (pseudo-snippet):

```csharp
var builder = WebApplication.CreateBuilder(args);
// Register DbContext and services
builder.Services.AddDbContext<KaagapayContext>(...);
builder.Services.AddScoped<ApplicationService>();
builder.Services.AddAuthentication(...);

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

What it does: sets up dependency injection, configures middleware pipeline and starts HTTP server.

## `Controllers/` (e.g. `ApplicationsController.cs`)
- Purpose: HTTP endpoints. Controllers map routes to service calls and return DTOs.
- Pattern: Validate input -> call Service -> return HTTP result (200, 201, 400, 404, etc.).

Common controller snippet pattern:

```csharp
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
  private readonly StudentProfileService _service;
  public StudentsController(StudentProfileService service) => _service = service;

  [HttpGet("{id}")]
  public ActionResult<StudentDto> Get(int id)
  {
    var student = _service.GetById(id);
    if (student == null) return NotFound();
    return Ok(student);
  }
}
```

What it does: exposes REST API, translates HTTP to service-level operations, handles HTTP status codes.

## `Services/` (e.g. `ApplicationService.cs`, `AuthService.cs`)
- Purpose: Business logic layer. Services hide data access details and implement use-cases.
- Responsibilities:
  - Query/update `KaagapayContext` (EF Core DbContext).
  - Map between `Models` and `Dtos` (using `MappingExtensions` or manual mapping).
  - Implement validation, filtering, and transactional operations.

Typical service method:

```csharp
public StudentDto GetById(int id)
{
  var entity = _context.StudentProfiles.Include(...).SingleOrDefault(x => x.Id == id);
  if (entity == null) return null;
  return entity.ToDto(); // Mapping extension
}
```

What it does: centralizes application logic, keeps controllers thin.

## `Data/KaagapayContext.cs`
- Purpose: EF Core DbContext. Declares `DbSet<T>` properties and configures relationships.
- Responsibilities:
  - Configure entity mappings and constraints in `OnModelCreating`.
  - Expose `DbSet<Application>`, `DbSet<StudentProfile>`, `DbSet<Scholarship>`, etc.

Snippet:

```csharp
public class KaagapayContext : DbContext
{
  public DbSet<StudentProfile> StudentProfiles { get; set; }
  public KaagapayContext(DbContextOptions<KaagapayContext> opts) : base(opts) {}

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<StudentProfile>().HasIndex(p => p.Email).IsUnique();
  }
}
```

What it does: maps domain models to database schema and provides query/update surface.

## `Models/` (domain entities)
- Purpose: Represent database schema / domain objects used by EF Core.
- Example: `StudentProfile`, `Scholarship`, `Application` — these contain properties, navigation properties and sometimes helper methods.

Example model snippet:

```csharp
public class Scholarship
{
  public int Id { get; set; }
  public string Name { get; set; }
  public ICollection<Requirement> Requirements { get; set; }
}
```

What it does: defines shape of persisted data and object relationships.

## `Dtos/` and `MappingExtensions.cs`
- Purpose: DTOs are data-transfer objects used to decouple internal domain models from HTTP surface.
- `MappingExtensions` provides `ToDto()` and `FromDto()` helper methods to transform models.

Example mapping:

```csharp
public static StudentDto ToDto(this StudentProfile model) => new StudentDto { Id = model.Id, FullName = model.FullName };
```

What it does: prevents leaking domain entities to clients and shapes API payloads.

## `Services/JwtOptions.cs` and `AuthService.cs`
- Purpose: authentication configuration and token generation/validation.
- What they do: read JWT settings (`Issuer`, `Audience`, `SigningKey`) and implement token creation, credential verification, and sign-in flows.

Auth flow snippet concept:

```csharp
var tokenHandler = new JwtSecurityTokenHandler();
var token = tokenHandler.CreateToken(new SecurityTokenDescriptor { Subject = claims, Expires = ..., SigningCredentials = creds });
return tokenHandler.WriteToken(token);
```

## `appsettings.json` and environment-specific files
- Purpose: Configuration store for DB connection strings, JWT settings, allowed origins, logging, etc.
- What they do: provide values consumed by `Program.cs` to wire services.

## Migrations
- Purpose: EF Core migration files in `Migrations/` represent the incremental changes to the database schema.
- What they do: define `Up` and `Down` methods to apply and rollback schema changes.

## Testing and Artifacts
- The `Kaagapay.Api.Tests` folder contains unit / integration tests — check `*Tests*` files there to understand verification of services and controllers.

---
If you want, I can expand this file with per-controller and per-service example walkthroughs or add links to source files for quick navigation.
