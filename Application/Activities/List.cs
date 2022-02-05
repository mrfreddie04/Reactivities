using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class List
  {
    //Mediator class - any parameters are implemented as class properties
    public class Query : IRequest<List<Activity>> {}

    // Query type must be - TRequest : IRequest<TResponse>
    // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
    public class Handler : IRequestHandler<Query, List<Activity>>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.Activities.ToListAsync(cancellationToken);    
      }
    }
  }
}