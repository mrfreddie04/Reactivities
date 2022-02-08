using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Details
    {
        //Mediator class - any parameters are implemented as class properties
        public class Query : IRequest<Result<Activity>> {
            public Guid Id { get; set; }
        }

        // Query type must be - TRequest : IRequest<TResponse>
        // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);    
                return Result<Activity>.Success(activity);
            }
        }        
    }
}