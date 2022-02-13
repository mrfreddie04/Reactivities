using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
  public class Photo
  {
    public string Id { get; set; }    
    public string Url { get; set; }
    public bool IsMain { get; set; }

    //not needed - we will use automatic EF behavior to recognize this relationship
    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }    
  }
}