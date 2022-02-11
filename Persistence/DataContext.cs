using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) 
    {
      base.OnModelCreating(builder);

      builder.Entity<ActivityAttendee>()
        .HasKey( t => new {t.AppUserId,t.ActivityId});

      //Alternative syntax
      //builder.Entity<ActivityAttendee>( b => b.HasKey(t => new {t.ActivityId, t.AppUserId}));

      builder.Entity<ActivityAttendee>()
        .HasOne( aa => aa.Activity)
        .WithMany( ac => ac.Attendees)
        .HasForeignKey( aa => aa.ActivityId)
        .IsRequired();      

      builder.Entity<ActivityAttendee>()
        .HasOne( aa => aa.AppUser)
        .WithMany( au => au.Activities)
        .HasForeignKey( aa => aa.AppUserId)
        .IsRequired();            
    }
  }
}
