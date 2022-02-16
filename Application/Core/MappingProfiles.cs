using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Photos;
using AutoMapper;
using Domain;

namespace Application.Core
{
  public class MappingProfiles : Profile
  {
    public MappingProfiles()
    {            
      CreateMap<Activity, Activity>();

      CreateMap<Activity, ActivityDto>()
        .ForMember( 
          dest => dest.HostUsername, 
          opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(att => att.IsHost).AppUser.UserName));

      CreateMap<ActivityAttendee, AttendeeDto>()
        .ForMember(
          dest => dest.Username,
          opt => opt.MapFrom(src => src.AppUser.UserName))
        .ForMember(
          dest => dest.DisplayName,
          opt => opt.MapFrom(src => src.AppUser.DisplayName))
        .ForMember(
          dest => dest.Bio,
          opt => opt.MapFrom(src => src.AppUser.Bio))
        .ForMember(
          dest => dest.Image,
          opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));   

      CreateMap<Photo, PhotoDto>();

      CreateMap<AppUser, Application.Profiles.Profile>()
        .ForMember(
          dest => dest.Image,
          opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))      
        .ForMember(
          dest => dest.Username,
          opt => opt.MapFrom(src => src.UserName));

      CreateMap<Comment, CommentDto>()
        .ForMember(
          dest => dest.Username,
          opt => opt.MapFrom(src => src.Author.UserName))
        .ForMember(
          dest => dest.DisplayName,
          opt => opt.MapFrom(src => src.Author.DisplayName))
        .ForMember(
          dest => dest.Image,
          opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

    }
  }
}