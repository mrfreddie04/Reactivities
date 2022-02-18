using System.Collections.Generic;
using Application.Photos;

namespace Application.Profiles
{
  public class Profile
  {
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public bool Following { get; set; } //is current user following this profile
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public ICollection<PhotoDto> Photos { get; set; }      
  }
}