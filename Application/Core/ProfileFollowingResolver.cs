using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;

namespace Application.Core
{
  public class ProfileFollowingResolver : IValueResolver<AppUser, Application.Profiles.Profile, bool>
  {
    // private readonly IUserAccessor _userAccessor;

    // public ProfileFollowingResolver(IUserAccessor userAccessor)
    // {
    //   _userAccessor = userAccessor;
    // }

    public bool Resolve(AppUser source, Profiles.Profile destination, bool destMember, ResolutionContext context)
    {
      // var userId = _userAccessor.GetUserId();
      // return source.Followers.Any( f => f.ObserverId == userId);
      return true;
    }
  }
}