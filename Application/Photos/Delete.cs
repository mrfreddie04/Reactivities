using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class Delete
  {
    public class Command : IRequest<Result<Unit>> 
    {
      public string Id {get; set;}
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
      {
        _context = context;
        _photoAccessor = photoAccessor;
        _userAccessor = userAccessor;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        //get user with photos (eager loading)
        var user = await _context.Users
          .Include( u => u.Photos)
          .FirstOrDefaultAsync( user => user.UserName == _userAccessor.GetUsername());

        if(user == null) return null;  

        var photo = user.Photos.FirstOrDefault( p => p.Id == request.Id);

        if(photo == null) return null;

        if(photo.IsMain) return Result<Unit>.Failure("You cannot delete your main photo"); 

        var photoDeleteResult = await _photoAccessor.DeletePhoto(request.Id);
        
        if(photoDeleteResult == null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary"); 

        user.Photos.Remove(photo);

        //var p = await _context.Photos.FirstOrDefaultAsync(p => p.Id == photo.Id);
        //_context.Photos.Remove(p);

        var result = await _context.SaveChangesAsync() > 0;

        if(!result) return Result<Unit>.Failure("Problem deleting photo from DB"); 

        return Result<Unit>.Success(Unit.Value);  
      }
    }
  }
}