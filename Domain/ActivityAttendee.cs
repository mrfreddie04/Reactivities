using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class ActivityAttendee
    {
        //Reference AppUser
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        //Reference Activity
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }

        //Additional properties descrbing the relationship
        public bool IsHost { get; set; }
    }
}