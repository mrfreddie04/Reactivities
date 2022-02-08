using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class List
  {
    //Mediator class - any parameters are implemented as class properties
    public class Query : IRequest<Result<List<Activity>>> {}

    // Query type must be - TRequest : IRequest<TResponse>
    // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
    public class Handler : IRequestHandler<Query, Result<List<Activity>>>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
      {
        return Result<List<Activity>>.Success(await _context.Activities.ToListAsync(cancellationToken));
      }
    }
  }
}