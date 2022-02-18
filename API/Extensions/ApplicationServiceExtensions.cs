using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using MediatR;
using Application.Activities;
using Application.Core;
using Persistence;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Photos;
using System;

namespace API.Extensions
{
  public static class ApplicationServiceExtensions
  {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) 
    {
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
      });

      //SQLite - for dev
      // services.AddDbContext<DataContext>( opt => {
      //   opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
      // });

      //PostgresQL - in prep for deployment, db run locally, from docker container    
      // services.AddDbContext<DataContext>( opt => {
      //   opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
      // });            

      //PostgresQL - prod release, hosted by heroku
      services.AddDbContext<DataContext>(options =>
      {
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        string connStr;

        // Depending on if in development or production, use either Heroku-provided
        // connection string, or development connection string from env var.
        if (env == "Development")
        {
          // Use connection string from file.
          connStr = config.GetConnectionString("DefaultConnection");
        }
        else
        {
          // Use connection string provided at runtime by Heroku.
          var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

          // Parse connection URL to connection string for Npgsql
          connUrl = connUrl.Replace("postgres://", string.Empty);
          var pgUserPass = connUrl.Split("@")[0];
          var pgHostPortDb = connUrl.Split("@")[1];
          var pgHostPort = pgHostPortDb.Split("/")[0];
          var pgDb = pgHostPortDb.Split("/")[1];
          var pgUser = pgUserPass.Split(":")[0];
          var pgPass = pgUserPass.Split(":")[1];
          var pgHost = pgHostPort.Split(":")[0];
          var pgPort = pgHostPort.Split(":")[1];

          connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; SSL Mode=Require; Trust Server Certificate=true";
        }

        // Whether the connection string came from the local development configuration file
        // or from the environment variable from Heroku, use it to set up your DbContext.
        options.UseNpgsql(connStr);
      });

      services.AddCors(opt =>
      {
        opt.AddPolicy("CorsPolicy", policy =>
        {
          policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
          //policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
          //policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
      });   
      
      services.AddMediatR(typeof(List.Handler).Assembly);
      services.AddAutoMapper(typeof(MappingProfiles).Assembly);
      //services.AddTransient<ProfileFollowingResolver>();

      services.AddScoped<IUserAccessor, UserAccessor>();
      services.AddScoped<IPhotoAccessor,PhotoAccessor>();

      services.AddSignalR();

      services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

      return services;
    }
  }
}