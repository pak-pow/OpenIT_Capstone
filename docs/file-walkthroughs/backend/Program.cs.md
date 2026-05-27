# Backend File Walkthrough: `Program.cs`

This file is the backend bootstrapper. It wires the application together before the web server starts.

## Startup switch

```csharp
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
```

This enables legacy PostgreSQL timestamp handling so older date-time behavior stays compatible with the app and database.

## Application builder

```csharp
var builder = WebApplication.CreateBuilder(args);
```

This creates the host builder and gives access to configuration, logging, and dependency injection registration.

## DbContext registration

```csharp
builder.Services.AddDbContext<KaagapayContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(warnings =>
        warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});
```

This registers EF Core with PostgreSQL. The warning suppression avoids noisy pending-model warnings during startup.

## Service registration

```csharp
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BarangayService>();
builder.Services.AddScoped<StudentProfileService>();
builder.Services.AddScoped<ScholarshipService>();
builder.Services.AddScoped<ApplicationService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<EligibilityService>();
```

Each service is scoped per request. Controllers will request these through constructor injection.

## JWT options and validation

```csharp
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
```

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });
```

This configures JWT auth, validates signing, issuer, audience, and token lifetime, and rejects weak or missing signing keys.

## Middleware and API surface

```csharp
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(...);
```

These register authorization, controller routing, OpenAPI support, and a dev CORS policy for the frontend ports.

## App pipeline

```csharp
var app = builder.Build();
```

```csharp
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
```

```csharp
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

This builds the app, exposes OpenAPI only in development, enables static files, and maps the API controllers.

## Migration and seed startup

```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<KaagapayContext>();
    try
    {
        await context.Database.MigrateAsync();
    }
    catch (PostgresException ex) when (ex.SqlState == "42P07")
    {
        app.Logger.LogWarning("Skipping migration due to existing relation: {Message}", ex.MessageText);
        await context.Database.ExecuteSqlRawAsync(
            "ALTER TABLE \"Scholarships\" ADD COLUMN IF NOT EXISTS \"Requirements\" text NOT NULL DEFAULT '';"
        );
    }
    await SeedData.EnsureSeededAsync(context);
}
```

This ensures the database is migrated and seeded on startup. If legacy schema state causes a table-exists error, the code applies a targeted fix instead of crashing.
