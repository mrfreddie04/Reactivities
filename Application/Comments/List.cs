using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Application.Core;
using Persistence;

namespace Application.Comments
{
  public class List
  {
    public class Query : IRequest<Result<List<CommentDto>>>
    {
      public Guid ActivityId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var comments = await _context.Comments
          .AsQueryable()
          .Where(c => c.Activity.Id == request.ActivityId)
          .OrderByDescending(c => c.CreatedAt)
          .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
          .ToListAsync();
          
        return Result<List<CommentDto>>.Success(comments);
      }
    }
  }
}