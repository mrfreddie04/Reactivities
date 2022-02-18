using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
  public class List
  {
    public class Query : IRequest<Result<List<Application.Profiles.Profile>>>
    {
      public string Predicate { get; set; }
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<Application.Profiles.Profile>>>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
      {
        _context = context;
        _userAccessor = userAccessor;
        _mapper = mapper;
      }
            
      public async Task<Result<List<Application.Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var profiles = new List<Application.Profiles.Profile>();

        // var user = await _context.Users.FirstOrDefaultAsync( u => u.UserName == request.Username);
        var query = _context.UserFollowings.AsQueryable();
        if(request.Predicate == "followers")
        {
          profiles = await query
            .Where(f => f.Target.UserName == request.Username)
            .Select(f => f.Observer)
            .ProjectTo<Application.Profiles.Profile>(
                _mapper.ConfigurationProvider, 
                new {currentUsername=_userAccessor.GetUsername()})
            .ToListAsync(cancellationToken);
        }    
        if(request.Predicate == "following")
        {
          profiles = await query
            .Where(f => f.Observer.UserName == request.Username)
            .Select(f => f.Target)
            .ProjectTo<Application.Profiles.Profile>(
                _mapper.ConfigurationProvider,
                new {currentUsername=_userAccessor.GetUsername()})
            .ToListAsync(cancellationToken);
        }  

        return Result<List<Application.Profiles.Profile>>.Success(profiles);
      }
    }
  }
}