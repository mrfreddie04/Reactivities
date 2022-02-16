using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
  public class IsHostRequirement: IAuthorizationRequirement
  {      
  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
      _dbContext = dbContext;      
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
      //Get userId - AuthorizationHandlerContext gives us access to claims principal
      var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

      if(userId == null) return Task.CompletedTask;

      //Get acitvityId - from the Route parameters ( [HttpPut("{id}")] )
      var id = _httpContextAccessor.HttpContext?.Request.RouteValues
          .SingleOrDefault( x => x.Key == "id").Value?.ToString();
      if(id == null) return Task.CompletedTask;
      var activityId = Guid.Parse(id);

      return _dbContext.ActivityAttendees
        .AsNoTracking()
        .FirstOrDefaultAsync( att => att.AppUserId == userId && att.ActivityId == activityId)
        .ContinueWith( task => {
          var attendee = task.Result;
          if(attendee != null && attendee.IsHost)
            context.Succeed(requirement);
        });

      //get attendee record for this user and activity
      // var attendee = _dbContext.ActivityAttendees
      //   .AsNoTracking()
      //   .FirstOrDefaultAsync( att => att.AppUserId == userId && att.ActivityId == activityId)
      //   .Result; //we are overriding a method - cannont make it async, hence the blocking call here

      // //if not an attendee or not a host - unauthorized
      // if(attendee == null || !attendee.IsHost) return Task.CompletedTask;

      // //current user is the host of this activity - authorize!
      // context.Succeed(requirement); 

      // return Task.CompletedTask;
    }
  }
}