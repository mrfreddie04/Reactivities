using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class UpdateAttendance
  {
    public class Command: IRequest<Result<Unit>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;        
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context
            .Activities
			      .Include(act => act.Attendees)    
            .ThenInclude(att => att.AppUser)        
            .AsQueryable()              
            .FirstOrDefaultAsync( a => a.Id == request.Id);    

        if(activity == null) return null;   //null results in 404 sent to the client

        var user = await _context.Users
          .FirstOrDefaultAsync( user => user.UserName == _userAccessor.GetUsername());      

        if(user == null) return null;   //null results in 404 sent to the client      

        //For convenience - extract hostUserName & attendance status of current user
        //activity, Attendees & AppUser are in memory - so no need to use async method
        var hostUsername = activity.Attendees.FirstOrDefault(att => att.IsHost)?.AppUser.UserName;
        var attendance = activity.Attendees.FirstOrDefault( att => att.AppUser.UserName == user.UserName);

        //Make updates
        if(attendance != null && hostUsername == user.UserName)
        {
          //toggle event status
          activity.IsCancelled = !activity.IsCancelled;
        }

        if(attendance != null && hostUsername != user.UserName)
        {
          //delete attendee
          activity.Attendees.Remove(attendance);
        }

        if(attendance == null && hostUsername != user.UserName)
        {
          //add attendee
          attendance = new ActivityAttendee() {
            AppUser = user,
            //Activity = activity,
            IsHost = false
          };          
          activity.Attendees.Add(attendance);  
        }

        //Save changes to the data store
        var result = await _context.SaveChangesAsync() > 0;

        return result
          ? Result<Unit>.Success(Unit.Value)
          : Result<Unit>.Failure("Problem updating attendance");  
      }
    }    
  }
}