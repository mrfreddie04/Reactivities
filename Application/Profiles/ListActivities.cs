using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
  public class ListActivities
  {
    public class Query : IRequest<Result<List<UserActivityDto>>>   
    {
      public string Predicate { get; set; }
      public string Username { get; set; }      
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }      
      public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var query = _context.Activities
          .AsQueryable()
          .Where( d => d.Attendees.Any( a => a.AppUser.UserName == request.Username))
          .OrderBy( d => d.Date)
          .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider);

        var now = DateTime.UtcNow;  

        query = request.Predicate switch 
        {
            "hosting" => query.Where( d => d.HostUsername == request.Username),
            "past" => query.Where( d => d.Date <= now),
            _ => query.Where( d => d.Date > now)  
        };        
              
        var result = await query.ToListAsync();  

        return Result<List<UserActivityDto>>.Success(result);  
      }
    }
  }
}