using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
  public class List
  {
    //Mediator class - any parameters are implemented as class properties
    public class Query : IRequest<Result<List<ActivityDto>>> {}

    // Query type must be - TRequest : IRequest<TResponse>
    // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var activities =  await _context.Activities
          .AsQueryable()
          .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);   

        //that works, because circular reference error is triggered by the serializer when results are hended over 
        //to the controller to be send over via http
        // var activitiesDto = _mapper.Map<IReadOnlyList<Activity>,List<ActivityDto>>(activities);  

        return Result<List<ActivityDto>>.Success(activities);
      }
    }
  }
}