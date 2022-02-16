using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Application.Comments;

namespace API.SignalR
{
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;
    public ChatHub(IMediator mediator)
    {
      _mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
      //save to the database - comment is Result<CommentDto> object
      var comment = await _mediator.Send(command);

      //send to all hub clients - we send comment.Value which is CommentDto object
      await Clients.Group(command.ActivityId.ToString())
        .SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
      //return base.OnConnectedAsync();
      //Get activityId
      var httpContext = Context.GetHttpContext();
      var acitvityId = httpContext.Request.Query["activityId"];

      //Join SignalR group
      await Groups.AddToGroupAsync(Context.ConnectionId, acitvityId);

      //get all commetns fro this event
      var result = await _mediator.Send(new List.Query(){ActivityId=Guid.Parse(acitvityId)});

      //send back to the newly connected client
      await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
  }
}