using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Domain;
using System.Threading;

namespace API.Controllers
{
  public class ActivitiesController: BaseApiController
  {

    [HttpGet()]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
      return Ok(await Mediator.Send(new List.Query()));
    }        

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
      var activity = await Mediator.Send(new Details.Query(){Id = id});

      if(activity != null)
        return Ok(activity);

      return NotFound();  
    }    

    [HttpPost]  
    public async Task<IActionResult> CreateActivity([FromBody] Activity activity) 
    {
      return Ok( await Mediator.Send(new Create.Command(){Activity = activity}));
    }

    [HttpPut("{id}")] 
    public async Task<IActionResult> EditActivity(Guid id, [FromBody] Activity activity) 
    {
      activity.Id = id;
      return Ok( await Mediator.Send(new Edit.Command(){Activity = activity}));
    }    

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id) 
    {
      return Ok(await Mediator.Send(new Delete.Command(){Id=id}));
    }

  }
}