using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Details
    {
        //Mediator class - any parameters are implemented as class properties
        public class Query : IRequest<Result<ActivityDto>> {
            public Guid Id { get; set; }
        }

        // Query type must be - TRequest : IRequest<TResponse>
        // public interface IRequestHandler<in TRequest, TResponse> where TRequest : IRequest<TResponse>
        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;            

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;                
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context
                    .Activities
                    .AsQueryable()
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)                    
                    .FirstOrDefaultAsync( a => a.Id == request.Id);   

                return Result<ActivityDto>.Success(activity);
            }
        }        
    }
}