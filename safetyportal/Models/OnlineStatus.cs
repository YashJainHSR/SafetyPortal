using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class OnlineStatus
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public byte[] LastLogin { get; set; }
        public string ActiveStatus { get; set; }
    }
}
