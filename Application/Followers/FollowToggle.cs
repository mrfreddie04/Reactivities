using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
  public class FollowToggle
  {
    public class Command : IRequest<Result<Unit>>
    {
      public string TargetUsername { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
      }
      
      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var observer = await _context.Users
          .FirstOrDefaultAsync( u => u.UserName == _userAccessor.GetUsername());
        if(observer == null) return null;  

        var target = await _context.Users
          .FirstOrDefaultAsync( u => u.UserName == request.TargetUsername);
        if(target == null) return null;          

        var following = await _context.UserFollowings
          .FindAsync( observer.Id, target.Id);

        if(following != null) 
        {
          _context.UserFollowings.Remove(following);
        }
        else 
        {
          _context.UserFollowings.Add(new UserFollowing()
          {
            Observer = observer,
            Target = target
          });
        }

        var result = await _context.SaveChangesAsync() > 0;

        return result
          ? Result<Unit>.Success(Unit.Value)
          : Result<Unit>.Failure("Failed to update following"); 
      }
    }

  }
}