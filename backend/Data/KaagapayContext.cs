using Kaagapay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaagapay.Api.Data;

public class KaagapayContext : DbContext
{
    public KaagapayContext(DbContextOptions<KaagapayContext> options)
        : base(options)
    {
    }

    public DbSet<Barangay> Barangays => Set<Barangay>();
    public DbSet<AuthUser> Users => Set<AuthUser>();
    public DbSet<StudentProfile> Students => Set<StudentProfile>();
    public DbSet<Scholarship> Scholarships => Set<Scholarship>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Notification> Notifications => Set<Notification>();
}
