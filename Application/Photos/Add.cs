using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Result<PhotoDto>> 
    {
      public IFormFile File {get; set;}
    }

    public class Handler : IRequestHandler<Command, Result<PhotoDto>>
    {
      private readonly DataContext _context;
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;
      private readonly IMapper _mapper;

      public Handler(DataContext context, 
        IPhotoAccessor photoAccessor, 
        IUserAccessor userAccessor,
        IMapper mapper
      )
      {
        _context = context;
        _photoAccessor = photoAccessor;
        _userAccessor = userAccessor;
        _mapper = mapper;
      }

      public async Task<Result<PhotoDto>> Handle(Command request, CancellationToken cancellationToken)
      {
        //get user with photos (eager loading)
        var user = await _context.Users
          .Include( u => u.Photos)
          .FirstOrDefaultAsync( user => user.UserName == _userAccessor.GetUsername());

        if(user == null) return null;  

        //if it fails, AddPhoto will throw an exception
        var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

        var photo = new Photo() 
        {
          Id = photoUploadResult.PublicId,
          Url = photoUploadResult.Url,
          IsMain = !user.Photos.Any( p => p.IsMain)
        };

        user.Photos.Add(photo);

        var photoDto = _mapper.Map<Photo,PhotoDto>(photo);

        var result = await _context.SaveChangesAsync() > 0;

        if(!result)
          return Result<PhotoDto>.Failure("Problem adding photo"); 

        return Result<PhotoDto>.Success(photoDto);  
      }
    }
  }
}