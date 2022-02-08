using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
  public class ExceptionMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(
      RequestDelegate next, 
      ILogger<ExceptionMiddleware> logger,
      IHostEnvironment env
    )
    {
      _next = next;
      _logger = logger;
      _env = env;
    }

    public async Task InvokeAsync(HttpContext context) {
      try {
        //request
        await _next(context);
        //response
      }
      catch(Exception ex) 
      {
        //if exception was thrown down the line
        _logger.LogError(ex, ex.Message); //goes to terminal window
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
        
        // creates response body in json format
        var response = _env.IsDevelopment() 
          ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
          : new AppException(context.Response.StatusCode, "Server Error");

        var options = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
        var json = JsonSerializer.Serialize(response, options);

        //writes to Response Body
        await context.Response.WriteAsync(json);
      }
    }
  }
}