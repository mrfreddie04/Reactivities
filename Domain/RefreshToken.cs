using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
  public class RefreshToken
  {
    public int Id { get; set; }
    public AppUser AppUser { get; set; }
    public string Token { get; set; }
    public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsExpired 
    { 
      get => Expires < DateTime.UtcNow;
    }
    public DateTime? Revoked { get; set; }
    public bool IsActive 
    { 
      get => Revoked == null && !IsExpired; 
    }
  }
}