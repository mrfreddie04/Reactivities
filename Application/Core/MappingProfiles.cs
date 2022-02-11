using System.Linq;
using Application.Activities;
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

      CreateMap<ActivityAttendee,Application.Profiles.Profile>()
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
          opt => opt.Ignore());                              
    }
  }
}