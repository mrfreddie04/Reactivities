using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        //Mediator class - any parameters are implemented as class properties
        public class Query : IRequest<Activity> {
            public Guid Id { get; set; }
        }

        // Query type must be - TRequest : IRequest<TResponse>
        // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.FindAsync(request.Id);    
            }
        }        
    }
}