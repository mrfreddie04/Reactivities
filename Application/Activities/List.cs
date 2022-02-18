using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;
using System.Linq;

namespace Application.Activities
{
  public class List
  {
    //Mediator class - any parameters are implemented as class properties
    public class Query : IRequest<Result<PagedList<ActivityDto>>> 
    {
      public ActivityParams Params { get; set; }
    }

    // Query type must be - TRequest : IRequest<TResponse>
    // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
      {
        _context = context;
        _mapper = mapper;
        _userAccessor = userAccessor;
      }

      public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var query =  _context.Activities
          .AsQueryable()
          .Where( d => d.Date >= request.Params.StartDate)
          .OrderBy(d => d.Date)
          .ProjectTo<ActivityDto>(
            _mapper.ConfigurationProvider,
            new {currentUsername=_userAccessor.GetUsername()});

        //Add filters - have access to attendee info thanks to projection
        if(request.Params.IsHost) 
        {
          query = query.Where( d => d.HostUsername == _userAccessor.GetUsername());
        }

        if(request.Params.IsGoing) 
        {
          query = query.Where( d => d.Attendees.Any( a => a.Username == _userAccessor.GetUsername()));
        }          

        var activities = await PagedList<ActivityDto>.CreateAsync( 
          query, 
          request.Params.PageNumber, 
          request.Params.PageSize);  

        return Result<PagedList<ActivityDto>>.Success(activities);
      }
    }
  }
}