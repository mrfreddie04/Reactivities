using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using MediatR;
using AutoMapper;
using Application.Core;
using Application.Interfaces;
using Domain;
using Persistence;

namespace Application.Comments
{
  public class Create
  {
    public class Command: IRequest<Result<CommentDto>>
    {
      public string Body { get; set; }
      public Guid ActivityId { get; set; }
    }


    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(command => command.Body).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
      {
        _context = context;
        _userAccessor = userAccessor;
        _mapper = mapper;
      }

      public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.ActivityId);
        if(activity == null) return null;

        //we have to eagerly load photos, 
        //otherwise mapping Comment=>CommentDto (which retireves main photo) would not work 
        var user = await _context.Users
          .Include( u => u.Photos)
          .FirstOrDefaultAsync( u => u.UserName == _userAccessor.GetUsername());
        if(user == null) return null;

        var comment = new Comment() 
        {
          Activity = activity,
          Author = user,
          Body = request.Body
        };

        //activity.Comments.Add(comment);
        _context.Comments.Add(comment);

        var success = await _context.SaveChangesAsync() > 0;

        if(success)
          return Result<CommentDto>.Success(_mapper.Map<Comment,CommentDto>(comment));

        return Result<CommentDto>.Failure("Problem adding comment");
      }
    }
  }
}