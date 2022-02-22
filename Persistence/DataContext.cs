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
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> UserFollowings { get; set; }

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

      //If wanted to configure manually 
      //We will use automatic EF behavior, so it is unnecessary, as well as AppUser and AppUserId nav props in Photo class
      // builder.Entity<AppUser>()
      //   .HasMany( u => u.Photos)
      //   .WithOne( p => p.AppUser)
      //   .HasForeignKey( p => p.AppUserId)
      //   .IsRequired()
      //   .OnDelete(DeleteBehavior.Restrict);       

      builder.Entity<Photo>()
        .HasOne( p => p.AppUser)
        .WithMany( u => u.Photos)
        .HasForeignKey( p => p.AppUserId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade);        

      builder.Entity<RefreshToken>()
        .HasOne( t => t.AppUser)
        .WithMany( u => u.RefreshTokens)
        //.HasForeignKey( t => t.AppUser.Id)
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade);                

      builder.Entity<Comment>()
        .HasOne( c => c.Activity)
        .WithMany( a => a.Comments)
        .OnDelete(DeleteBehavior.Cascade);

      //alternative syntax
      builder.Entity<UserFollowing>( b => {
        b.HasKey( t => new {t.ObserverId,t.TargetId});        

        b.HasOne( o => o.Observer)
          .WithMany( u => u.Followings)
          .HasForeignKey( o => o.ObserverId)
          .IsRequired()
          .OnDelete(DeleteBehavior.Cascade);

        b.HasOne( t => t.Target)
          .WithMany( u => u.Followers)
          .HasForeignKey( o => o.TargetId)
          .IsRequired()
          .OnDelete(DeleteBehavior.Cascade);        
      });
        

    }
  }
}
