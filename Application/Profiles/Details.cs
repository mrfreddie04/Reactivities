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
  public class Details
  {
    public class Query: IRequest<Result<Profile>>
    {
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users
            .AsQueryable()
            .ProjectTo<Profile>(_mapper.ConfigurationProvider)           
            .FirstOrDefaultAsync( user => user.Username == request.Username);      

        return Result<Profile>.Success(user);
     
      }
    }
  }
}