using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FluentValidation.AspNetCore;
using API.Extensions;
using Application.Activities;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.Text.Json.Serialization;
using API.SignalR;

namespace API
{
  public class Startup
  {
    private readonly IConfiguration _config;

    public Startup(IConfiguration config)
    {
        _config = config;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers(opt => 
      {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      }).AddFluentValidation( config => {
        config.RegisterValidatorsFromAssemblyContaining<Create>();
      }).AddJsonOptions(opt => 
      {
        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opt.JsonSerializerOptions.WriteIndented = true;
      });

      services.AddApplicationServices(_config);

      services.AddIdentityServices(_config);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      //error handling middleware
      app.UseMiddleware<ExceptionMiddleware>();

      app.UseXContentTypeOptions();
      app.UseReferrerPolicy(opt => opt.NoReferrer());
      app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); //for XSS scripting protection
      app.UseXfo(opt => opt.Deny()); //prevent our app from being used in an iframe
      app.UseCsp(opt => opt
          .BlockAllMixedContent() //not allowed http with https
          //we are ok with anything generated from our domain (published js files & static content)
          .StyleSources(s => s.Self()
            .CustomSources("https://fonts.googleapis.com","https://cdn.jsdelivr.net")) 
          .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com","https://cdn.jsdelivr.net","data:"))
          .FormActions(s => s.Self())
          .FrameAncestors(s => s.Self())
          .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com","blob:"))
          .ScriptSources(s => s.Self())
      ); //content security policy

      if (env.IsDevelopment())
      {
        //app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
      }
      else 
      {
        //add Hsts header - does not work with heroku
        //app.UseHsts();
        app.Use(async (context, next) => 
        {
          context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
          await next.Invoke();
        });
      }

      //Enabled this middleware to switch dev to https (to use FB login)
      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseDefaultFiles();
      app.UseStaticFiles();

      app.UseCors("CorsPolicy");

      app.UseAuthentication();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<ChatHub>("/chat");
        endpoints.MapFallbackToController("Index", "Fallback");                
      });
    }
  }
}
